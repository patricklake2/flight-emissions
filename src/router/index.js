import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/map",
    name: "Map",
    component: () =>
      import(/* webpackChunkName: "Map" */ "../views/LeafletMap.vue")
  },
  {
    path: "/data",
    name: "Data",
    component: () =>
      import(/* webpackChunkName: "Data" */ "../views/DataTable.vue")
  },
  {
    path: "/github",
    beforeEnter() {
      location.href = "https://github.com/patricklake2/leeds-flight-emissions";
    },
    name: "About / GitHub"
  },
  {
    path: "/odi",
    beforeEnter() {
      location.href = "https://odileeds.org";
    },
    name: "ODI Leeds"
  }
];

const router = new VueRouter({
  routes
});

export default router;
