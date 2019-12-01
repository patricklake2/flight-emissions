import pandas as pd
import requests, json, os, base64
from datetime import date
from math import radians, cos, sin, asin, sqrt

def retrieveFlights(airport):
    response = requests.get(airport['url'])
    if not response:
        raise requests.RequestException()
    else:
        json_data = response.json()
        date_field = airport['column_map']['DateTime']
        today = date.today().strftime("%Y-%m-%d")
        today_data = [item for item in json_data if item[date_field][0:10] == today]
        df = pd.DataFrame(today_data)
        for key, val in airport['column_map'].items():
            df.rename(columns={ val: key }, inplace=True)
        df['IATA'] = df.apply(fillBlankIATA, args=[json_data, airport['column_map']], axis=1)
        df = df.loc[:, airport['column_map'].keys()]
        return df
    
def fillBlankIATA(row, flights_json, json_col_map):
    matches = [item for item in flights_json if item[json_col_map['Destination']] == row['Destination']]
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
    if row.Country == 'United Kingdom':
        return 'Domestic'

    elif row.Continent == 'Europe' or row.Distance < 3700:
        return 'ShortHaul'

    else:
        return 'LongHaul'

#make a request to FlightAware's API using the flight number, then try to match it to an aircraft in my emission factors table.
def get_aircraft_inf(row, aircraft_df, api_creds):
    url = "http://flightxml.flightaware.com/json/FlightXML2/FlightInfoEx?howMany=1&ident="
    average_factors = {'Domestic' : 11.1, 'ShortHaul' : 11.8, 'LongHaul' : 26.9}

    flight_id = row.FlightNumber
    request_url = f'{url}{flight_id}'
    basic_auth_creds = requests.auth.HTTPBasicAuth(api_creds['User'], api_creds['Key'])
    api_response = requests.get(request_url, auth=basic_auth_creds)

    #default values (if data can't be found)
    code, name = '', ''
    factor = average_factors[row.Flight_Type]

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
                newMatches = matches[matches['Type'] == row.Flight_Type]
                factor = newMatches['Emissions_factor'].values[0]
                name = newMatches.Plane.values[0]
                
    return code, name, factor

#Pass a config object containing properties 'user', 'key', 'email', 'repo'
def github_commit(data, commit_msg, repo, path, user, email, key):
    encoded_bytes = base64.b64encode(data.encode("utf-8"))
    encoded_str = str(encoded_bytes, "utf-8")
    url = f'https://api.github.com/repos/{user}/{repo}/contents/{path}'
    credentials = requests.auth.HTTPBasicAuth(user, key)
    headers = {
        "message": commit_msg,
        "committer": {
            "name": user,
            "email": email
        },
        "content": encoded_str,
        "branch": "dev"
    }
    headers_str = json.dumps(headers)
    r = requests.put(url, auth=credentials, data=headers_str)
    print(r.text)