<template>
  <div>
    <div v-if="!correctURL" class="c12-bg" style="text-align: center;">
      <div class="holder">
        Note: This website has moved to the
        <a
          href="https://odileeds.org/projects/flight-emissions"
          style="color: blue;"
          >ODI Leeds website</a
        >
      </div>
    </div>

    <nav-bar :pages="routes"></nav-bar>
    <div id="main">
      <div class="seasonal">
        <div class="holder">
          <h1>Leeds Bradford Flight Emissions</h1>
        </div>
      </div>
      <router-view :items="flights" :limits="quartiles"></router-view>
    </div>
    <footer class="b1-bg">
      <div class="holder">
        <ul>
          <li>
            <strong>&copy; Patrick Lake, ODI Leeds 2019</strong>
          </li>
          <li>
            Flight Data -
            <a href="https://www.leedsbradfordairport.co.uk/"
              >Leeds Bradford Airport</a
            >
            &amp;
            <a href="https://uk.flightaware.com/">FlightAware API</a>
          </li>
          <li>
            Airport Data -
            <a href="https://openflights.org">OpenFlights</a>
          </li>
          <li>
            Comparisons based on figures from the book "How bad are Bananas?" -
            &copy; Mike Berners-Lee
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
const axios = require("axios").default;

export default {
  components: {
    NavBar
  },
  props: {
    source: String
  },
  data() {
    return {
      date: new Date(),
      dataUrl: null,
      flights: [],
      errorMessage: null
    };
  },
  computed: {
    routes() {
      return this.$router.options.routes;
    },
    quartiles() {
      var data = [];
      for (let flight of this.flights) {
        data.push(flight["Emissions"]);
      }
      data.sort(function(a, b) {
        return a - b;
      });
      let q1 = this.percentile(data, 0.33);
      let q2 = this.percentile(data, 0.75);
      return [q1, q2];
    },
    correctURL() {
      let host = window.location.hostname;
      if (host != "odileeds.org") return false;
      else return true;
    }
  },
  methods: {
    percentile(arr, p) {
      if (arr.length === 0) return 0;
      if (typeof p !== "number") throw new TypeError("p must be a number");
      if (p <= 0) return arr[0];
      if (p >= 1) return arr[arr.length - 1];

      var index = arr.length * p,
        lower = Math.floor(index),
        upper = lower + 1,
        weight = index % 1;

      if (upper >= arr.length) return arr[lower];
      return arr[lower] * (1 - weight) + arr[upper] * weight;
    }
  },
  mounted() {
    var isoDate = this.date.toISOString().substring(0, 10); // current date in YYYY-MM-DD format
    // this.dataUrl =
    //   "https://raw.githubusercontent.com/patricklake2/leeds-flight-emissions/master/flight-data/" +
    //   isoDate +
    //   ".json";
    this.dataUrl =
      "https://cdn.jsdelivr.net/gh/patricklake2/flight-emissions@master/leeds-bradford/data/" +
      isoDate +
      ".json";

    axios
      .get(this.dataUrl)
      .then(response => {
        this.date = response.data["Date"];
        this.flights = response.data["Flights"];
      })
      .catch(() => {
        this.errorMessage =
          "Retrieval of flight data failed. Try refreshing the page.";
      });
  }
};
</script>
