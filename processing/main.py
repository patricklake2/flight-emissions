import pandas as pd
import requests, json, os
from math import radians, cos, sin, asin, sqrt
from datetime import date
import constant       #file containing constants

def get_data():
    response = requests.get(constant.DEPARTURES_URL)
    today = date.today()

    if response == False:
        exit()

    else:
        departures_json = response.json()

        departures_today = [x for x in departures_json if x['scheduled_time'][0:10] == today.strftime("%Y-%m-%d")]
        departures = pd.DataFrame(departures_today)
        departures = departures.loc[:,['flight_ident','scheduled_time', 'airline', 'airport_name','airport_iata']]
        departures.columns = ['Flight_Number','Time', 'Airline', 'Airport_Name','IATA']

        working_dir = os.path.dirname(os.path.dirname(__file__))
        airports = pd.read_csv(os.path.join(working_dir, 'processing/data/airports.csv'))
        aircraft = pd.read_csv(os.path.join(working_dir, 'processing/data/aircraft.csv'))

        departures = pd.merge(departures, airports, how='left', on='IATA')

        start_lat = (float)(airports.Lat[airports.IATA == 'LBA'])
        start_lon = (float)(airports.Lon[airports.IATA== 'LBA'])
        departures['Distance'] = departures.apply(lambda row: get_distance(start_lat, start_lon, row.Lat, row.Lon), axis=1)
        departures['Flight_Type'] = departures.apply(get_flight_type, axis=1)
        
        with open(os.path.join(working_dir, 'processing/data/api_auth.json')) as fp:   # 'api_auth.json' is not on github as it contains my flightaware api key.
            credentials = json.load(fp)
        departures[['Aircraft_Code', 'Aircraft_Name', 'Emissions_Factor']] = departures.apply(get_aircraft_inf, args=[aircraft, credentials], axis=1, result_type='expand')
        departures['Emissions'] = departures.apply(lambda row: row.Distance * row.Emissions_Factor, axis=1)

        departures.Lat = departures.apply(lambda row: round(row.Lat, 5), axis=1)
        departures.Lon = departures.apply(lambda row: round(row.Lon, 5), axis=1)
        departures.Distance = departures.apply(lambda row: round(row.Distance, 2), axis=1)
        departures.Emissions = departures.apply(lambda row: round(row.Emissions, 2), axis=1)
        export_path = os.path.join(working_dir, f'flight-data/{today.strftime("%Y-%m-%d")}.json')
        create_json(departures, export_path)

#helper functions

#great circle distance calculation
def get_distance(lat1, lon1, lat2, lon2):
    R = 6371.000        #earth's radius
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2  + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

#make a request to FlightAware's API using the flight number, then try to match it to an aircraft in my emission factors table.
def get_aircraft_inf(row, aircraft_df, api_creds):
    flight_id = row.Flight_Number
    request_url = f'{constant.API_ENDPOINT}{flight_id}'
    basic_auth_creds = requests.auth.HTTPBasicAuth(api_creds['User'], api_creds['Key'])
    api_response = requests.get(request_url, auth=basic_auth_creds)

    if not api_response:
        code,name = '',''
        factor = constant.AVE_FACTORS[row.Flight_Type] #if there's a problem, just use the average emissions factor for the type of flight
    else:
        results_json = api_response.json()
        try:
            code = results_json['FlightInfoExResult']['flights'][0]['aircrafttype']
        except KeyError: #if no results 
            code = ''
            name = ''
            factor = constant.AVE_FACTORS[row.Flight_Type]

        if not code == '':
            matches = aircraft_df[aircraft_df['Aircraft_Code'] == code]
            number_matches = len(matches)

            if number_matches == 0:
                name = ''
                factor = constant.AVE_FACTORS[row.Flight_Type]

            elif number_matches == 1:
                factor = matches['Emissions_factor'].values[0]
                name = matches.Plane.values[0]

            elif number_matches > 1:
                newMatches = matches[matches['Type'] == row.Flight_Type]
                factor = newMatches['Emissions_factor'].values[0]
                name = newMatches.Plane.values[0]
    
    return code, name, factor

def get_flight_type(row):
    if row.Country == 'United Kingdom':
        return 'Domestic'

    elif row.Continent == 'Europe' or row.Distance < 3700:
        return 'ShortHaul'

    else:
        return 'LongHaul'

def create_json(df, filename):
    output = {}
    output['Date'] = date.today().strftime('%Y-%m-%d')
    flights = []
    for _,row in df.iterrows():
        flight = {}
        for col in df.columns.values:
            flight[col] = row[col]
        flights.append(flight)
    output['Flights'] = flights
    with open(filename, 'w+') as fp:
        json.dump(output, fp, indent=2)

get_data()