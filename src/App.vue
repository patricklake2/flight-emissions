<template>
  <v-app id="inspire">
    <nav-bar :items="routes" title="Leeds' Flight Emissions" />
    <v-content>
      <v-container fluid>
        <div class="container">
          <p v-if="errorMessage" style="color: red; font-weight:bold;">{{ errorMessage }}</p>
          <router-view :items="flights" />
        </div>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; Patrick Lake, <a href="https://odileeds.org">ODI Leeds</a> 2019</span>
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
    }
  },
  created() {
    this.$vuetify.theme.dark = true;
  },
  mounted() {
    var isoDate = this.date.toISOString().substring(0, 10); // current date in YYYY-MM-DD format
    this.dataUrl =
      "https://raw.githubusercontent.com/patricklake2/leeds-flight-emissions/master/flight-data/" +
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
  margin: 10px auto;
  text-align: center;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
