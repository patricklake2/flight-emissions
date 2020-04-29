<template>
  <div class="holder">
    <ul class="grid">
      <li class="threecol">
        <a class="c12-bg">
          <h1>
            <animated-number
              :value="totalEmissions"
              :duration="1000"
            />
          </h1>
          <p>
            kg of CO
            <sub>2</sub> Emissions from today's departures
          </p>
        </a>
      </li>
      <li>
        <a class="c14-bg">
          <h1>
            <animated-number
              :value="flights.length"
              :duration="400"
            />
          </h1>
          <p>departures today</p>
        </a>
      </li>
      <li>
        <a class="c1-bg">
          <h1>
            <animated-number
              :value="uniqueDestinations"
              :duration="300"
            />
          </h1>
          <p>unique destinations</p>
        </a>
      </li>
      <li>
        <a class="c6-bg">
          <h1>
            <animated-number
              :value="totalDistance"
              :duration="1000"
            />
          </h1>
          <p>km travelled</p>
        </a>
      </li>
    </ul>
    <comparisons :total-emissions="totalEmissions" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import AnimatedNumber from '../components/AnimatedNumber.vue';
import Comparisons from '../components/Comparisons.vue';

import { Flight, Metadata } from '../resources/models';

@Component({
    components: { AnimatedNumber, Comparisons },
})
export default class Home extends Vue {
    @Prop({ required: true })
    meta!: Metadata;

    @Prop({ required: true })
    flights!: Flight[];

    get totalDistance(): number {
        if(this.flights.length == 0) return 0;
        return this.flights.reduce((acc: number, current: Flight) => (acc + current.dist.km), 0);
    }
    
    get totalEmissions(): number {
        if(this.flights.length == 0) return 0;
        const { emissions } = this.meta;
        return emissions[emissions.length - 1];
    }

    get uniqueDestinations(): number {
        if(this.flights.length == 0) return 0;
        const uniqueDests: string[] = [];
        this.flights.forEach((f: Flight) => {
            if(!uniqueDests.includes(f.to.IATA)) uniqueDests.push(f.to.IATA);
        });
        return uniqueDests.length;
    }
}
</script>

<style>
.grid li a{
  text-align: center;
}
.grid li h1 {
  font-size: 500%;
  margin-top: 40px !important;
}
.grid li p {
  margin-top: 55px;
  font-size: 1.5em;
}
</style>