import pandas as pd
import requests, json, os, re
from datetime import date
from math import radians, cos, sin, asin, sqrt

def retrieveFlights(airport):
    response = requests.get(airport['url'])
    if not response:
        raise requests.RequestException()
    else:
        json_data = response.json()
        date_field = airport['flights_column_map']['time']
        today = date.today().strftime("%Y-%m-%d")
        today_data = [item for item in json_data if item[date_field][0:10] == today]
        today_data = today_data[0:3]
        df = pd.DataFrame(today_data)

        for key, val in airport['flights_column_map'].items():
            #remove any conflicting columns we dont want, then standardise column names
            if key in df.columns.values and key != val:
                df.drop(columns=[key], inplace=True)
            df.rename(columns={ val: key }, inplace=True)

        df['IATA'] = df.apply(fillBlankIATA, args=[json_data, airport['flights_column_map']], axis=1)
        df = df.loc[:, airport['flights_column_map'].keys()]
        return df
 
def fillBlankIATA(row, flights_json, json_col_map): #if IATA is missing, try find it by looking for departures going to same destination
    matches = [item for item in flights_json if item[json_col_map['n']] == row['n']]
    count = 0
    found = False
    while count < len(matches) and found == False:
        if not matches[count][json_col_map['IATA']] == '':
            return matches[count][json_col_map['IATA']]
        count += 1
    return row['IATA']

def calc_distance(lat1, lon1, lat2, lon2):  #great circle distance formula
    R = 6371.000        #earth's radius
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2  + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

def get_flight_type(row):
    if row.cc == 'GB':
        return 'Domestic'

    elif row.continent == 'EU' or row.km < 3700:
        return 'ShortHaul'

    else:
        return 'LongHaul'

def get_aircraft_inf(row, aircraft_df, api_creds):
    average_factors = {'Domestic' : 11.1, 'ShortHaul' : 11.8, 'LongHaul' : 26.9}
    
    #default values to use if API request doesn't work or credentials not specified
    code, name = '', ''
    factor = average_factors[row.type]

    if api_creds:
        url = "http://flightxml.flightaware.com/json/FlightXML2/FlightInfoEx?howMany=1&ident="
        flight_id = row.id
        request_url = f'{url}{flight_id}'
        basic_auth_creds = requests.auth.HTTPBasicAuth(api_creds['User'], api_creds['Key'])
        api_response = requests.get(request_url, auth=basic_auth_creds)

        code, name = '', ''
        factor = average_factors[row.type]

        if api_response:
            results_json = api_response.json()
            try:
                code = results_json['FlightInfoExResult']['flights'][0]['aircrafttype']
            except KeyError: 
                pass    #if no results we'll keep the default values specified above
        
            if not code == '':
                matches = aircraft_df[aircraft_df['Aircraft_Code'] == code]
                number_matches = len(matches)

                if number_matches == 1:
                    factor = matches['Emissions_factor'].values[0]
                    name = matches.Plane.values[0]

                elif number_matches > 1:
                    newMatches = matches[matches['Type'] == row.type]
                    factor = newMatches['Emissions_factor'].values[0]
                    name = newMatches.Plane.values[0]

    return code, name, factor

def prettifyFlightsJSON(data):
    text = json.dumps(data, indent=2)
    text = re.sub('\"geo\".*\s+(-?\d+\.\d+,)\s+(-?\d+\.\d+)\s+\]', r'"geo": [\1\2]', text)
    text = re.sub('\"aircraft\".*\s+(.*)\s+(.*)\s+\}', r'"aircraft": {\1 \2}', text)
    text = re.sub('\"to\".*\s+(.*)\s+(.*)\s+(.*)\s+(.*)\s+(.*)\s+\}', r'"to": {\1 \2 \3 \4 \5}', text)
    text = re.sub('\"emissions\".*\s+(.*)\s+(.*)\s+\}', r'"emissions": {\1 \2}', text)
    return text

def updateIndex(index, today, emissions, num_flights):
    index = re.sub('\"lastupdate\".*', fr'"lastupdate": "{today}",', index)
    index = re.sub('\"dates\"(.*)\]', fr'"dates"\1, "{today}"]', index)
    index = re.sub('\"emissions\"(.*)\]', fr'"emissions"\1, {emissions}]', index)
    index = re.sub('\"flights\"(.*)\]', fr'"flights"\1, {num_flights}]', index)
    return index
