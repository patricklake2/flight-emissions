<template>
  <div id="nav">
    <v-navigation-drawer v-model="drawer" app clipped right>
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.name" :to="item.path">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-right height="80px">
      <a href="https://odileeds.org">
        <v-img
          alt="ODI Logo"
          class="shrink mr-2"
          contain
          src="../assets/logo.svg"
          transition="scale-transition"
          width="200px"
        />
      </a>
      <v-toolbar-title class="display-1">{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "navbar",
  props: {
    items: Array,
    title: String
  },
  data: function() {
    return {
      drawer: null
    };
  }
};
</script>
