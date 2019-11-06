# Retrieve departures data for LBA, find destination airport latitude and longitude, calculate distance, 
# multiply by emissions factor, return html table

import constant
import json, requests, os
import pandas as pd
from datetime import date
from math import radians, cos, sin, asin, sqrt

log_string = ''

def log(text):
    global log_string
    log_string += text

def get_distance(lat1, lon1, lat2, lon2):
    R = 6371.000 
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2  + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

def get_aircraft_inf(row, aircraft_df, api_creds):
    flight_id = row['Flight ID']
    request_url = f'{constant.API_ENDPOINT}{flight_id}'
    log(f'Requesting aircraft info for {flight_id} from {request_url}\n')
    basic_auth_creds = requests.auth.HTTPBasicAuth(api_creds['User'], api_creds['Key'])
    api_response = requests.get(request_url, auth=basic_auth_creds)

    if not api_response:
        log(f'No response from {request_url}, using average emissions factor for flight type\n\n')
        code,name = '',''
        factor = constant.AVE_FACTORS[row['Flight Type']]
    else:
        results_json = api_response.json()
        code = results_json['FlightInfoExResult']['flights'][0]['aircrafttype']
        log(f'Returned aircraft code {code}\n')

        matches = aircraft_df[aircraft_df['Aircraft_Code'] == code]
        number_matches = len(matches)

        if number_matches == 0:
            log(f'No matches in DB for aircraft {code}, using average emissions factor for flight type\n\n')
            name = '(no match)'
            factor = constant.AVE_FACTORS[row['Flight Type']]

        elif number_matches == 1:
            factor = matches['Emissions_factor'].values[0]
            name = matches.Plane.values[0]
            plane_ftype = matches.Type.values[0]
            log(f'Matched aircraft to {name} (normal usage - {plane_ftype})\n\n')

        elif number_matches > 1:
            newMatches = matches[matches['Type'] == row['Flight Type']]
            factor = newMatches['Emissions_factor'].values[0]
            name = newMatches.Plane.values[0]
            plane_ftype = newMatches.Type.values[0]
            log(f'Matched aircraft to {name} (normal usage - {plane_ftype})\n\n')
    
    return code, name, factor

def get_flight_type(row):
    if row.Country == 'United Kingdom':
        return 'Domestic'

    elif row.Continent == 'Europe' or row['Distance (km)'] < 3700:
        return 'ShortHaul'

    else:
        return 'LongHaul'


#main

log(f'Requesting departures data from {constant.DEPARTURES_URL}\n')
response = requests.get(constant.DEPARTURES_URL)
today = date.today()

if response == False:
    log('No response\n')

else:
    departures_json = response.json()

    departures_today = [x for x in departures_json if x['scheduled_time'][0:10] == today.strftime("%Y-%m-%d")]
    departures = pd.DataFrame(departures_today)
    log(f'Retrieved {len(departures)} flights\n\n')
    departures = departures.loc[:,['flight_ident','scheduled_time','airport_name','airport_iata']]
    departures.columns = ['Flight ID','Time','Destination','IATA']

    airports = pd.read_csv('data/airports.csv')
    departures = pd.merge(departures, airports, how='left', on='IATA')
    aircraft = pd.read_csv('data/aircraft.csv')

    lba_lat = (float)(airports['Lat'][airports['IATA'] == 'LBA'])
    lba_lon = (float)(airports['Lon'][airports['IATA'] == 'LBA'])
    departures['Distance (km)'] = departures.apply(lambda row: get_distance(lba_lat, lba_lon, row.Lat, row.Lon), axis=1)
    departures['Flight Type'] = departures.apply(get_flight_type, axis=1)
    
    with open('data/api_auth.json') as fp:
        credentials = json.load(fp)
    departures[['Aircraft Code', 'Aircraft Name', 'Emissions Factor']] = departures.apply(get_aircraft_inf, args=[aircraft, credentials], axis=1, result_type='expand')
    departures['Emissions (kgCO2)'] = departures.apply(lambda row: row['Distance (km)'] * row['Emissions Factor'], axis=1)
    log('Finished retrieving aircraft & calculated emissions\n\n')

    departures['Lat'] = departures.apply(lambda row: round(row['Lat'], 5), axis=1)
    departures['Lon'] = departures.apply(lambda row: round(row['Lon'], 5), axis=1)
    departures['Distance (km)'] = departures.apply(lambda row: round(row['Distance (km)'], 2), axis=1)
    departures['Emissions (kgCO2)'] = departures.apply(lambda row: round(row['Emissions (kgCO2)'], 2), axis=1)
    filename = f'../flight-data/{today.strftime("%d-%m-%y")}.json'
    departures.to_json(filename, orient='records')
    log('Saved to json file')
#log_filename = f'{today.strftime("%d-%m-%y")}-log.txt'
