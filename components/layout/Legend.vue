<template>
  <div
    id="legend"
    class="legend"
    :class="{ active: active }"
  >
    <template v-if="active">
      <div class="legend__title">
        Legend
      </div>
      <div style="display: flex">
        <div class="segment" />
        <span class="text">
          Market segment
        </span>
      </div>
      <div style="display: flex">
        <div class="organisation" />
        <span class="text">
          Active organisation
        </span>
      </div>
      <div style="display: flex">
        <div class="organisation inactive" />
        <span class="text">
          Inactive organisation
        </span>
      </div>
    </template>
    <div
      class="legend__el icon"
      :class="{active: active}"
      @click="active = !active"
    >
      <legend-icon />
    </div>
  </div>
</template>

<script>
import LegendIcon from '@/components/Icons/Legend.vue'

export default {
  name: 'Legend',
  components: {
    LegendIcon
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .legend{
    z-index: 10;
    position: absolute;
    right: 108px;
    bottom: 56px;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 10px 0 rgba(192,192,192,0.5);
    border-radius: 4px;
    background-color: #FFFFFF;
    &__tooltip{
      display: block;
      z-index: 10;
      position: absolute;
      right: 108px;
      bottom: 100px;
    }
    .segment {
      box-sizing: border-box;
      height: 30px;
      width: 30px;
      border: 5px solid #E28865;
      border-radius: 50%;
      margin: 0 10px 0 16px;
    }
    .organisation {
      height: 12px;
      width: 12px;
      background-color: #0E1337;
      border-radius: 50%;
      margin: 9px 10px 9px 25px;
      &.inactive{
        border: 1px dashed #000000;
        background-color: transparent;
      }
    }
    .text{
      color: #0E1436;
      font-size: 12px;
      letter-spacing: 0;
      line-height: 30px;
    }
    &__title{
      color: #0E1436;
      text-transform: uppercase;
      font-family: 'MyriadProBoldCond', sans-serif !important;
      font-size: 18px;
      letter-spacing: 0;
      line-height: 23px;
      margin: 25px 0 24px 16px;
    }
    &.active{
      height: 192px;
      width: 184px;
    }
    &__el{
      width: 40px;
      height: 40px;
      color: #0E1436;
      padding: 11px 5px;
      letter-spacing: 0;
      line-height: 18px;
      font-size: 12px;
      cursor: pointer;
      &.active{
        position: relative;
        right: -142px;
        bottom: 11px;
        transform: rotate(180deg);
      }
      &.icon{
        padding: 12px;
      }
    }
  }
</style>
