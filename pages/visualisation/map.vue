<template>
  <v-row :style="{marginTop: $vuetify.breakpoint.smAndDown ? '144px' : '0'}">
    <v-col class="pa-0">
      <EcosystemAtlasMap />
    </v-col>
  </v-row>
</template>

<script>
import EcosystemAtlasMap from '@/components/map/EcosystemAtlasMap.vue'

  export default {
  name: 'Map',
  layout: 'map',
  components: {
    EcosystemAtlasMap
  },
  async fetch ({ store, query }) {
    await store.dispatch('getMapData', query)
  }
}
</script>
