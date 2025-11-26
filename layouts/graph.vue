<template>
  <v-app>
    <Header />
    <AppFilter />
    <SearchGraph />
    <Switcher />
    <Zoom />
    <Timeline />
    <Legend />
    <SidebarGraphOrganisation v-if="selectedItem && selectedItem.edate" />
    <SidebarGraphCategory v-if="selectedItem && !selectedItem.edate" />
    <v-content>
      <v-container class="pa-0 ma-0">
        <nuxt />
      </v-container>
    </v-content>
    <Footer />
  </v-app>
</template>

<script>

import Header from '@/components/layout/Header.vue'
import AppFilter from '@/components/layout/AppFilter.vue'
import SearchGraph from '@/components/layout/SearchGraph.vue'
import Switcher from '@/components/layout/Switcher.vue'
import Zoom from '@/components/layout/Zoom.vue'
import Timeline from '@/components/layout/Timeline.vue'
import Legend from '@/components/layout/Legend.vue'
import SidebarGraphCategory from '@/components/layout/SidebarGraphCategory'
import SidebarGraphOrganisation from '@/components/layout/SidebarGraphOrganisation'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'Graph',
  components: {
    Header,
    AppFilter,
    SearchGraph,
    Switcher,
    Zoom,
    Timeline,
    Legend,
    SidebarGraphCategory,
    SidebarGraphOrganisation,
    Footer
  },
  computed: {
    selectedItem: {
      get () {
        return this.$store.getters.selectedItemLast
      }
    }
  }
}
</script>
