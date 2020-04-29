<template>
  <div class="holder">
    <img src="../assets/departures.png">
    <h2 id="departures">
      Departures
    </h2>
    <p v-if="tableData.length == 0">
      There are no flights to show for this date.
    </p>
    <table v-if="tableData.length > 0">
      <thead>
        <tr>
          <th
            v-for="(header, i) in headers"
            :key="i"
            :class="{
              asc: header == sortedBy && ascending == true,
              desc: header == sortedBy && ascending == false,
            }"
            @click="changeSortColumn(header)"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in tableData"
          :key="i"
        >
          <td
            v-for="(header, n) in headers"
            :key="n"
            :data-header="header"
          >
            <span
              :class="{
                tile: header == 'CO2 Emissions (kg)',
                green: row[header] <= 10000 && header == 'CO2 Emissions (kg)',
                orange: row[header] < 20000 && header== 'CO2 Emissions (kg)',
                red: row[header] >= 20000 && header == 'CO2 Emissions (kg)'
              }"
            >
              {{ row[header] }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/**
 *  I haven't got round to converting this to Typescript yet, I may do at some point.
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export default {
    props: {
        flights: {
            required: true,
            type: Array,
        },
    },
  data() {
    return {
      ascending: true,
      sortedBy: 'Time',
    };
  },
  computed: {
      tableData() {
          const unsorted = this.flights.map(fl => {
              return {
                  Time: fl.time.split('T')[1],
                  'Flight Number': fl.id,
                  Destination: fl.to.n,
                  'Distance (km)': Math.round(fl.dist.km),
                  'CO2 Emissions (kg)': fl.emissions.kg,
              };
          });
          return this.sort([...unsorted], this.sortedBy);
      },
      headers() { 
        if(!this.tableData) return null;
        return Object.keys(this.tableData[0]);
      },
  },
  methods: {
    changeSortColumn(header) {
      this.sortedBy = header;
      this.ascending = !this.ascending;
    },
    sort(dataArray, header) {
      if(dataArray.length == 0) return [];
      const testVal = dataArray[0][header];
      if (typeof testVal === 'string' && isNaN(parseFloat(testVal)))
        dataArray.sort((a, b) => (a[header] < b[header] ? -1 : 1));
      else if (typeof testVal === 'number')
        dataArray.sort((a, b) => a[header] - b[header]);
      else dataArray.sort((a, b) => parseFloat(a[header]) - parseFloat(b[header]));
      if (!this.ascending) dataArray.reverse();
      this.sortedBy = header;
      return dataArray;
    },
  },
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
