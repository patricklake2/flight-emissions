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

const router = new VueRouter({
    routes,
    base: '/projects/flight-emissions/daily/',
    mode: 'history',
});

router.afterEach(() => {
    Vue.nextTick().then(() => {
        ODI.log.add('action=view');
    });
});

export default router;
