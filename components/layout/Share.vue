<template>
  <div
    id="zoom"
    class="zoom"
    :class="{ active: active }"
  >
    <template v-if="active">
      <div class="zoom__el icon" @click="normalZoom">
        <normal-zoom />
      </div>
      <div class="zoom__el icon" @click="zoomOut">
        <minus />
      </div>
      <div class="zoom__el icon" @click="zoomIn">
        <plus />
      </div>
      <v-divider />
    </template>
    <div class="zoom__el noselect" @click="active = !active">
      {{ Math.round(scale * 100) }}%
    </div>
  </div>
</template>

<script>
import NormalZoom from '@/components/Icons/NormalZoom.vue'
import Minus from '@/components/Icons/Minus.vue'
import Plus from '@/components/Icons/Plus.vue'

export default {
  name: 'Zoom',
  components: {
    NormalZoom,
    Minus,
    Plus
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    scale: {
      get () {
        return this.$store.state.scale
      },
      set (val) {
        this.$store.commit('SET_SCALE', val)
      }
    }
  },
  methods: {
    normalZoom () {
      this.scale = 1
      this.$store.commit('SET_ZOOM', true)
    },
    zoomIn () {
      this.scale = Math.round((this.scale * 10) + 1) / 10
      if (this.scale > 4) {
        this.scale = 4
      }
      this.$store.commit('SET_ZOOM', true)
    },
    zoomOut () {
      this.scale = Math.round((this.scale * 10) - 1) / 10
      if (this.scale < 0.25) {
        this.scale = 0.25
      }
      this.$store.commit('SET_ZOOM', true)
    }
  }
}
</script>

<style lang="scss" scoped>
  .zoom{
    z-index: 10;
    position: absolute;
    left: 316px;
    bottom: 56px;
    width: 40px;
    height: 40px;
    box-shadow: 0 0 10px 0 rgba(192,192,192,0.5);
    border-radius: 4px;
    background-color: #FFFFFF;
    &.active{
      height: 160px;
    }
    &__el{
      text-align: center;
      width: 40px;
      height: 40px;
      color: #0E1436;
      padding: 11px 5px;
      letter-spacing: 0;
      line-height: 18px;
      font-size: 12px;
      cursor: pointer;
      font-family: 'MyriadProBold', sans-serif;
      &.icon{
        padding: 12px;
      }
    }
  }
</style>
