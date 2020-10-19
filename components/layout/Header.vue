<template>
  <v-app-bar
    id="header"
    class="header"
    color="#FFB71A"
    :height="$vuetify.breakpoint.smAndDown ? 104 : 72"
    app
    flat
    clipped-left
    clipped-right
  >
    <span class="header__title">Alternative Finance Ecosystem Atlas</span>
    <v-spacer />
    <div class="header__navigation hidden-sm-and-down">
      <nuxt-link :class="{'active': $route.path.includes('/visualisation')}" :to="localePath('/visualisation/graph')">
        Visualisation
      </nuxt-link>
      <nuxt-link :class="{'active': $route.path === '/methodology'}" :to="localePath('/methodology')">
        Methodology
      </nuxt-link>
      <nuxt-link :class="{'active': $route.path === '/contribute'}" :to="localePath('/contribute')">
        Contribute
      </nuxt-link>
      <nuxt-link :class="{'active': $route.path === '/contact'}" :to="localePath('/contact')">
        Contact
      </nuxt-link>
    </div>
    <v-spacer />
    <v-row align="center" justify="center" class="header__logo hidden-sm-and-down">
      <a href="https://www.jbs.cam.ac.uk/faculty-research/centres/alternative-finance/" target="_blank" class="mr-3">
        <img class="logo1" src="~static/logo.png">
      </a>
      <v-divider vertical />
      <img class="logo2 ml-3" src="~static/logo2.png">
    </v-row>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          text
          class="hidden-sm-and-down"
          v-on="on"
        >
          {{ $i18n.locale }}
          <ArrowRight class="ml-1" />
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="locale in availableLocales"
          :key="locale.code"
        >
          <v-list-item-title class="header__lang-switcher">
            <nuxt-link :to="switchLocalePath(locale.code)">
              {{ locale.name }}
            </nuxt-link>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog>
      <template v-slot:activator="{ on }">
        <v-app-bar-nav-icon class="hidden-md-and-up" v-on="on" />
      </template>
      <v-card>
        <v-list id="menu" class="menu pt-4 pa-1 ma-1" expand>
          <v-list-item>
            <nuxt-link :class="{'active': $route.path.match('/\(graph)/')}" :to="localePath('/visualisation/graph')">
              Visualisation
            </nuxt-link>
          </v-list-item>
          <v-list-item>
            <nuxt-link :class="{'active': $route.path === '/methodology'}" :to="localePath('/methodology')">
              Methodology
            </nuxt-link>
          </v-list-item>
          <v-list-item>
            <nuxt-link :class="{'active': $route.path === '/contribute'}" :to="localePath('/contribute')">
              Contribute
            </nuxt-link>
          </v-list-item>
          <v-list-item>
            <nuxt-link :class="{'active': $route.path === '/contact'}" :to="localePath('/contact')">
              Contact
            </nuxt-link>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import ArrowRight from '@/components/Icons/ArrowRight.vue'

export default {
  name: 'Header',
  components: {
    ArrowRight
  },
  data () {
    return {
      langs: ['En', 'Fr'],
      lang: 'En'
    }
  },
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .header{
    z-index: 10000;
    &__title{
      color:#000000;
      font-size: 18px;
      font-family: SabonBold, serif;
      line-height: 32px;
    }
    &__lang-switcher a{
      text-decoration-line: none !important;
      color: #000000 !important;
      font-size: 15px !important;
      letter-spacing: 0;
      line-height: 18px;
      text-transform: uppercase;
    }
    &__navigation a{
      text-decoration-line: none !important;
      color: #000000 !important;
      font-size: 15px !important;
      letter-spacing: 0;
      line-height: 18px;
      padding: 2px 8px 2px 16px;
      margin-left: 30px;
      border-left: 2px solid transparent;
      &.active{
        font-family: MyriadProSemiBold, sans-serif;
        font-weight: 600;
        border-left: 2px solid #000000;
      }
      &:hover{
        text-shadow: -.20px -.20px 0 black,
        .20px .20px black;
      }
    }
    &__logo {
      height: 50px;
      width: min-content;
      min-width: 258px;
      a{
        height: 43px;
        img.logo1{
          height: 43px;
        }
      }
      img.logo2{
        height: 50px;
      }
    }
  }
  @media screen and (min-width: 960px) and (max-width: 1250px) {
    .header{
      &__title{
        font-size: 14px;
      }
      &__navigation a{
        font-size: 12px !important;
        line-height: 18px;
        padding: 2px 2px 2px 6px;
        margin-left: 8px;
      }
    }
  }
</style>
