<template>
  <div>
    <input
      id="hamburger"
      type="checkbox"
      class="hamburger"
    >
    <label
      for="hamburger"
      class="hamburger"
    >
      <span class="nv">Toggle menu (if not visible)</span>
    </label>
    <header class="b1-bg">
      <div class="glory b1-bg">
        <div class="glory-image" />
        <div class="glory-opacity">
          <div class="holder">
            <a href="https://odileeds.org">
              <img
                alt="ODI Leeds"
                src="../assets/odileeds.svg"
              >
            </a>
          </div>
        </div>
      </div>
      <div class="holder">
        <nav>
          <ul>
            <li
              v-for="(route, i) in routerLinks"
              :key="i"
            >
              <router-link
                :to="{ path: route.path, query: { ...$route.query } }"
                :class="{ seasonal: $route.path == route.path }"
              >
                {{ route.name }}
              </router-link>
            </li><li><a href="https://odileeds.org">ODI Leeds</a></li>
          </ul>
        </nav>
      </div>
    </header>
  </div>
</template>

<script>
export default {
    computed: {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        routerLinks() { return this.$router.options.routes; },
    },
};
</script>