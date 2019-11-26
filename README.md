# [Leeds' Flight Emissions](https://patricklake2.github.io/leeds-flight-emissions)
I built this tool to demonstrate the impact Leeds' Bradford Airport has on the environment, since international flights are not included in local or national carbon budgets (even though they account for roughly 95% of total aviation emissions). It's fairly simple; it just takes all the daily departures from Leeds Bradford, and shows you how much CO2 emissions each flight produces, along with a daily total.

## Data
I've taken flight departure data directly from Leeds Bradford Airport's website. I've then used [FlightAware](https://flightaware.com) to determine the aircraft model, and used emission factors from [DEFRA's 2019 GHG Conversion Factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019), allowing me to estimate CO2e emissions for each flight. 

In the 'processing' folder, is some code which runs every night and does all of the above (for the following days flight). This is pushed to GitHub automatically - you can see it in the 'flight-data' folder.

## Website
I used Vue to build the website - it has some summary figures, a map showing the flights, and a table view. It's fairly basic at the moment as it's the first website I've built, so feedback would be appreciated.

## Things I'm working on
* I'm aware that just saying "100,000kg of CO2" isn't really that meaningful, so I'm going to add a bit of context - for example "this flight to Portugal is equal to 2000 average car journeys".
* The website doesn't display very well on mobile. I'm working to fix this.
* Adding a date picker - at the moment you can only see today's data
* May add more airports in the future - probably Manchester next.
