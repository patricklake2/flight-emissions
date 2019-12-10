# [Flight Emissions](https://patricklake2.github.io/flight-emissions-viewer)
We built this tool to demonstrate the impact flights have on the environment, since international flights aren't are not included in local or national carbon budgets (even though they account for roughly 95% of total aviation emissions). We've started with Leeds Bradford Airport, but anyone can add an airport.

## How to Contribute
If you'd like to take responsibility for a specific airport, you'll need to:
* Retrieve daily departures data and calculate emissions estimates for each flight. The code that we wrote for Leeds Bradford Airport [is available on GitHub](https://github.com/patricklake2/leeds-flights-data/tree/master/processing), with some resources you may need (airport & aircraft data). You could adapt this, or write your own.
* Save the output as a json file (format to be defined). The filename should be the date in ISO format (YYYY-MM-DD.json)

We'd suggest putting these in a folder on a github repo - have a look at our [example for Leeds Bradford Airport](https://github.com/patricklake2/leeds-flights-data/tree/master/data)

You'll then need to add the airport name and the url of the folder where the data is located to the index.json file. You can do this yourself and open a pull request, or [open an issue](https://github.com/patricklake2/flight-emissions-viewer/issues/new) and I'll add it for you.

## Website
The website is build using Vue. It's currently fairly basic, but you're welcome to make improvements and open a pull request.

## Things I'm working on
* The website doesn't display very well on mobile. I'm working to fix this.
* Adding a date picker - at the moment you can only see today's data
* Hopefully add more airports in the future - probably Manchester next.
