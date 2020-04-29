<template>
  <article id="app">
    <v-header />
    <div id="main">
      <div class="seasonal">
        <div class="holder">
          <h1>Flight Emissions</h1>
          <select
            v-model="queryParam"
            class="button c14-bg"
          >
            <option disabled>
              Pick an airport...
            </option>
            <option
              v-for="(entry, i) in index"
              :key="i"
              :value="entry.IATA"
            >
              {{ entry.name }}
            </option>
          </select>
        </div>
      </div>
      <router-view
        v-if="loaded || $route.path.startsWith('/about')"
        :flights="flights"
        :meta="meta"
        :origin="origin"
      />
      <div
        v-if="!loaded && !$route.path.startsWith('/about')"
        class="holder"
      >
        <h2>
          Please select an Airport above
        </h2>
      </div>
    </div>
    <v-footer />
  </article>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import VHeader from './components/VHeader.vue';
import VFooter from './components/VFooter.vue';

import { Flight, IndexEntry, Location, Metadata, RawFlightData } from './resources/models';
import { getFlightData, getIndex, getMetadata } from './resources/utils';

@Component({
    components: { VHeader, VFooter },
})
export default class App extends Vue {
    index: IndexEntry[] = [];
    meta: Metadata = {} as Metadata;
    origin: Location = {} as Location;
    flights: Flight[] = [];
    loaded = false;

    mounted(): void {
        getIndex('https://raw.githubusercontent.com/odileeds/flight-data/master/index.json').then((data: IndexEntry[]) => {
            this.index = data;
            if(this.$route.query.from) this.setAirportFromQuery();
        });
    }

    @Watch('$route.query.from')
    onQueryChange(): void {
      if(this.$route.query.from)
        this.setAirportFromQuery();
    }

    async setAirportFromQuery(): Promise<void> {
        try {
            this.meta = await getMetadata(this.index, this.$route.query.from as string);
            const flightData: RawFlightData = await getFlightData(this.meta, this.meta.lastupdate);
            this.origin = flightData.from;
            this.flights = flightData.flights;
            this.loaded = true;
        } catch(e) {
            console.log(e);
        }
    }
    
    get queryParam(): string { return this.$route.query.from as string; }
    set queryParam(newVal: string) { this.$router.push({ query: {...this.$route.query, from: newVal } } ); }
}
</script>

<style>
@import url("https://odileeds.org/resources/style.css");
h1 {
  display: inline-block;
  vertical-align: top;
}
select {
  float: right;
  -webkit-appearance: menulist-button;
  -moz-appearance: menulist;
  /* position: relative;
  bottom: 5px; */
}
@media only screen and (max-width: 500px) {
  .seasonal {
    text-align: center;
  }
  h1 {
    display: block;
  }
  select {
    float: none;
    margin-top: 10px;
  }
}
</style>