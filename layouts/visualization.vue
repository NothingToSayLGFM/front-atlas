<template>
  <v-app>
    <Header />
    <AppFilter />
    <Search />
    <Switcher />
    <Sort />
    <Zoom />
    <Timeline />
    <Legend />
    <Sidebar />
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
import Search from '@/components/layout/SearchGraph.vue'
import Switcher from '@/components/layout/Switcher.vue'
import Sort from '@/components/layout/Sort.vue'
import Zoom from '@/components/layout/Zoom.vue'
import Timeline from '@/components/layout/Timeline.vue'
import Legend from '@/components/layout/Legend.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'Visualisation',
  components: {
    Header,
    AppFilter,
    Search,
    Switcher,
    Sort,
    Zoom,
    Timeline,
    Legend,
    Sidebar,
    Footer
  }
}
</script>
