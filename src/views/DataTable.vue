<template>
  <div id="table-view">
    <div id="title">
      <img src="../assets/departures.png" />
      <h2>Departures</h2>
    </div>
    <v-data-table
      :headers="headers"
      :items="items"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:item.DateTime="{ item }">
        {{ item.DateTime.substring(11, 16) }}
      </template>
      <template v-slot:item.Distance="{ item }">
        {{ Math.round(item.Distance) }}
      </template>
      <template v-slot:item.Emissions="{ item }">
        <v-chip :color="getColor(item.Emissions)" dark>{{
          Math.round(item.Emissions).toLocaleString()
        }}</v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "data-table",
  props: ["items", "limits"],
  data() {
    return {
      headers: [
        { text: "Time", value: "DateTime" },
        {
          text: "Flight Number",
          sortable: false,
          value: "FlightNumber"
        },
        { text: "Destination", value: "Destination" },
        { text: "Distance (km)", value: "Distance" },
        { text: "CO2 Emissions (kg)", value: "Emissions" }
      ],
      boundaries: []
    };
  },
  methods: {
    getColor(Emissions) {
      if (Emissions < this.limits[0]) return "green";
      else if (Emissions < this.limits[1]) return "orange";
      else return "red";
    }
  }
};
</script>

<style scoped>
h2 {
  color: rgb(255, 253, 84);
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
#title {
  width: 100%;
  text-align: left;
  margin: 0px 0px 20px;
  height: 3.5em;
}
</style>
