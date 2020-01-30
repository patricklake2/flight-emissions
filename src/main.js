import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

Vue.config.productionTip = false;

async function loadApp() {
  const response = await axios.get(
    "https://raw.githubusercontent.com/odileeds/flight-data/master/index.json"
  );
  let index = response.data;
  index.sort((a, b) => (a.name < b.name ? -1 : 1));
  new Vue({
    data: {
      rootIndex: index
    },
    router,
    render: h => h(App)
  }).$mount("#app");
}

loadApp();
