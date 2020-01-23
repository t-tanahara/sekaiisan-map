<template>
  <v-app>
    <v-app-bar
      app
      color="deep-purple accent-4"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>世界遺産マップ</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
      app
      absolute
      v-model="drawer"
    >
      <v-list-item>
        <v-list-item-icon>
          <v-icon></v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>絞り込み</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item>
          <v-select
            v-model="categories.selected"
            item-text="label"
            item-value="value"
            v-bind:items="categories.items"
            attach
            chips
            label="カテゴリー"
            multiple
            return-object
          ></v-select>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <Map :selected_category="categories.selected" />
    </v-content>
  </v-app>
</template>

<script>
import Map from '@/components/Map'

export default {
  name: 'App',

  components: {
    Map,
  },

  data: () => ({
    drawer: false,
    categories: {
      selected: [
        {label: '文化', value: 'Cultural'},
        {label: '自然', value: 'Natural'},
        {label: '複合', value: 'Mixed'},
      ],
      items: [
        {label: '文化', value: 'Cultural'},
        {label: '自然', value: 'Natural'},
        {label: '複合', value: 'Mixed'},
      ],
    },
  }),
};
</script>
