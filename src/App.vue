<template>
  <div>
    <div v-if="!correctURL" class="c12-bg" style="text-align: center;">
      <div class="holder">
        Note: You can now access this page through the
        <a
          href="https://odileeds.org/projects/flight-emissions"
          style="color: blue;"
          >ODI Leeds website</a
        >
        - more projects coming soon!
      </div>
    </div>
    <nav-bar :pages="routes"></nav-bar>
    <div id="main">
      <div class="seasonal">
        <div class="holder">
          <h1>Flight Emissions</h1>
          <select v-model="currentIATA" class="button c14-bg">
            <option disabled>Pick an airport...</option>
            <option
              v-for="item in rootIndex"
              :key="item.IATA"
              :value="item.IATA"
              >{{ item.name }}</option
            >
          </select>
        </div>
      </div>
      <div class="holder" v-if="errorMessage || !currentIATA">
        <p v-if="!currentIATA">Please select an airport above.</p>
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      </div>
      <router-view
        v-if="currentIATA"
        :items="flights"
        :meta="meta"
        :limits="quartiles"
      ></router-view>
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
      flights: [],
      rootIndex: [],
      meta: {},
      currentIATA: null,
      errorMessage: null
    };
  },
  computed: {
    routes() {
      return this.$router.options.routes.filter(route => route.name);
    },
    quartiles() {
      var data = [];
      for (let flight of this.flights) {
        data.push(flight["emissions"]["kg"]);
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
  watch: {
    currentIATA(newValue) {
      let pos = this.rootIndex.findIndex(item => item.IATA === newValue);
      axios
        .get(this.rootIndex[pos]["index"])
        .then(response => {
          this.meta = response.data;
          let flightDataURL = `${
            this.meta.directory
          }${this.meta.lastupdate.substring(0, 10)}.json`;
          return axios.get(flightDataURL);
        })
        .then(response => {
          this.flights = response.data.flights;
          // this.flights.forEach(fl => {
          //   fl.time = new Date(fl.time);
          // });
        });
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
    let indexURL =
      "https://raw.githubusercontent.com/odileeds/flight-data/master/index.json";
    axios.get(indexURL).then(response => {
      this.rootIndex = response.data;
      if (this.$route.params) {
        let iataFound = false;
        this.rootIndex.forEach(entry => {
          if (entry.IATA == this.$route.params.iataParam.toUpperCase()) {
            this.currentIATA = this.$route.params.iataParam.toUpperCase();
            iataFound = true;
          }
        });
        if (!iataFound) this.$router.push("/");
      }
    });
  }
};
</script>

<style scoped>
.seasonal {
  overflow: auto;
}
h1 {
  display: inline-block;
  vertical-align: top;
}
select {
  float: right;
  -webkit-appearance: menulist-button;
  -moz-appearance: menulist;
}
@media only screen and (max-width: 500px) {
  .seasonal {
    text-align: center;
  }
  h1 {
    display: block;
  }
  select {
    float: none;
    margin-top: 10px;
  }
}
</style>
