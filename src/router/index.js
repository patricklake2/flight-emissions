import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";

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
      import(/* webpackChunkName: "Table" */ "../views/TableView.vue")
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
    path: "*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/projects/flight-emissions/daily/",
  routes
});

export default router;
