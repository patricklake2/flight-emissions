<template>
  <div>
    <nav-bar />
    <div id="main">
      <div class="seasonal">
        <div class="holder">
          <h1>Flight Emissions</h1>
          <select v-model="iata" class="button c14-bg">
            <option disabled>Pick an airport...</option>
            <option
              v-for="item in $root.rootIndex"
              :key="item.IATA"
              :value="item.IATA"
              >{{ item.name }}</option
            >
          </select>
        </div>
      </div>
      <div class="holder" v-if="!iata && !$route.path.startsWith('/about')">
        <p>Please select an airport above.</p>
      </div>
      <router-view
        v-if="iata || $route.path.startsWith('/about')"
        :flights="flights"
        :from="from"
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
import axios from "axios";

export default {
  components: {
    NavBar
  },
  data() {
    return {
      meta: {},
      from: {},
      flights: []
    };
  },
  methods: {
    async updateData() {
      if (this.$route.query.from) {
        let q = this.$route.query.from.toUpperCase();
        let entry = this.$root.rootIndex.find(item => item.IATA === q);
        if (entry) {
          const metaResponse = await axios.get(entry.index);
          this.meta = metaResponse.data;
          let flightDataURL = `${
            this.meta.directory
          }${this.meta.lastupdate.substring(0, 10)}.json`;
          const flightsResponse = await axios.get(flightDataURL);
          this.flights = flightsResponse.data.flights;
          this.from = flightsResponse.data.from;
        } else this.$router.push(this.$route.path);
      }
    }
  },
  computed: {
    iata: {
      get() {
        if (this.$route.query.from) return this.$route.query.from.toUpperCase();
        else return null;
      },
      set(newVal) {
        this.$router.push({ query: { ...this.$route.query, from: newVal } });
      }
    }
  },
  watch: {
    "$route.query.from": function() {
      this.updateData();
    }
  },
  mounted() {
    this.updateData();
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
