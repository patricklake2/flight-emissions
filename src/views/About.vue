<template>
  <div class="holder">
    <h2>About</h2>
    <p>
      I built this tool to demonstrate the impact Leeds' Bradford Airport has on
      the environment, since international flights are not included in local or
      national carbon budgets (even though they account for roughly 95% of total
      aviation emissions). It's fairly simple; it just takes all the daily
      departures from Leeds Bradford, and shows you how much CO2 emissions each
      flight produces, along with a daily total.
    </p>

    <h3>Data</h3>

    <p>
      Departures data is taken directly from Leeds Bradford Airport's website.
      The distance can then be calculated by using the latitude &amp; longitude
      of the destination airport (using data from
      <a href="https://openflights.org/data.html">OpenFlights.org</a>).
      <a href="https://flightaware.com">FlightAware</a>'s API is used to search
      for the aircraft model used for each flight. The emissions factor for that
      aircraft, given in
      <a
        href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019"
      >
        DEFRA's 2019 GHG Conversion Factors </a
      >, is then multiplied by the distance to give an estimate for emissions.
      <br />All of this processing is done by a Python script which runs at
      midnight, processing that day's flights.
    </p>

    <h3>Things I'm working on</h3>
    <ul>
      <li>
        Adding a date picker, and the ability to compare days - at the moment
        the website only shows the current day's data
      </li>
      <li>
        Adding more airports. Manchester Airport will be next (very shortly!)
      </li>
      <li>
        Looking for a way to determine the aircraft model for each flight
        <strong>without</strong> using FlightAware, as this is not open data.
      </li>
    </ul>
    <p>
      Feedback, comments, ideas and contributions are all welcomed - all the
      code is on
      <a href="https://github.com/patricklake2/leeds-flight-emissions">GitHub</a
      >. You can also <a href="https://twitter.com/PatrickTLake">tweet me.</a>
    </p>
  </div>
</template>

<script>
export default {
  name: "about"
};
</script>
