<template>
  <div>
    <v-btn
      v-if="selectedItem"
      tile
      depressed
      color="white"
      retain-focus-on-click
      style
      :style="{right: drawer ? '292px' : '0'}"
      class="sidebar__collapse"
      @click="drawer=!drawer"
    >
      <v-icon>{{ !drawer ? 'mdi-menu-left' : 'mdi-menu-right' }}</v-icon>
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
      <v-container v-if="selectedItem" class="organisation-info">
        <v-row align="center" justify="center">
          <v-col class="organisation-info__title" cols="12">{{ selectedItem.name }}</v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div>Active org.</div>
                <v-row no-gutters align="center" justify="start">
                  <div class="oval org active mr-3" />
                  <div>{{ organisations.filter(el => el.op_status === 'active').length }}</div>
                </v-row>
              </v-col>
              <v-col cols="6">
                <div>Inactive org.</div>
                <v-row no-gutters align="center" justify="start">
                  <div class="oval org mr-3" />
                  <div>{{ organisations.filter(el => el.op_status === 'inactive').length }}</div>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-divider />
          <v-col cols="12" class="organisation-info__subtitle">
            <span>Organisations</span>
          </v-col>
          <v-col cols="12">
            <v-list>
              <v-list-item v-for="organisation in organisations" :key="organisation.id">
                <v-list-item-avatar>
                  <div
                    class="oval org mr-3"
                    :class="{active: organisation.op_status === 'active' }"
                  />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="header__lang-switcher">{{ organisation.name }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon>
                    <v-icon
                      color="grey lighten-1"
                      @click="selectedItem = organisation"
                    >mdi-chevron-right</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'SidebarMapCountry',
  components: {},
  data () {
    return {
      drawer: false,
      isLoading: false,
      organisations: []
    }
  },
  computed: {
    selectedItem: {
      get () {
        return this.$store.getters.selectedItemMapLast
      },
      set (newVal) {
        this.$store.dispatch('updateSelectedItemMap', newVal)
      }
    },
    year () {
      return this.$store.state.filter_options.year
    }
  },
  watch: {
    selectedItem (newVal) {
      if (newVal) {
        this.getData()
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData: _.debounce(function () {
      if (this.selectedItem) {
        if (this.isLoading) {
          return
        }
        this.isLoading = true

       this.$api.countries
       .searchMapCountry(this.selectedItem.id)
          .then((res) => {
            this.organisations = res.data.data.organisations
          })
          .catch((err) => {
            alert(err)
          })
          .finally(() => {
            this.isLoading = false
            this.drawer = true
          })
      } else {
        this.drawer = false
      }
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  z-index: 30 !important;
  &__collapse {
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
  .organisation-info {
    &__title {
      color: #0e1436;
      font-family: "MyriadProSemiBold", sans-serif;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 24px;
    }
    &__subtitle {
      color: #0e1436;
      font-family: "MyriadProSemiBold", sans-serif;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0;
      line-height: 24px;
    }
  }
}
</style>
