# Leeds Bradford Airport Flight Emissions Data
This is a simple utility which runs daily, retrieving daily departures from Leeds Bradford Airport, and estimates the carbon emissions from each flight, based on the distance and aircraft model.

The data is displayed on my flight emissions website, but you can also download the raw data from the data folder, to do whatever you want with it.

## Data
I've taken flight departure data directly from Leeds Bradford Airport's website. I've then used [FlightAware](https://flightaware.com) to determine the aircraft model, and used emission factors from [DEFRA's 2019 GHG Conversion Factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019), allowing me to estimate CO2e emissions for each flight. 

In the 'processing' folder, is some code which runs every night and does all of the above (for the following days flight). This just runs as a cron job and then pushes the output to github.

## Re-use
I've tried to make this as adaptable as possible so that it can be re-used for other airports. There's instructions for this in the processing folder.