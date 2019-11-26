<template>
  <div class="bubble">
    <h2>
      <animated-number :value="value" :duration="duration" />
    </h2>
    <p v-if="caption">{{ caption }}</p>
  </div>
</template>

<script>
import AnimatedNumber from "./AnimatedNumber";
export default {
  name: "number-bubble",
  components: {
    AnimatedNumber
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: false
    },
    caption: {
      type: String,
      required: false
    }
  }
};
</script>

<style scoped>
.bubble {
  height: 250px;
  width: 250px;
  border-radius: 125px;
  margin: 10px;
  /* background: radial-gradient(#95edc8, #ffffff); */
  background: radial-gradient(#22cf86, #ffffff);
  text-align: center;
}

h2 {
  font-size: 70px;
  margin: 68px auto 0px;
  display: inline-block;
  color: white;
}

p {
  font-size: 15px;
  width: 150px;
  margin: 0px auto;
}
</style>
