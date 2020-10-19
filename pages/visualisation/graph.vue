<template>
  <v-row :style="{marginTop: $vuetify.breakpoint.smAndDown ? '144px' : '0'}">
    <v-col class="pa-0">
      <EcosystemAtlasMod />
    </v-col>
  </v-row>
</template>

<script>
import EcosystemAtlasMod from '@/components/graph/EcosystemAtlasMod.vue'

export default {
  name: 'Graph',
  layout: 'graph',
  components: {
    EcosystemAtlasMod
  },
  async fetch ({ store, query }) {
    await store.dispatch('getGraphData', query)
  }
}
</script>
