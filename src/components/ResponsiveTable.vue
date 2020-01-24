<template>
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
          {{ row[header.key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "responsive-table",
  props: {
    headersProp: {
      type: Array,
      required: true
    },
    rowsProp: {
      type: Array, //array of json-style objects
      required: true
    }
  },
  data() {
    return {
      ascending: false,
      rows: [],
      headers: []
    };
  },
  watch: {
    rowsProp() {
      this.reset();
    },
    headersProp() {
      this.reset();
    }
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      this.rows = [...this.rowsProp];
      this.headers = [...this.headersProp];
      this.headers.forEach(col => {
        col.sortState = "unsorted";
      });
    },
    sortRows(key) {
      if (typeof this.rows[0][key] === "string") {
        this.rows.sort((a, b) => (a[key] < b[key] ? -1 : 1));
      } else this.rows.sort((a, b) => a[key] - b[key]);
      if (this.ascending) this.rows.reverse();
      this.ascending = !this.ascending;
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
</style>
