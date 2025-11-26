<template>
  <v-autocomplete
    id="search"
    v-model="selectedItem"
    class="search"
    item-text="name"
    item-value="id"
    return-object
    append-icon=""
    label="Enter keyword … "
    menu-props="auto"
    :items="items"
    :search-input.sync="search"
    :loading="isLoading"
    :hide-no-data="!search"
    solo
    flat
    hide-selected
    no-filter
  >
    <template v-slot:prepend>
      <v-icon v-if="!selectedItem">
        mdi-magnify
      </v-icon>
      <v-icon v-else @click="selectedItem = null">
        mdi-chevron-left
      </v-icon>
    </template>
    <template v-if="selectedItem" v-slot:append>
      <v-icon class="mr-2">
        mdi-radiobox-marked
      </v-icon>
      <v-divider vertical />
      <v-icon class="ml-2" @click="clearSelectedItem">
        mdi-close
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-content>
          <div class="search__no-data">
            Sorry, we could not find any results matching "{{ search }}". Please try another search or
            <nuxt-link to="/contribute">
              Contribute
            </nuxt-link> information to the database.
          </div>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-if="(meta.categories.total > 3 || meta.organisations.total > 3) && searchLimit" v-slot:append-item>
      <v-divider />
      <v-list-item @click="searchLimit=false">
        <v-list-item-content>
          <v-list-item-title>
            <span class="search__more-results">
              View all results for "{{ search }}"
            </span>
          </v-list-item-title>
          <v-list-item-subtitle>
            <span>
              {{ meta.organisations.total }} Organizations found. {{ meta.categories.total }} Categories found.
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:item="data">
      <!-- Divider and Header-->
      <template v-if="typeof data.item !== 'object'" class="header">
        <v-list-item-content v-text="data.item" />
      </template>
      <!-- Normal item -->
      <template v-else>
        <v-list-item-avatar>
          <div v-if="!data.item.edate" class="oval" :style="{borderColor: getColor(data.item)}" />
          <template v-else>
            <div v-if="data.item.cdate && data.item.cdate.substr(0, 4) < new Date().getFullYear()" class="oval org" />
            <div v-else class="oval org active" />
          </template>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-html="data.item.highlight && data.item.highlight.name ? data.item.highlight.name : data.item.name" />
          <v-list-item-subtitle v-if="!data.item.edate">
            {{ data.item.segment }}, {{ data.item.subsegment }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-else>
            {{ data.item.categories.map(el => el.name).join(', ') }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'GlobalSearch',
  components: {
  },
  data () {
    return {
      search: '',
      isLoading: false,
      searchLimit: true,
      categories: [],
      organisations: [],
      meta: {
        organisations: {},
        categories: {}
      },
      color: ['#E6BF73', '#E6A474', '#D46960', '#DF739D', '#A580DE', '#808DDE', '#497EB9', '#94C3E9', '#69B5AF', '#67B579']
    }
  },
  computed: {
    ...mapState({ taxonomy: 'taxonomy', year: state => state.filter_options.year }),
    selectedItem: {
      get () {
        return this.$store.getters.selectedItemLast
      },
      set (newVal) {
        this.$store.dispatch('updateSelectedItem', newVal)
      }
    },
    items () {
      if (this.organisations.length === 0 && this.categories.length === 0 && this.$store.state.selectedItem.length === 0) {
        return []
      }
      return [
        { header: 'Categories' },
        ...this.categories,
        ...this.$store.state.selectedItem.filter(el => el.class === 'category'),
        { divider: true },
        { header: 'Organisations' },
        ...this.organisations,
        ...this.$store.state.selectedItem.filter(el => el.edate)
      ]
    }
  },
  watch: {
    searchLimit (val) {
      if (!val) {
        this.getData()
      }
    },
    search (val) {
      this.searchLimit = true
      this.getData()
    }
  },
  methods: {
    clearSelectedItem () {
      this.$store.dispatch('clearSelectedItem')
    },
    getColor (item) {
      const category = this.taxonomy.find(el => el.id === item.id)
      return this.color[category ? category.group : 0]
    },
    getData: _.debounce(function () {
      if (this.isLoading) { return }
      if (this.search && this.search.length >= 3) {
        this.isLoading = true
        const obj = {
          q: this.search,
          pagination: {
            from: 0,
            size: this.searchLimit ? 3 : 10000
          },
          sections: ['organisations', 'categories']
        }
        this.$api.graphs.searchGraphOrganisation(obj)
        .then((res) => {
          this.organisations = res.data.data.organisations
          this.categories = res.data.data.categories
          this.meta = res.data.meta
        })
          .catch((err) => {
            alert(err)
          })
          .finally(() => (this.isLoading = false))
      }
    }, 500),
    clearData () {
      if (!this.selectedItem) {
        this.organisations = []
        this.categories = []
        this.meta = {
          organisations: {},
          categories: {}
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .search{
    z-index: 10;
    position: absolute !important;
    left: 316px;
    top: 88px;
    width: 392px;
    height: 40px !important;
    border-radius: 4px !important;
    background-color: #FFFFFF !important;
    box-shadow: 0 0 10px 0 rgba(192,192,192,0.5) !important;
    .v-input__control {
      min-height: 40px !important;
      max-height: 40px !important;
    }
    .v-select__slot{
      input{
        color: #0E1436;
        font-family: 'MyriadProSemiBold', sans-serif;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 19px;
      }
    }
    .v-input__slot{
      margin: 0 !important;
    }
    .v-input__prepend-outer {
      margin: 8px 7px 8px 7px !important;
    }
    &__more-results{
      font-family: 'MyriadProBold', sans-serif;
    }
    &__no-data{
      width: 354px;
      color: rgba(14,20,54,0.33);
      font-size: 14px;
      letter-spacing: 0;
      line-height: 20px;
    }
  }

  @media screen and (max-width: 960px) {
    .search {
      z-index: 10;
      position: absolute !important;
      left: 24px;
      margin: 0 auto !important;
      top: 128px;
      width: calc(100vw - 48px);
    }
  }
</style>
