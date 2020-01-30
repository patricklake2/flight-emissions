<template>
  <div class="holder">
    <img src="../assets/departures.png" />
    <h2 id="departures">Departures</h2>
    <table>
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header.key"
            :class="header.sortState"
            @click="sortRows(header.key)"
          >
            {{ header.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td
            v-for="header in headers"
            :key="header.key"
            :data-header="header.name"
          >
            <span
              :class="{
                tile: header.key == 'kg',
                green: row.kg < emissionQuartiles[0] && header.key == 'kg',
                orange: row.kg < emissionQuartiles[1] && header.key == 'kg',
                red: row.kg >= emissionQuartiles[1] && header.key == 'kg'
              }"
            >
              {{ row[header.key] }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import getPercentile from "../lib/percentile.js";

export default {
  name: "table-view",
  props: {
    flights: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      ascending: false,
      rows: [],
      headers: [
        { name: "Time", key: "time" },
        { name: "Flight Number", key: "id" },
        { name: "Destination", key: "n" },
        { name: "Distance (km)", key: "km" },
        { name: "CO2 Emissions (kg)", key: "kg" }
      ]
    };
  },
  watch: {
    flights() {
      this.inititalise();
    }
  },
  mounted() {
    this.inititalise();
  },
  updated() {
    // let cells = document.querySelectorAll(
    //   "td[data-header='CO2 Emissions (kg)'] span"
    // );
    // cells.forEach(cell => {
    //   cell.classList.remove(...cell.classList);
    //   cell.classList.add("tile");
    //   let value = parseFloat(cell.innerText);
    //   if (value < this.emissionQuartiles[0]) cell.classList.add("green");
    //   else if (value < this.emissionQuartiles[1]) cell.classList.add("orange");
    //   else cell.classList.add("red");
    //   cell.innerText = Math.round(value).toLocaleString();
    // });
  },
  computed: {
    emissionQuartiles() {
      let emissionsArr = this.rows.map(fl => fl.kg);
      emissionsArr.sort((a, b) => a - b);
      return [
        getPercentile(emissionsArr, 0.25),
        getPercentile(emissionsArr, 0.75)
      ];
    }
  },
  methods: {
    inititalise() {
      if (this.flights) {
        this.rows = [];
        this.flights.forEach(flight => {
          let flatData = {};
          flatData.time = flight.time.split("T")[1];
          flatData.id = flight.id;
          flatData.n = flight.to.n;
          flatData.km = Math.round(flight.km);
          flatData.kg = flight.emissions.kg;
          this.rows.push(flatData);
        });
        this.headers.forEach(col => {
          col.sortState = "unsorted";
        });
      }
    },
    sortRows(key) {
      let testVal = this.rows[0][key];
      if (typeof testVal === "string" && isNaN(parseFloat(testVal)))
        this.rows.sort((a, b) => (a[key] < b[key] ? -1 : 1));
      else if (typeof testVal === "number")
        this.rows.sort((a, b) => a[key] - b[key]);
      else this.rows.sort((a, b) => parseFloat(a[key]) - parseFloat(b[key]));
      this.ascending = !this.ascending;
      if (!this.ascending) this.rows.reverse();
      this.headers.forEach(col => {
        if (col.key === key && this.ascending) col.sortState = "asc";
        else if (col.key === key && !this.ascending) col.sortState = "desc";
        else col.sortState = "unsorted";
      });
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

table {
  width: 100%;
  table-layout: fixed;
}
th,
td {
  padding: 10px 0px 10px 10px;
  width: auto;
}
tr {
  border: 1px solid #dcdcdc;
}
th {
  text-align: left;
  vertical-align: text-top;
  font-size: 1.25em;
}
th::after {
  float: right;
  font-size: 1.5em;
}
th:hover {
  cursor: pointer;
}
th.unsorted:hover::after {
  content: "\021F5";
}
th.asc::after {
  content: "\02191";
  position: relative;
  bottom: 4.8px;
  right: 1.55px;
}
th.desc::after {
  content: "\02193";
  position: relative;
  bottom: 4.2px;
  right: 8.8px;
}

/* display as tiles on small screens */
@media only screen and (max-width: 600px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  /* Hide table headers from view without decreasing accessibility */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    border: 1px solid #ccc;
  }

  td {
    /* make cells like rows */
    border: none;
    /* border-bottom: 1px solid #eee; */
    position: relative;
    padding-left: 50%;
    white-space: normal;
    text-align: left;
  }

  td::before {
    /* Add headers before each row */
    position: absolute;
    top: 10px;
    left: 8px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    text-align: left;
    font-weight: bold;
    content: attr(data-header);
  }
}

/* for color coding emission figures */
.tile {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 5px 10px 5px 10px;
  text-align: center;
  border-radius: 14px;
  color: white;
  font-weight: 444;
}
.red {
  background-color: red;
}
.orange {
  background-color: orange;
}
.green {
  background-color: green;
}
</style>
