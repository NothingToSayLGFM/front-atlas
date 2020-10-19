<template>
  <div v-if="selectedItem">
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
        <v-row>
          <v-col class="organisation-info__title" cols="12">
            {{ selectedItem.name }}
          </v-col>
          <v-col cols="12">
            <v-chip
              class="ma-2"
              :color="selectedItem.op_status === 'active' ? 'success' : 'error'"
              outlined
              x-small
            >
              {{ selectedItem.op_status }}
            </v-chip>
          </v-col>
          <v-col cols="12">
            <div class="organisation-info__subtitle">
              Market segments
            </div>
            <div class="organisation-info__value">
              {{ selectedItem.segments.map(el => el.segment.name).join(', ') }}
            </div>
          </v-col>
          <v-col cols="12">
            <div class="organisation-info__subtitle">
              Launch year
            </div>
            <div class="organisation-info__value">
              {{ selectedItem.edate.substr(0, 4) }}
            </div>
          </v-col>
          <v-col cols="12">
            <a :href="`https://twitter.com/${selectedItem.twitter}`" target="_blank">
              <Twitter />
            </a>
          </v-col>
          <v-col cols="12">
            <div class="organisation-info__second-title">
              Website
            </div>
          </v-col>
          <v-col>
            <div class="organisation-info__value">
              <a :href="selectedItem.link" target="_blank">
                {{ selectedItem.link }}
              </a>
            </div>
          </v-col>
          <v-col cols="12">
            <div class="organisation-info__second-title">
              Details
            </div>
          </v-col>
          <v-col cols="12">
            <div class="organisation-info__subtitle">
              Ownership type
            </div>
            <div class="organisation-info__value">
              {{ selectedItem.ctype }}
            </div>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="organisation-info__subtitle">
                  Op. HQ
                </div>
                <div class="organisation-info__value">
                  {{ selectedItem.ophq.name }}
                </div>
              </v-col>
              <v-col cols="6">
                <div class="organisation-info__subtitle">
                  Inc Country
                </div>
                <div class="organisation-info__value">
                  {{ selectedItem.leghq.name }}
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <div class="organisation-info__subtitle">
                  Number of employees
                </div>
                <div class="organisation-info__value">
                  {{ selectedItem.fte || 'unidentified' }}
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <div class="organisation-info__subtitle">
              Services
            </div>
            <v-list class="pa-0 ma-0">
              <v-list-item v-for="(category, i) in selectedItem.segments" :key="i" class="pa-0 ma-0">
                <v-list-item-avatar>
                  <div class="oval" :style="{borderColor: getColor(category)}" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="organisation-info__value">
                    {{ selectedItem.categories[i].name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ category.segment.name }}, {{ category.subsegment.name }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Twitter from '@/components/Icons/Twitter.vue'

export default {
  name: 'SidebarOrganisation',
  components: {
    Twitter
  },
  data () {
    return {
      drawer: true,
      color: ['#E6BF73', '#E6A474', '#D46960', '#DF739D', '#A580DE', '#808DDE', '#497EB9', '#94C3E9', '#69B5AF', '#67B579']
    }
  },
  computed: {
    ...mapState({ taxonomy: 'taxonomy', year: state => state.filter_options.year }),
    selectedItem () {
      return this.$store.getters.selectedItemMapLast
    }
  },
  methods: {
    getColor (item) {
      const category = this.taxonomy.find(el => el.id === item.id)
      return this.color[category ? category.group : 0]
    }
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
      &__second-title{
        color: #0E1436;
        font-family: 'MyriadProSemiBold', sans-serif;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 24px;
      }
      &__subtitle{
        color: #0E1436;
        opacity: 0.26;
        font-family: 'MyriadPro', sans-serif;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 16px;
      }
      &__value{
        color: #0E1436;
        font-family: 'MyriadPro', sans-serif;
        font-size: 16px;
        letter-spacing: 0;
        line-height: 24px;
        a{
          color: #0E1436;
        }
      }
    }
  }
</style>
