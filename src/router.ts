import VueRouter, { RouteConfig } from 'vue-router';
import Vue from 'vue';

import Home from './views/Home.vue';
import About from './views/About.vue';


Vue.use(VueRouter);

const routes: RouteConfig[] = [
    { path: '/', name: 'Home', component: Home },
    { path: '/data', name: 'Data', component: () => import(/* webpackChunkName: "Table" */'./views/DeparturesTable.vue') },
    { path: '/map', name: 'Map', component: () => import(/* webpackChunkName: "Map" */'./views/Map.vue') },
    { path: '/about', name: 'About', component: About },
    { path: '*', redirect: '/' },
];

export default new VueRouter({
    routes,
    base: '/projects/flight-emissions/daily-v2/',
    mode: 'history',
});