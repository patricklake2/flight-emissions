<template>
  <div>
    <input type="checkbox" id="hamburger" class="hamburger" />
    <label for="hamburger" class="hamburger">
      <span class="nv">Toggle menu (if not visible)</span>
    </label>
    <header class="b1-bg">
      <div class="glory b1-bg">
        <div class="glory-image"></div>
        <div class="glory-opacity">
          <div class="holder">
            <a href="/">
              <img alt="ODI Leeds" src="../assets/odileeds.svg" />
            </a>
          </div>
        </div>
      </div>
      <div class="holder">
        <nav>
          <ul>
            <li v-for="page in pages" :key="page.name">
              <router-link :to="page.path" exact-active-class="seasonal">{{
                page.name
              }}</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  props: ["pages"]
};
</script>
