# [Leeds' Flight Emissions](https://patricklake2.github.io/leeds-flight-emissions)
I built this tool to demonstrate the impact Leeds' Bradford Airport has on the environment, since international flights are not included in local or national carbon budgets (even though they account for roughly 95% of total aviation emissions). It's fairly simple; it just takes all the daily departures from Leeds Bradford, and shows you how much CO2 emissions each flight produces, along with a daily total.

## Data
I've taken flight departure data directly from Leeds Bradford Airport's website. I've then used [FlightAware](https://flightaware.com) to determine the aircraft model, and used emission factors from [DEFRA's 2019 GHG Conversion Factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019), allowing me to estimate CO2e emissions for each flight. 

In the 'processing' folder, is some code which runs every night and does all of the above (for the following days flight). This is pushed to GitHub automatically - you can see it in the 'flight-data' folder.

## Website
I used Vue to build the website - it has some summary figures, a map showing the flights, and a table view. It's fairly basic at the moment as it's the first website I've built, so feedback would be appreciated.

## How to use
1. Open your terminal, cd into the 'processing' folder, and then (assuming you have Python3.7 installed), run "python3 -m venv venv".
2. Run "source venv/bin/activate" then "pip3 install -r requirements.txt". This creates a virtual environment and installs the requirements to run the scripts.
3. If you have a FlightAware account, create a file in the processing folder called fa_auth.json. This should be in the format
```json
{
    "User" : "(your username)",
    "Key" : "(your api key)"
}
```
* FlightAware is only used for determining the aircraft model for each flight.
If you don't have an account, the script will still run, but the calculations will be considerably less accurate as they'll be based on average emission factors rather than aircraft-specific figures.
4. Run "python3 main.py", and you should see the output in the flight-data folder.

## Things I'm working on
* The website doesn't display very well on mobile. I'm working to fix this.
* Adding a date picker - at the moment you can only see today's data
* Hopefully add more airports in the future - probably Manchester next.
