<template>
  <div class="holder">
    <p>
      This is a simple tool to demonstrate the impact airports have on the
      environment, since international flights are not included in local or
      national carbon budgets (even though they account for roughly 95% of total
      aviation emissions). It's fairly simple; it just takes all the daily
      departures from a given airport, and shows you how much CO<sub>2</sub>
      emissions each flight produces, along with a daily total.
    </p>
    <ul class="grid">
      <li class="threecol">
        <a class="c12-bg">
          <h1>
            <animated-number
              :value="totalEmissions"
              :duration="1000"
            ></animated-number>
          </h1>
          <p>kg of CO<sub>2</sub> Emissions from today's departures</p>
        </a>
      </li>
      <li>
        <a class="c14-bg">
          <h1>
            <animated-number
              :value="numberFlights"
              :duration="400"
            ></animated-number>
          </h1>
          <p>departures today</p>
        </a>
      </li>
      <li>
        <a class="c1-bg">
          <h1>
            <animated-number
              :value="uniqueDests"
              :duration="300"
            ></animated-number>
          </h1>
          <p>unique destinations</p>
        </a>
      </li>
      <li>
        <a class="c6-bg">
          <h1>
            <animated-number
              :value="distanceTravelled"
              :duration="1000"
            ></animated-number>
          </h1>
          <p>km travelled</p>
        </a>
      </li>
    </ul>
    <h2>That's about the same as...</h2>
    <slider :items="carouselItems"></slider>
  </div>
</template>

<script>
import AnimatedNumber from "../components/AnimatedNumber.vue";
import Slider from "../components/Slider.vue";

export default {
  name: "home",
  components: {
    AnimatedNumber,
    Slider
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      emissionComparisons: [
        {
          emissionsPerItem: 10000,
          text: "people's annual carbon footprint",
          color: "c9-bg"
        },
        {
          emissionsPerItem: 0.071,
          text: "cups of tea (with milk)",
          color: "c14-bg"
        },
        {
          emissionsPerItem: 0.021,
          text: "cups of tea (without milk)",
          color: "c6-bg"
        },
        {
          emissionsPerItem: 1.4,
          text: "miles by bus",
          color: "c1-bg"
        },
        {
          emissionsPerItem: 0.3,
          text: "pints of local beer",
          color: "c12-bg"
        },
        {
          emissionsPerItem: 1.7,
          text: "15 minute showers",
          color: "c8-bg"
        },
        {
          emissionsPerItem: 4.4,
          text: "miles driving in heavy congestion",
          color: "c13-bg"
        },
        {
          emissionsPerItem: 2.4,
          text: "washing machine & tumble dry cycles",
          color: "c4-bg"
        }
      ]
    };
  },
  computed: {
    totalEmissions() {
      if (this.items.length != 0) {
        let arr = this.items.map(fl => fl["emissions"]["kg"]);
        const sum = (acc, current) => acc + current;
        return arr.reduce(sum);
      } else return 0;
    },
    numberFlights() {
      return this.items.length;
    },
    distanceTravelled() {
      if (this.items.length != 0) {
        let arr = this.items.map(fl => fl["km"]);
        const sum = (acc, current) => acc + current;
        return arr.reduce(sum);
      } else return 0;
    },
    uniqueDests() {
      var destIATAs = [];
      for (var flight of this.items) {
        if (!destIATAs.includes(flight["to"]["IATA"])) {
          destIATAs.push(flight["to"]["IATA"]);
        }
      }
      return destIATAs.length;
    },
    carouselItems() {
      var items = [];
      for (var item of this.emissionComparisons) {
        var number = Math.round(this.totalEmissions / item.emissionsPerItem);
        items.push({
          value: number,
          caption: item.text,
          color: item.color
        });
      }
      return items;
    }
  },
  methods: {
    sumFlightsProp: function(prop) {
      var total = 0;
      for (var flight of this.items) {
        total += flight[prop];
      }
      return total;
    }
  }
};
</script>

<style scoped>
h1 {
  font-size: 500%;
  margin-top: 30px !important;
}
li p {
  margin-top: 50px;
  font-size: 1.5em;
}
li {
  text-align: center;
}
h2 {
  text-align: center;
}
</style>
