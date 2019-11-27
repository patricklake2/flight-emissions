<template>
  <div class="dashboard">
    <div class="flexbox">
      <number-bubble
        :value="numberFlights"
        caption="flights today"
        :duration="600"
      ></number-bubble>
      <number-bubble
        :value="uniqueDests"
        caption="destinations"
        :duration="500"
      ></number-bubble>
      <number-bubble
        :value="distanceTravelled"
        caption="km travelled"
        :duration="750"
      ></number-bubble>
      <number-bubble
        :value="totalEmissions"
        caption="kg CO2e emissions"
        :duration="1000"
      ></number-bubble>
    </div>
    <div class="display-2">That's about the same as...</div>
    <carousel :items="carouselItems"></carousel>
  </div>
</template>

<script>
import NumberBubble from "../components/NumberBubble.vue";
import Carousel from "../components/Carousel.vue";

export default {
  name: "dashboard",
  components: {
    NumberBubble,
    Carousel
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
          text: "times an average person's carbon footprint"
        },
        {
          emissionsPerItem: 0.071,
          text: "cups of tea (with milk)"
        },
        {
          emissionsPerItem: 0.021,
          text: "cups of tea (without milk)"
        },
        {
          emissionsPerItem: 1.4,
          text: "miles by bus"
        },
        {
          emissionsPerItem: 0.3,
          text: "pints of local beer"
        },
        {
          emissionsPerItem: 1.7,
          text: "15 minute showers"
        },
        {
          emissionsPerItem: 4.4,
          text: "miles driving in heavy congestion"
        },
        {
          emissionsPerItem: 2.4,
          text: "washing machine & tumble dry cycles"
        }
      ]
    };
  },
  computed: {
    totalEmissions() {
      return this.sumFlightsProp("Emissions");
    },
    numberFlights() {
      return this.items.length;
    },
    distanceTravelled() {
      return this.sumFlightsProp("Distance");
    },
    uniqueDests() {
      var destIATAs = [];
      for (var flight of this.items) {
        if (!destIATAs.includes(flight["IATA"])) {
          destIATAs.push(flight["IATA"]);
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
          caption: item.text
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
  font-size: 3em;
  color: yellow;
}

.flexbox {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.display-2 {
  padding: 15px 0px 15px 15px;
}
</style>
