<template>
  <div
    id="sort"
    class="sort"
  >
    <div
      class="sort__activator"
      @click="active = !active"
    >
      <view-setup />
    </div>
    <template v-if="active">
      <div class="sort__options">
        <template v-for="(option, i) in options">
          <v-checkbox
            :key="i"
            v-model="option.value"
            :label="option.name"
            class="pa-0 ma-0"
          />
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import ViewSetup from '@/components/Icons/ViewSetup.vue'

export default {
  name: 'Sort',
  components: {
    ViewSetup
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    options: {
      get () {
        // return JSON.parse(JSON.stringify(this.$store.state.sortOptions))
        // return this.$store.state.sortOptions
        return [{ name: 'Market segments', value: true },
          { name: 'Incorporation year', value: false },
          { name: 'Entry year', value: true },
          { name: 'Type', value: false },
          { name: 'Op. HQ', value: true },
          { name: 'Inc. Country', value: true },
          { name: 'Total disclosed funding', value: false },
          { name: 'Number of employees', value: false },
          { name: 'Valuation', value: false },
          { name: 'Social', value: false },
          { name: 'Cessation date', value: false },
          { name: 'Cessation of op. reason', value: false }]
      },
      set (newVal) {
        this.$store.commit('SET_SORT_OPTIONS', newVal)
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .sort{
    z-index: 10;
    position: absolute;
    right: 192px;
    top: 88px;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 10px 0 rgba(192,192,192,0.5);
    border-radius: 4px;
    background-color: #FFFFFF;
    padding: 8px;
    &__activator{
      z-index: 11;
      cursor:pointer;
    }
    &__options{
      z-index: 15;
      position: relative;
      top: 13px;
      max-width: 208px;
      width: 208px;
      box-shadow: 0 0 10px 0 rgba(192,192,192,0.5);
      border-radius: 4px;
      background-color: #FFFFFF;
      padding: 20px;
    }
  }
</style>
