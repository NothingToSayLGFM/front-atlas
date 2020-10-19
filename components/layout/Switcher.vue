<template>
  <v-btn-toggle
    id="mode_switcher"
    v-model="mode_switcher"
    class="mode_switcher"
    borderless
    mandatory
  >
    <v-btn nuxt link :to="localePath('/visualisation/graph')">
      Graph
    </v-btn>
    <div class="mode_switcher__divider">
      <div class="mode_switcher__divider_ch" :class="{active: mode_switcher === 2}" />
    </div>
    <v-btn nuxt link :to="localePath('/visualisation/map')">
      Map
    </v-btn>
    <div class="mode_switcher__divider">
      <div class="mode_switcher__divider_ch" :class="{active: mode_switcher === 0}" />
    </div>
    <v-btn nuxt link :to="localePath('/visualisation/table')">
      Table
    </v-btn>
  </v-btn-toggle>
</template>

<script>

export default {
  name: 'Switcher',
  components: {
  },
  data () {
    return {
      mode_switcher: this.$route.path.includes('/visualisation/table') ? 2 : this.$route.path.includes('/visualisation/map') ? 1 : 0
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .mode_switcher{
    z-index: 10;
    position: absolute !important;
    right: 250px;
    top: 88px;
    width: 288px;
    height: 40px;
    box-shadow: 0 0 10px 0 rgba(192,192,192,0.5);
    a {
      background-color: #FFFFFF !important;
      width: 96px !important;
      height: 40px !important;
      text-transform: none !important;
      font-family: 'MyriadProSemiBold', sans-serif;
      &.v-btn--active {
        background-color: black !important;
        color: white !important;
      }
    }
    &__divider{
      height: 100%;
      width: 1px;
      min-width: 1px;
      &_ch{
        background-color: inherit;
        margin-top: 8px;
        height: 24px;
        &.active{
          background-color: #B2B7C6;
        }
      }
    }
  }

  @media screen and (max-width: 960px) {
    .mode_switcher{
      z-index: 10;
      position: absolute !important;
      left: 24px;
      margin: 0 auto !important;
      top: 184px;
      width: calc(100vw - 48px);
      a {
        width: calc((100vw - 48px)/3) !important;
      }
    }
  }
</style>
