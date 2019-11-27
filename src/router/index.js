import Vue from "vue";
import VueRouter from "vue-router";
import DataTable from "../views/DataTable.vue";
import LeafletMap from "../views/LeafletMap.vue";
import Dashboard from "../views/Dashboard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Dashboard,
    icon: "mdi-view-dashboard"
  },
  {
    path: "/map",
    name: "Map",
    component: LeafletMap,
    icon: "mdi-map"
  },
  {
    path: "/data",
    name: "Data",
    component: DataTable,
    icon: "mdi-table"
  },
  {
    path: "/github",
    beforeEnter() {
      location.href = "https://github.com/patricklake2/leeds-flight-emissions";
    },
    name: "About / GitHub",
    icon: "mdi-github-circle"
  }
];

const router = new VueRouter({
  routes
});

export default router;
