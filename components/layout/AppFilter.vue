<template>
  <div>
    <v-btn
      tile
      depressed
      color="white"
      retain-focus-on-click
      style=""
      :style="{left: drawer ? '292px' : '0'}"
      class="filter__collapse"
      @click="drawer=!drawer"
    >
      <v-icon>
        {{ !drawer ? 'mdi-menu-right' : 'mdi-menu-left' }}
      </v-icon>
    </v-btn>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndUp"
      id="filter"
      v-model="drawer"
      class="filter hidden-sm-and-down"
      width="292"
      app
      clipped
      stateless
      hide-overlay
    >
      <v-expansion-panels
        :value="panel"
        flat
        accordion
        multiple
      >
        <v-expansion-panel readonly>
          <v-expansion-panel-header @click="panel = $_.isEmpty(panel) ? [0, 1, 2, 3, 4, 5, 6] : []">
            <span class="filter__title">Variables</span>
            <template v-slot:actions>
              <span class="filter__default">
                {{ filters.total }}
              </span>
              <v-icon color="#B2B7C6" @click.stop="reset('all')">
                mdi-close
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-divider />
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span class="filter__subtitle">Focus</span>
            <template v-slot:actions>
              <v-icon color="#B2B7C6">
                mdi-chevron-down
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <template v-for="option in filters.focus">
              <v-row :key="option.id" class="pl-2">
                <v-checkbox
                  v-model="focus"
                  color="black"
                  :label="option.name"
                  class="ma-0 pa-0"
                  :value="option.id"
                  hide-details
                />
                <span class="filter__quantity">({{ option.org_count }})</span>
              </v-row>
            </template>
          </v-expansion-panel-content>
          <v-divider />
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span class="filter__subtitle">Operating status</span>
            <template v-slot:actions>
              <v-icon color="#B2B7C6">
                mdi-chevron-down
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <template v-for="option in filters.op_status">
              <v-row :key="option.id" class="pl-2">
                <v-checkbox
                  v-model="op_status"
                  color="black"
                  :label="option.name"
                  class="ma-0 pa-0"
                  :value="option.id"
                  hide-details
                />
                <span class="filter__quantity">({{ option.org_count }})</span>
              </v-row>
            </template>
          </v-expansion-panel-content>
          <v-divider />
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span class="filter__subtitle">Market segment</span>
            <template v-slot:actions>
              <span class="filter__select pr-2" @click.stop="reset('segment')">
                {{ $_.isEmpty(segment) ? 'select all' : 'clear' }}
              </span>
              <v-icon color="#B2B7C6">
                mdi-chevron-down
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <template v-for="option in segmentsLimit">
              <v-row :key="option.id" class="pl-2">
                <v-checkbox v-model="segment" color="black" hide-details :label="option.name" :value="option.id" class="ma-0 pa-0" />
                <span class="filter__quantity">({{ option.org_count }})</span>
              </v-row>
            </template>
            <v-row v-if="restOfSegments" class="filter__more-results noselect pointer pl-2 mt-4" @click="segmentLimitActivator = !segmentLimitActivator">
              <template v-if="segmentLimitActivator">
                <span>
                  Show {{ restOfSegments }} more
                </span>
                <v-icon>
                  mdi-menu-down
                </v-icon>
              </template>
              <template v-else>
                <span>
                  Show less
                </span>
                <v-icon>
                  mdi-menu-up
                </v-icon>
              </template>
            </v-row>
          </v-expansion-panel-content>
          <v-divider />
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span class="filter__subtitle">Country</span>
            <template v-slot:actions>
              <span class="filter__select pr-2" @click.stop="reset('country')">
                {{ $_.isEmpty(country) ? 'select all' : 'clear' }}
              </span>
              <v-icon color="#B2B7C6">
                mdi-chevron-down
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row class="pl-2">
              <v-radio-group v-model="country_field" row>
                <v-radio color="black" label="Inc. Country" value="inc_country" />
                <v-radio color="black" label="Op. HQ" value="op_country" />
              </v-radio-group>
            </v-row>
            <v-row class="pl-2 mb-4">
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
                class="py-0 my-0"
                @click:clear="search = ''"
              />
            </v-row>
            <template v-for="option in countiesLimit">
              <v-row :key="option.id" class="pl-2">
                <v-checkbox v-model="country" color="black" hide-details :label="option.name" :value="option.id" class="ma-0 pa-0" />
                <span class="filter__quantity">({{ option.org_count }})</span>
              </v-row>
            </template>
            <v-row v-if="restOfCountries" class="filter__more-results noselect pointer pl-2 mt-4" @click="countryLimitActivator = !countryLimitActivator">
              <template v-if="countryLimitActivator">
                <span>
                  Show {{ restOfCountries }} more
                </span>
                <v-icon>
                  mdi-menu-down
                </v-icon>
              </template>
              <template v-else>
                <span>
                  Show less
                </span>
                <v-icon>
                  mdi-menu-up
                </v-icon>
              </template>
            </v-row>
          </v-expansion-panel-content>
          <v-divider />
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span class="filter__subtitle">Organisation type</span>
            <template v-slot:actions>
              <v-icon color="#B2B7C6">
                mdi-chevron-down
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <template v-for="option in filters.org_type">
              <v-row :key="option.id" class="pl-2">
                <v-checkbox v-model="org_type" color="black" hide-details :label="option.name" :value="option.id" class="ma-0 pa-0" />
                <span class="filter__quantity">({{ option.org_count }})</span>
              </v-row>
            </template>
          </v-expansion-panel-content>
          <v-divider />
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span class="filter__subtitle">Ownership type</span>
            <template v-slot:actions>
              <v-icon color="#B2B7C6">
                mdi-chevron-down
              </v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <template v-for="option in filters.own_type">
              <v-row :key="option.id" class="pl-2">
                <v-checkbox v-model="own_type" color="black" hide-details :label="option.name" :value="option.id" class="ma-0 pa-0" />
                <span class="filter__quantity">({{ option.org_count }})</span>
              </v-row>
            </template>
          </v-expansion-panel-content>
          <v-divider />
        </v-expansion-panel>
      </v-expansion-panels>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppFilter',
  components: {
  },
  data () {
    return {
      drawer: true,
      panel: [0, 1, 2, 3, 4],
      segmentLimit: 5,
      segmentLimitActivator: true,
      countryLimit: 3,
      countryLimitActivator: true,
      search: ''
    }
  },
  computed: {
    ...mapState(['filter_options', 'filters']),
    focus: {
      get () { return this.$store.state.filter_options.focus },
      set (newVal) { this.$store.dispatch('updateFilters', ['SET_FILTERS_FOCUS', newVal]) }
    },
    op_status: {
      get () { return this.$store.state.filter_options.op_status },
      set (newVal) { this.$store.dispatch('updateFilters', ['SET_FILTERS_STATUS', newVal]) }
    },
    segment: {
      get () { return this.$store.state.filter_options.segment },
      set (newVal) { this.$store.dispatch('updateFilters', ['SET_FILTERS_SEGMENT', newVal]) }
    },
    country_field: {
      get () { return this.$store.state.filter_options.country_field },
      set (newVal) { this.$store.dispatch('updateFilters', ['SET_FILTERS_COUNTRY_FIELD', newVal]) }
    },
    country: {
      get () { return this.$store.state.filter_options.country },
      set (newVal) { this.$store.dispatch('updateFilters', ['SET_FILTERS_COUNTRY', newVal]) }
    },
    org_type: {
      get () { return this.$store.state.filter_options.org_type },
      set (newVal) { this.$store.dispatch('updateFilters', ['SET_FILTERS_ORG_TYPE', newVal]) }
    },
    own_type: {
      get () { return this.$store.state.filter_options.own_type },
      set (newVal) { this.$store.dispatch('updateFilters', ['SET_FILTERS_OWN_TYPE', newVal]) }
    },
    segmentsLimit () {
      return this.filters.segment ? this.filters.segment.slice(0, this.segmentLimitActivator ? this.segmentLimit : undefined) : []
    },
    restOfSegments () {
      return this.filters.segment ? this.filters.segment.length - this.segmentLimit > 0 ? this.filters.segment.length - this.segmentLimit : 0 : []
    },
    countriesSearch () {
      const search = this.search || ''
      return this.filters.country ? this.filters.country.filter(el => el.name.toLowerCase().includes(search.toLowerCase())) : []
    },
    countiesLimit () {
      return this.countriesSearch.slice(0, this.countryLimitActivator ? this.countryLimit : undefined)
    },
    restOfCountries () {
      return this.countriesSearch.length - this.countryLimit > 0 ? this.countriesSearch.length - this.countryLimit : 0
    }
  },
  methods: {
    reset (option) {
      if (option === 'all') {
        this.$store.commit('SET_DEFAULT_FILTERS')
      } else {
        this[option] = this.$_.isEmpty(this[option]) ? this.filters[option].map(el => el.id) : []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  &__collapse{
    position: absolute;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-property: all;
    z-index: 20;
    background-color: white !important;
    top: 124px;
    width: 16px !important;
    min-width: 16px !important;
  }
  &__title{
    color: #0E1436;
    font-size: 24px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 29px;
    text-transform: uppercase;
    font-family: MyriadProSemiBold, sans-serif;
   }
  &__subtitle{
    color: #0E1436;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 24px;
    font-family: MyriadProSemiBold, sans-serif;
  }
  &__quantity {
    margin-left: 8px;
    opacity: 0.26;
    color: #0E1436;
    font-size: 16px;
    letter-spacing: 0;
    line-height: 24px;
  }
  &__default{
    opacity: 0.26;
    font-size: 14px;
    color: #0E1436;
    line-height: 24px;
    font-family: MyriadProSemiBold, sans-serif;
  }
  &__select{
    opacity: 0.26;
    font-size: 14px;
    color: #0E1436;
    line-height: 24px;
    font-family: MyriadProSemiBold, sans-serif;
    &:hover{
      opacity: 1;
      font-weight: bold !important;
      text-decoration: underline;
    }
  }
  &__more-results{
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    transition-property: transform, visibility, width;
  }
  label{
    color: #0E1436 !important;
    font-size: 16px !important;
    letter-spacing: 0 !important;
  }
  .v-expansion-panel-header:focus::before {
    opacity: 0;
  }
}
</style>
