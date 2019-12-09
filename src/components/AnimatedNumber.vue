<template>
  <span>{{ tweeningValue }}</span>
</template>

<script>
import TWEEN from "@tweenjs/tween.js";
export default {
  name: "animated-number",
  props: {
    value: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 500
    }
  },
  data: function() {
    return {
      tweeningValue: null
    };
  },
  watch: {
    value: function(newValue, oldValue) {
      this.tween(oldValue, newValue);
    }
  },
  beforeMount() {
    this.tweeningValue = 0;
  },
  mounted: function() {
    this.tween(0, this.value);
  },
  methods: {
    tween: function(startValue, endValue) {
      var vm = this;

      function animate() {
        if (TWEEN.update()) {
          requestAnimationFrame(animate);
        }
      }
      new TWEEN.Tween({
        tweeningValue: startValue
      })
        .to(
          {
            tweeningValue: endValue
          },
          vm.duration
        )
        .onUpdate(function(object) {
          vm.tweeningValue = Math.round(object.tweeningValue).toLocaleString();
        })
        .start();
      animate();
    }
  }
};
</script>
