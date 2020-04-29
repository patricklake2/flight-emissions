<template>
  <div class="slider">
    <ul
      id="customize-controls"
      class="controls"
    >
      <li>‹</li>
      <li>›</li>
    </ul>
    <ul id="slider-content">
      <li
        v-for="item in items"
        :key="item.caption"
        :class="item.color"
      >
        <div class="flex">
          <p>
            <span class="value">
              {{ item.value.toLocaleString() }}
            </span>
            <span class="caption">
              {{ item.caption }}
            </span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { tns } from 'tiny-slider/src/tiny-slider';
import 'tiny-slider/dist/tiny-slider.css';

export default {
  props: {
      totalEmissions: {
          type: Number,
          required: true,
      },
  },
  data() {
      return {
           emissionComparisons: [
        {
          emissionsPerItem: 10000,
          text: 'people\'s annual carbon footprint',
          color: 'c9-bg',
        },
        {
          emissionsPerItem: 0.071,
          text: 'cups of tea (with milk)',
          color: 'c14-bg',
        },
        {
          emissionsPerItem: 0.021,
          text: 'cups of tea (without milk)',
          color: 'c6-bg',
        },
        {
          emissionsPerItem: 1.4,
          text: 'miles by bus',
          color: 'c1-bg',
        },
        {
          emissionsPerItem: 0.3,
          text: 'pints of local beer',
          color: 'c12-bg',
        },
        {
          emissionsPerItem: 1.7,
          text: '15 minute showers',
          color: 'c8-bg',
        },
        {
          emissionsPerItem: 4.4,
          text: 'miles driving in heavy congestion',
          color: 'c13-bg',
        },
        {
          emissionsPerItem: 2.4,
          text: 'washing machine & tumble dry cycles',
          color: 'c4-bg',
        },
      ],
      };
  },
  computed: {
      items() {
          return this.emissionComparisons.map(item => {
              return {
                  value: Math.round(this.totalEmissions / item.emissionsPerItem),
                  caption: item.text,
                  color: item.color,
              };
          });
      },
  },
  mounted() {
    tns({
      container: '#slider-content',
      items: 1,
      slideBy: 'page',
      autoplay: true,
      autoplayText: ['▶', '❚❚'],
      nav: true,
      controlsContainer: '#customize-controls',
    });
  },
};
</script>

<style>
@import url('https://odileeds.org/resources/slider.css');
.flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0;
    margin-top: 3em;
}
.flex p {
    width: 100%;
    text-align: center;
    padding: 0;
    display: block;
    line-height: 2rem;
}
.flex .value {
    font-size: 6rem;
}
.flex .caption {
    font-size: 2.5rem;
}
</style>