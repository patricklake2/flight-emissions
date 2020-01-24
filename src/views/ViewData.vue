<template>
  <div class="holder">
    <img src="../assets/departures.png" />
    <h2 id="departures">Departures</h2>
    <responsive-table
      :headersProp="headers"
      :rowsProp="tableData"
    ></responsive-table>
  </div>
</template>

<script>
import ResponsiveTable from "../components/ResponsiveTable.vue";

export default {
  name: "view-data",
  components: { ResponsiveTable },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { name: "Time", key: "time" },
        { name: "Flight Number", key: "id" },
        { name: "Destination", key: "n" },
        { name: "Distance (km)", key: "km" },
        { name: "CO2 Emissions (kg)", key: "kg" }
      ]
    };
  },
  computed: {
    tableData() {
      if (this.items) {
        let output = [];
        this.items.forEach(flight => {
          let newFlight = {};
          newFlight.time = flight.time;
          newFlight.id = flight.id;
          newFlight.n = flight.to.n;
          newFlight.km = Math.round(flight.km);
          newFlight.kg = Math.round(flight.emissions.kg);
          output.push(newFlight);
        });
        return output;
      } else return [];
    }
  }
};
</script>

<style scoped>
#departures {
  display: inline-block;
  position: relative;
  top: -0.2em;
  font-size: 3em;
  margin: 0px 15px;
}
img {
  height: 3.5em;
  display: inline-block;
}
</style>
