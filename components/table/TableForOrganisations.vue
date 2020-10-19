<template>
  <v-row align="center" justify="center">
    <v-col cols="12">
      <v-data-table
        id="table"
        class="table"
        :headers="headers"
        :items="organisations"
        :options.sync="options"
        :server-items-length="totalOrganisations"
        :item-class="row_classes"
        multi-sort
        :footer-props="{
          'disable-items-per-page' : true,
          'items-per-page-text': '',
          'items-per-page-options': [],
          prevIcon: 'mdi-chevron-left',
          nextIcon: 'mdi-chevron-right'
        }"
      >
        <template v-slot:header.op_status>
          <span class="organisation header" />
        </template>
        <template v-slot:header.action>
          <v-icon>
            mdi-download
          </v-icon>
        </template>
        <template v-slot:item.op_status="{ item }">
          <div class="organisation" :class="{inactive: (!item.cdate || item.cdate === 'None')}" />
        </template>
        <template v-slot:item.name="{ item }">
          {{ item.name }}
        </template>
        <template v-slot:item.categories="{ item }">
          {{ item.categories[0] ? item.categories[0].name : null }}
          <template v-if="item.categories.length > 1">
            <span class="table__more-results" @mouseover="showAllCategories(item, $event)" @mouseleave="dialog = false">
              + {{ item.categories.length - 1 }} more
            </span>
          </template>
        </template>
        <template v-slot:item.leghq="{ item }">
          {{ item.leghq ? item.leghq.name : null }}
        </template>
        <template v-slot:item.ophq="{ item }">
          {{ item.ophq ? item.ophq.name : null }}
        </template>
      </v-data-table>
    </v-col>
    <div v-show="dialog" ref="box" class="table__box">
      {{ boxContent }}
    </div>
  </v-row>
</template>

<script>
export default {
  name: 'TableForOrganisations',
  components: {
  },
  data () {
    return {
      dialog: false,
      loading: false,
      boxContent: '',
      organisations: [],
      totalOrganisations: 0,
      options: {
        itemsPerPage: 13
      }
    }
  },
  computed: {
    sortOptions () {
      return this.$store.state.sortOptions
    },
    headers () {
      return [
        { text: '', value: 'op_status', class: 'table__status' },
        { text: 'Name', value: 'name' },
        { text: 'Categories', value: 'categories' },
        ...(this.sortOptions.find(el => el.name === 'Entry year').value ? [{ text: 'Entry year', value: 'edate' }] : []),
        ...(this.sortOptions.find(el => el.name === 'Inc. Country').value ? [{ text: 'Inc. Country', value: 'incdate' }] : []),
        ...(this.sortOptions.find(el => el.name === 'Op. HQ').value ? [{ text: 'Op. HQ', value: 'ophq' }] : []),
        { text: '', value: 'action', width: '20', sortable: false }
        // { name: 'Market segments', value: true },
        // { name: 'Incorporation year', value: false },
        // { name: 'Entry year', value: true },
        // { name: 'Type', value: false },
        // { name: 'Op. HQ', value: true },
        // { name: 'Inc. Country', value: true },
        // { name: 'Total disclosed funding', value: false },
        // { name: 'Number of employees', value: false },
        // { name: 'Valuation', value: false },
        // { name: 'Social', value: false },
        // { name: 'Cessation date', value: false },
        // { name: 'Cessation of op. reason', value: false }
      ]
    }
  },
  watch: {
    options: {
      async handler () {
        this.organisations = await this.getDataFromApi()
      },
      deep: true
    }
  },
  async mounted () {
    this.organisations = await this.getDataFromApi()
  },
  methods: {
    async getDataFromApi () {
      this.loading = true
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      const sorts = {}
      if (sortBy.length > 0) {
        sortBy.forEach((el, i) => {
          sorts[el] = sortDesc[i] ? 'desc' : 'asc'
        })
      }
      const obj = {
        q: '',
        pagination: {
          from: (page - 1) * itemsPerPage,
          size: itemsPerPage
        },
        filters: this.filters,
        sorts
      }
      const data = await this.$api.organisations.getOrganisations(obj)

      this.totalOrganisations = data.data.meta.total
      return data.data.data
    },
    row_classes (item) {
      return 'aaa'
    },
    showAllCategories (item, e) {
      this.dialog = true
      this.boxContent = item.categories.map(el => el.name).slice(1).join(', ')
      this.$refs.box.style.top = e.pageY - 100 + 'px'
      this.$refs.box.style.left = e.pageX - 340 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
  .table {
    margin: 84px 108px 84px 24px;
    &__box{
      max-width: 200px;
      margin: 50px auto;
      padding: 20px;
      background-color: #FFFFFF;
      box-shadow: 0 0 10px 0 rgba(192,192,192,0.7);
      border-radius: 4px;
      position: absolute;
      color: #0E1436;
      font-size: 16px;
      letter-spacing: 0.32px;
      line-height: 19px;
      &:before {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        bottom: 100%;
        left: 1.5em;
        border: .75rem solid transparent;
        border-top: none;
        // aaa
        border-bottom-color: #fff;
        filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, .1));
      }
    }
    &__more-results{
      cursor: pointer;
      color: #0E1436;
      font-family: 'MyriadProSemiBold', sans-serif;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.28px;
      line-height: 18px;
    }
    .organisation {
      height: 12px;
      width: 12px;
      background-color: #0E1337;
      border-radius: 50%;
      &.header{
        margin: 0;
        display: inline-flex;
      }
      &.inactive{
        border: 1px dashed #000000;
        background-color: transparent;
      }
    }
  }
</style>
