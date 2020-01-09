<template>
  <v-app id="inspire">
    <div class="holder">
      <div id="holder">
        <img src="../assets/departures.png" />
        <h2 id="departures">Departures</h2>
      </div>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        class="elevation-1"
        :dark="false"
      >
        <template v-slot:item.time="{ item }">
          {{ item.time.substring(11, 16) }}
        </template>
        <template v-slot:item.to.n="{ item }">
          {{ item.to.n }}
        </template>
        <template v-slot:item.km="{ item }">
          {{ Math.round(item.km) }}
        </template>
        <template v-slot:item.emissions.kg="{ item }">
          <v-chip :color="getColor(item.emissions.kg)" dark>{{
            Math.round(item.emissions.kg).toLocaleString()
          }}</v-chip>
        </template>
      </v-data-table>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "data-table",
  props: ["items", "limits"],
  data() {
    return {
      headers: [
        { text: "Time", value: "time" },
        {
          text: "Flight Number",
          sortable: false,
          value: "id"
        },
        { text: "Destination", value: "to.n" },
        { text: "Distance (km)", value: "km" },
        { text: "CO2 Emissions (kg)", value: "emissions.kg" }
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

<style>
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
th span {
  font-size: 1.5em;
}
</style>
