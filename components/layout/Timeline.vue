<template>
  <div
    id="timeline"
    class="timeline"
  >
    <div class="timeline__play" />
    <template v-for="(year, i) in years">
      <button :key="i" :class="{active: activeYear === year}" :disabled="selectedItem && selectedItem.edate ? year < selectedItem.edate.substr(0, 4) : false" @click="activeYear = year">
        {{ year }}
      </button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  data () {
    return {
      years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
    }
  },
  computed: {
    activeYear: {
      get () { return parseInt(this.$store.state.filter_options.year) },
      set (newVal) { this.$store.dispatch('updateFilters', ['SET_FILTERS_YEAR', newVal]) }
    },
    selectedItem () {
      return this.$store.getters.selectedItemLast
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .timeline{
    z-index: 10;
    position: absolute;
    left: 396px;
    bottom: 56px;
    display: flex;
    padding: 8px 16px;
    box-shadow: 0 0 10px 0 rgba(192,192,192,0.5);
    border-radius: 4px;
    background-color: #FFFFFF;
    button{
      margin-right: calc((100vw - 108px - 396px - 100px) / 11 / 3) !important;;
      height: 24px;
      width: calc((100vw - 108px - 396px - 100px) / 11 * 2 / 3) !important;
      color: #0E1436;
      font-size: 14px;
      letter-spacing: 0;
      line-height: 18px;
      text-align: center;
      font-family: 'MyriadProBoldCond', sans-serif;
      font-stretch: condensed;
      &:disabled{
        color: lightgray;
      }
      &:focus{
        outline: none;
      }
      &.active{
        color: white;
        border-radius: 6px;
        background-color: #0E1436;
      }
    }
  }
</style>
