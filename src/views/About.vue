<template>
  <div class="holder">
    <h2>About</h2>
    <p>
      This website was built to demonstrate the impact international flights
      have on the environment, since they are not included in local or national
      carbon budgets (even though they account for roughly 95% of total aviation
      emissions).
    </p>

    <p>
      It simply shows daily flights and emissions from a given airport, along
      with some simple comparisons to highlight just how big those emission
      figures are.
    </p>

    <p>
      The tool is powered by our
      <a href="https://github.com/odileeds/flight-data"
        >flight data index on GitHub</a
      >. Anyone can volunteer to collect flight data for a specific airport,
      which they are responsible for hosting - they can then add the link to our
      centralised index, and the airport will be automatically added to this
      site.
    </p>

    <h3>Data</h3>

    <p>
      We host a centralised
      <a href="https://github.com/odileeds/flight-data"
        >flight data GitHub repo</a
      >, which simply contains an index with a list of airports data is being
      collected for, and where this data is stored. Anyone can volunteer to
      collect flight data for a specific airport, which they are responsible for
      hosting - they can then add the link to our index file, and the airport
      will be automatically added to this site. You can see our
      <a
        href="https://github.com/patricklake2/flight-emissions/tree/master/leeds-bradford"
        >sample methodology and code for Leeds Bradford Airport on GitHub.</a
      ><strong>
        All of the data is freely available for anyone to access and
        reuse.</strong
      >
    </p>

    <h4>Sources</h4>
    <p>
      In some cases departures data has been taken directly from the airport's
      website, but most of the airports we've added ourselves use
      <a href="https://flightaware.com">FlightAware's</a> API. We also use
      airport location data from
      <a href="https://openflights.org/data.html">OpenFlights.org</a>. The
      emission factors we use for different aircraft are taken from
      <a
        href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2019"
      >
        DEFRA's 2019 GHG Conversion Factors
      </a>
    </p>

    <h3>Improvements</h3>
    <p>I'm working on a few more things, including:</p>
    <ul>
      <li>
        Adding a date picker, and the ability to compare days - at the moment
        the website only shows the current day's data
      </li>
      <li>
        Allowing the user to select more than one airport at once, and either
        display total figures, or show two airports side-by-side for comparison.
      </li>
      <li>
        Getting more airports! We need help with this - take a look at our
        GitHub repo for instructions if you're interested, or get in touch.
      </li>
    </ul>
    <p>
      The source code for this website is also
      <a href="https://github.com/patricklake2/flight-emissions">on GitHub</a>
      if you want to take a look.
    </p>
    <p>
      Feedback, comments, ideas and contributions are all welcomed -
      <a href="mailto:patrick.lake@odileeds.org">email</a> or
      <a href="https://twitter.com/PatrickTLake">tweet</a> me.
    </p>
  </div>
</template>

<script>
export default {
  name: "about"
};
</script>
