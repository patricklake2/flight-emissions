import pandas as pd
import json, os, re
from datetime import date
import functions

working_dir = os.path.dirname(__file__) #gets the path of the directory this script is located in

with open(os.path.join(working_dir, 'config.json')) as fp:
    config = json.load(fp)

departures = functions.retrieveFlights(config)
airports_db = pd.read_csv(os.path.join(working_dir, 'resources/airports.csv'))
aircraft_db = pd.read_csv(os.path.join(working_dir, 'resources/aircraft.csv'))
departures = departures.merge(airports_db, on='IATA', how='left')

start_lat = round((float)(airports_db.lat[airports_db.IATA == config['IATA']]), 5)
start_lon = round((float)(airports_db.lon[airports_db.IATA == config['IATA']]), 5)

departures['km'] = departures.apply(lambda row: functions.calc_distance(start_lat, start_lon, row.lat, row.lon), axis=1)
departures['type'] = departures.apply(functions.get_flight_type, axis=1)

#The file referenced below is NOT open as it contains my API key. You can get one from FlightAware.
try:
    with open(os.path.join(working_dir, 'fa_auth.json')) as fp:
        credentials = json.load(fp)
except FileNotFoundError:
    credentials = None

departures[['code', 'name', 'f']] = departures.apply(functions.get_aircraft_inf, args=[aircraft_db, credentials], axis=1, result_type='expand')
departures['kg'] = departures.apply(lambda row: row.km * row.f, axis=1)

#round to a sensible number of decimal places
departures.lat = departures.apply(lambda row: round(row.lat, 5), axis=1)
departures.lon = departures.apply(lambda row: round(row.lon, 5), axis=1)
departures.km = departures.apply(lambda row: round(row.km, 2), axis=1)
departures.kg = departures.apply(lambda row: round(row.kg, 2), axis=1)

#create json
iata = config['IATA']
name = config['n']
cc = config['cc']
cont = config['continent']
output = {
    "from": {
        "n": name,
        "IATA": iata,
        "geo": [start_lon, start_lat],
        "cc": cc,
        "continent": cont
    }
}
flights = []
for _,row in departures.iterrows():
    flight = {}
    flight["id"] = row['id']
    formatted_time = re.sub('(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})', r'\1T\2Z', row['time'])
    flight["time"] = formatted_time
    flight['airline'] = row['airline']
    flight['aircraft'] = {}
    flight['aircraft']['code'] = row['code']
    flight['aircraft']['name'] = row['name']
    flight['to'] = {}
    flight['to']['n'] = row['n']
    flight['to']['IATA'] = row['IATA']
    flight['to']['geo'] = [row['lon'], row['lat']]
    flight['to']['cc'] = row['cc']
    flight['to']['continent'] = row['continent']
    flight['km'] = row['km']
    flight['emissions'] = {}
    flight['emissions']['f'] = row['f']
    flight['emissions']['kg'] = row['kg']
    flights.append(flight)
output['flights'] = flights

pretty_json = functions.prettifyFlightsJSON(output)

today = date.today().strftime("%Y-%m-%d")
filename = os.path.join(os.path.dirname(working_dir), f'data/{today}.json')
with open(filename, 'w+') as fp:
    fp.write(pretty_json)
    fp.close()

emissions = round(departures.kg.sum(), 2)
num_flights = len(departures)

indexPath = os.path.join(os.path.dirname(working_dir), f'data/index.json')
with open(indexPath, "r") as fp:
    index = fp.read()
    fp.close()
index = functions.updateIndex(index, today, emissions, num_flights)
with open(indexPath, 'w') as fp:
    fp.write(index)
    fp.close()
