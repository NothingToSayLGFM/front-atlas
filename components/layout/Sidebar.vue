<template>
  <div>
    <v-btn
      v-if="selectedItem"
      tile
      depressed
      color="white"
      retain-focus-on-click
      style=""
      :style="{right: drawer ? '292px' : '0'}"
      class="sidebar__collapse"
      @click="drawer=!drawer"
    >
      <v-icon>
        {{ !drawer ? 'mdi-menu-left' : 'mdi-menu-right' }}
      </v-icon>
    </v-btn>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndUp"
      id="sidebar"
      v-model="drawer"
      class="sidebar hidden-sm-and-down"
      width="292"
      app
      right
      clipped
      stateless
      hide-overlay
    >
      <v-container class="organisation-info">
        <v-row v-if="selectedItem">
          <v-col class="organisation-info__title" cols="12">
            {{ selectedItem.name }}
          </v-col>
          <v-col cols="12">
            <v-chip
              v-if="selectedItem.cdate && selectedItem.cdate < year"
              class="ma-2"
              color="error"
              outlined
              x-small
            >
              Not active
            </v-chip>
            <v-chip
              v-else
              class="ma-2"
              color="success"
              outlined
              x-small
            >
              Active
            </v-chip>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>

export default {
  name: 'Sidebar',
  components: {
  },
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    selectedItem () {
      return this.$store.getters.selectedItemLast
    },
    year () {
      return this.$store.state.filter_options.year
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  z-index: 30 !important;
  &__collapse{
    position: absolute;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: all;
    z-index: 30;
    background-color: white !important;
    top: 124px;
    width: 16px !important;
    min-width: 16px !important;
  }
  .organisation-info{
    &__title{
      color: #0E1436;
      font-family: 'MyriadProSemiBold', sans-serif;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 24px;
    }
  }
}
</style>
