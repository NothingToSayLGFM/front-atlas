<template>
  <v-row>
    <v-col>
      <TableForOrganisations />
    </v-col>
  </v-row>
</template>

<script>
import TableForOrganisations from '@/components/table/TableForOrganisations'

export default {
  name: 'Table',
  layout: 'visualization',
  components: {
    TableForOrganisations
  },
  async fetch ({ store, query }) {
    await store.dispatch('getDataForTable', query)
  }
}
</script>
