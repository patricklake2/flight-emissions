<template>
  <v-app id="inspire">
    <nav-bar :items="routes" title="Leeds Bradford Flight Emissions" />
    <v-content>
      <v-container fluid>
        <div class="container">
          <p v-if="errorMessage" style="color: red; font-weight:bold;">
            {{ errorMessage }}
          </p>
          <router-view :items="flights" :limits="quartiles" />
        </div>
      </v-container>
    </v-content>
    <v-footer app>
      <span>
        &copy; Patrick Lake,
        <a href="https://odileeds.org">ODI Leeds</a> 2019
      </span>
    </v-footer>
  </v-app>
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
  created() {
    this.$vuetify.theme.dark = true;
  },
  mounted() {
    var isoDate = this.date.toISOString().substring(0, 10); // current date in YYYY-MM-DD format
    // this.dataUrl =
    //   "https://raw.githubusercontent.com/patricklake2/leeds-flight-emissions/master/flight-data/" +
    //   isoDate +
    //   ".json";
    this.dataUrl =
      "https://cdn.jsdelivr.net/gh/patricklake2/leeds-flight-emissions@master/flight-data/" +
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

<style scoped>
.container {
  /* margin: 10px auto; */
  text-align: center;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
