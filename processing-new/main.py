import pandas as pd
import json, os
from datetime import date
import functions

working_dir = os.path.dirname(__file__) #gets the path of the directory this script is located in

with open(os.path.join(working_dir, 'config.json')) as fp:
    config = json.load(fp)

for origin in config['airports']:
    departures = functions.retrieveFlights(origin)
    airports_db = pd.read_csv(os.path.join(working_dir, 'resources/airports.csv'))
    aircraft_db = pd.read_csv(os.path.join(working_dir, 'resources/aircraft.csv'))
    departures = departures.merge(airports_db, on='IATA', how='left')

    start_lat = (float)(airports_db.Lat[airports_db.IATA == origin['IATA']])
    start_lon = (float)(airports_db.Lon[airports_db.IATA == origin['IATA']])

    departures['Distance'] = departures.apply(lambda row: functions.calc_distance(start_lat, start_lon, row.Lat, row.Lon), axis=1)
    departures['Flight_Type'] = departures.apply(functions.get_flight_type, axis=1)

    #The file referenced below is NOT open as it contains my API key. You can get one from FlightAware.
    with open(os.path.join(working_dir, 'private/flightaware.json')) as fp:
        credentials = json.load(fp)
    departures[['Aircraft_Code', 'Aircraft_Name', 'Emissions_Factor']] = departures.apply(functions.get_aircraft_inf, args=[aircraft_db, credentials], axis=1, result_type='expand')
    departures['Emissions'] = departures.apply(lambda row: row.Distance * row.Emissions_Factor, axis=1)

    #round to a sensible number of decimal places
    departures.Lat = departures.apply(lambda row: round(row.Lat, 5), axis=1)
    departures.Lon = departures.apply(lambda row: round(row.Lon, 5), axis=1)
    departures.Distance = departures.apply(lambda row: round(row.Distance, 2), axis=1)
    departures.Emissions = departures.apply(lambda row: round(row.Emissions, 2), axis=1)

    #create json
    iata = origin['IATA']
    name = origin['Name']
    date = date.today().strftime("%Y-%m-%d")
    output_json = {
        "Date": date,
        "Airport": {
            "Name": name,
            "IATA": iata
        }
    }
    output_json['Flights'] = departures.to_dict(orient='records')
    output = json.dumps(output_json, indent=2)
    
    #again, the below file isn't public as it contains my github authentication token.
    with open(os.path.join(working_dir, 'private/github.json')) as fp:
        github_config = json.load(github_config)

    path = f'flight-data/{iata}/{date}.json'
    functions.github_commit(output, 'Added flight data', path, github_config)



