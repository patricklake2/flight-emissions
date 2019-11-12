# FlightCarbon
This is a fairly simple app I built, which monitors daily flight departures from Leeds Bradford Airport, then estimates the emissions for each flight.

## Background
Flying is incredibly carbon-intensive, but international flights **are not** included in the UK's national, or local emission figures.
This aims to raise a bit of awareness about the real cost of flying - especially at a time when an airport expansion is being discussed.

## Data
I've taken flight departure data directly from Leeds Bradford Airport's website. I've then combined this with data from [FlightAware](https://flightaware.com), and used emission factors from [DEFRA's 2019 GHG Conversion Factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019), allowing me to estimate CO2e emissions for each flight.

## App
The back-end is just a Python script which runs at midnight every night to retrieve that day's flight data, outputting it in JSON format and pushing to GitHub.
The front-end is hosted on GitHub pages and uses VueJS.
