import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import ViewData from "../views/ViewData.vue";

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
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/odi",
    beforeEnter() {
      location.href = "https://odileeds.org";
    },
    name: "ODI Leeds"
  },
  {
    path: "/table",
    name: "Table2",
    component: ViewData
  }
];

const router = new VueRouter({
  routes
});

export default router;
