<template>
  <v-list>
    <v-list-tile
        value="true"
        v-for="(item, i) in menu.items"
        :key="i"
        :to="{name:item.name}"
    >
      <v-list-tile-action>
        <v-icon v-html="item.icon"></v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title v-text="item.title"></v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    computed: {
      menu() {
        return store.state.menu;
      }
    }
  }
</script>