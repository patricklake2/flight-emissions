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
      <template v-slot:item.Time="{ item }">
        {{ item.Time.substring(11, 16) }}
      </template>
      <template v-slot:item.Emissions="{ item }">
        <v-chip :color="getColor(item.Emissions)" dark>{{
          item.Emissions
        }}</v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "data-table",
  props: ["items"],
  data() {
    return {
      headers: [
        { text: "Time", value: "Time" },
        {
          text: "Flight Number",
          sortable: false,
          value: "Flight_Number"
        },
        { text: "Destination", value: "Airport_Name" },
        { text: "Distance (km)", value: "Distance" },
        { text: "CO2 Emissions (kg)", value: "Emissions" }
      ],
      boundaries: []
    };
  },
  methods: {
    getColor(Emissions) {
      if (Emissions < 5000) return "green";
      else if (Emissions < 10000) return "orange";
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
