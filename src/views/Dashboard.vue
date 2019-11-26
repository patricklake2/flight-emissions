<template>
  <div class="dashboard">
    <p>
      A simple tool which estimates Carbon emissions produced by all flights
      departing from Leeds Bradford Airport.
      <br />My methodology and code can be found on GitHub.
    </p>
    <h1>Today</h1>
    <div class="flexbox">
      <number-bubble
        :value="numberFlights"
        caption="flights today"
        :duration="600"
      ></number-bubble>
      <number-bubble
        :value="uniqueDests"
        caption="destinations"
        :duration="500"
      ></number-bubble>
      <number-bubble
        :value="distanceTravelled"
        caption="km travelled"
        :duration="750"
      ></number-bubble>
      <number-bubble
        :value="totalEmissions"
        caption="kg CO2e emissions"
        :duration="1000"
      ></number-bubble>
    </div>
  </div>
</template>

<script>
import NumberBubble from "../components/NumberBubble.vue";
export default {
  name: "dashboard",
  components: {
    NumberBubble
  },
  props: {
    items: null
  },
  computed: {
    totalEmissions() {
      return this.sumFlightsProp("Emissions");
    },
    numberFlights() {
      return this.items.length;
    },
    distanceTravelled() {
      return this.sumFlightsProp("Distance");
    },
    uniqueDests() {
      var destIATAs = [];
      for (var flight of this.items) {
        if (!destIATAs.includes(flight["IATA"])) {
          destIATAs.push(flight["IATA"]);
        }
      }
      return destIATAs.length;
    }
  },
  methods: {
    sumFlightsProp: function(prop) {
      var total = 0;
      for (var flight of this.items) {
        total += flight[prop];
      }
      return total;
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 3em;
  color: yellow;
}

.flexbox {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>
