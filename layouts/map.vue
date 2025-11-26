<template>
  <v-app>
    <Header />
    <AppFilter />
    <SearchMap />
    <Switcher />
    <Zoom />
    <Timeline />
    <Legend />
    <SidebarMapOrganisation v-if="selectedItem && selectedItem.edate" />
    <SidebarMapCountry v-if="selectedItem && !selectedItem.edate" />
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
import SearchMap from '@/components/layout/SearchMap.vue'
import Switcher from '@/components/layout/Switcher.vue'
import Zoom from '@/components/layout/Zoom.vue'
import Timeline from '@/components/layout/Timeline.vue'
import Legend from '@/components/layout/Legend.vue'
import SidebarMapOrganisation from '@/components/layout/SidebarMapOrganisation'
import SidebarMapCountry from '@/components/layout/SidebarMapCountry.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'Map',
  components: {
    SidebarMapOrganisation,
    Header,
    AppFilter,
    SearchMap,
    Switcher,
    Zoom,
    Timeline,
    Legend,
    SidebarMapCountry,
    Footer
  },
  computed: {
    selectedItem: {
      get () {
        return this.$store.getters.selectedItemMapLast
      }
    }
  }
}
</script>
