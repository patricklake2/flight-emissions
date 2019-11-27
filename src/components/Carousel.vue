<template>
<div class="holder">
  <v-carousel
    height="200"
    hide-delimiter-background
    hide-delimiters
  >
    <v-carousel-item
      v-for="(item, i) in items"
      :key="i"
    >
      <v-sheet
        :color="colors[i]"
        height="100%"
      >
        <!-- <v-row
          width="100%"
          align="center"
          justify="center"
        > -->
        <div class="carousel-text">
          <!-- <div class="display-2">That's equivalent to...</div> -->
          <div class="display-4">{{ item['value'].toLocaleString() }}</div>
          <div class="headline">{{ item['caption'] }}</div>
        </div>
        <!-- </v-row> -->
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</div>
</template>

<script>
  export default {
      name: 'carousel',
      props: ["items"],
    data () {
      return {
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
          'indigo',
          'warning',
          'pink darken-2',
        ]
      }
    },
  }
</script>

<style scoped>
.carousel-text {
    width: 100%;
    height: 100%;
    text-align: center;
}
.display-2, .display-4, .headline {
    padding-top: 15px;
}
.holder {
    width: 700px;
    margin: auto;
}
</style>