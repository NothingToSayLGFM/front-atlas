<template>
  <v-row class="map" align="center" justify="center" no-gutters>
    <svg id="svg-container" :width="width" :height="height" />
    <div style="display: none">
      {{ createMap }}
      {{ updateMap }}
    </div>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import * as d3 from 'd3'
import countries from '@/assets/js/countries.js'

export default {
  name: 'EcosystemAtlasMap',
  data () {
    return {
      selections: {},
      projection: null,
      path: null,
      data: null,
      regions: [],
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      zoom: null,
      color: ['#E6BF73', '#E6A474', '#D46960', '#DF739D', '#A580DE', '#808DDE', '#497EB9', '#94C3E9', '#69B5AF', '#67B579'],
      centered: undefined
    }
  },
  computed: {
    ...mapState({
      taxonomy: 'taxonomy',
      categories: 'categories',
      zoomButton: 'zoom',
      map: 'map',
      updateMap: 'updateMap',
      createMap: 'createMap',
      year: state => state.filter_options.year
    }),
    ...mapGetters({ organisations: 'getOrganisations' }),
    selectedItem: {
      get () {
        return this.$store.getters.selectedItemMapLast
      },
      set (newVal) {
        this.$store.dispatch('updateSelectedItemMap', newVal)
      }
    },
    scale: {
      get () {
        return this.$store.state.scale.map
      },
      set (val) {
        this.$store.commit('SET_MAP_SCALE', val)
      }
    }
  },
  watch: {
    updateMap () {
      this.createData()
    },
    createMap () {
      this.createData()
    },
    selectedCompany (newVal) {
      if (newVal && Object.entries(newVal).length !== 0) {
        this.selelectNodeByID(newVal)
      } else {
        this.unselectAll()
      }
    },
    zoomButton (newVal) {
      if (newVal) {
        this.selections.svg.transition().duration(750).call(
          this.zoom.transform,
          d3.zoomIdentity
            .scale(this.scale)
        )
        // this.selections.g.attr('transform', 'translate(' + this.x + ',' + this.y + ') scale(' + this.scale + ')')
        // this.zoom.scaleBy(this.selections.svg.transition().duration(750), this.scale)
        this.$store.commit('SET_ZOOM', false)
      }
    },
    scale (newVal, oldVal) {
      if (oldVal < 3 && newVal >= 3) {
        this.createData('countries')
      }
      if (oldVal >= 3 && newVal < 3) {
        this.createData('continent')
      }
    }
  },
  beforeMount () {
    this.width = d3.select('body').node().getBoundingClientRect().width - (this.$vuetify.breakpoint.smAndDown ? 0 : 308)
    this.height = document.documentElement.clientHeight - 112
    this.x = this.width / 2
    this.y = this.height / 2
  },
  beforeDestroy () {
    this.scale = 1
  },
  mounted () {
    this.projection = d3.geoMercator()
      .center([0, 70])
      .scale(150)
      .rotate([0, 0])

    this.selections.svg = d3.select(this.$el.querySelector('svg'))
    const svg = this.selections.svg

    this.path = d3.geoPath()
      .projection(this.projection)

    this.selections.g = svg.append('g')
      .attr('class', 'boundary')
      .attr('stroke-width', '0.25px')
      .attr('transform', 'translate(0, 0) scale(1)')

    this.selections.g
      .selectAll('boundary')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'countries')
      .attr('name', d => d.properties.name)
      .attr('id', d => d.properties.code)
      .attr('d', this.path)
      .on('click', this.countryClick)
      .on('mouseover', this.countryHover)
      .on('mouseout', this.countryUnhover)
    this.selections.node = this.selections.g.append('g').selectAll('circle')
    this.selections.text = this.selections.g.append('g').selectAll('.text')
    this.selections.count = this.selections.g.append('g').selectAll('.count')
    this.zoom = d3.zoom()
      .scaleExtent([0.5, 6])
      .on('zoom', this.zoomed)
    svg.call(this.zoom)
    this.createData()
  },
  methods: {
    createData (a) {
      if (!this.selectedItem) {
        let countriesWithData = []
        this.map.forEach((el) => {
          countriesWithData = [...countriesWithData, ...el.countries]
        })
        switch (a) {
          case 'continent': this.data = this.map
            this.restart()
            break
          case 'countries': this.data = countriesWithData
            this.restart()
            break
          default: this.data = this.map
            this.restart()
            this.selections.svg.transition().duration(750).call(
              this.zoom.transform,
              d3.zoomIdentity
            )
        }
      } else if (!a) {
        if (this.selectedItem.edate) {
          const x = this.$store.state.filter_options.country_field === 'inc_country' ? this.selectedItem.leghq.region.x : this.selectedItem.ophq.region.x
          const y = this.$store.state.filter_options.country_field === 'inc_country' ? this.selectedItem.leghq.region.y : this.selectedItem.ophq.region.y
          this.data = [{
            ...this.selectedItem,
            region: {
              x,
              y
            }
          }]
          this.selections.svg.transition().duration(750).call(
            this.zoom.transform,
            d3.zoomIdentity
              .translate(this.width / 2, this.height / 2)
              .scale(3)
              .translate(-x, -y)
          )
        } else {
          const continent = this.map.find(el => el.name === this.selectedItem.region_wb) // todo
          const country = continent.countries.find(el => el.name === this.selectedItem.name)
          this.data = [country]
          this.selections.svg.transition().duration(750).call(
            this.zoom.transform,
            d3.zoomIdentity
              .translate(this.width / 2, this.height / 2)
              .scale(3)
              .translate(-country.region.x, -country.region.y)
          )
        }
        this.restart()
      }
    },
    restart () {
      const t = d3.transition().ease(d3.easeCubic).duration(500)

      this.selections.count = this.selections.count
        .data(this.data, d => d.id)
        .join(
          enter => enter.append('text')
            .attr('class', d => d.edate ? 'hidden' : d.code ? 'count country' : 'count continent')
            .attr('x', 0)
            .attr('y', d => d.edate ? 0 : d.code ? 0 : '6px')
            .attr('transform', d => 'translate(' + d.region.x + ',' + d.region.y + ')')
            .attr('text-anchor', 'middle')
            .style('font-size', 12 / this.scale + 'px')
            .on('click', this.nodeClick)
            .on('mouseover', this.continentHover)
            .on('mouseout', this.continentUnhover)
            .text(d => d.count.active + d.count.inactive)
            .call(enter => enter.transition(t)
            ),
          update => update
            .text(d => d.count.active + d.count.inactive)
            .call(update => update.transition(t)
            ),
          exit => exit.remove()
        )
      this.selections.text = this.selections.text
        .data(this.data, d => d.id)
        .join(
          enter => enter.append('text')
            .attr('class', d => d.code ? 'country' : 'continent')
            .attr('x', 0)
            .attr('y', (d) => {
              if (d.edate) {
                return 25
              } else {
                return d.code ? 7 : d.count ? Math.exp(3 + 0.005 * (d.count.active + d.count.inactive)) + 15 : 7
              }
            })
            .attr('transform', d => 'translate(' + d.region.x + ',' + d.region.y + ')')
            .attr('text-anchor', 'middle')
            .style('font-size', 12 / this.scale + 'px')
            .on('click', this.nodeClick)
            .on('mouseover', this.continentHover)
            .on('mouseout', this.continentUnhover)
            .text(d => d.name)
            .call(enter => enter.transition(t)
            ),
          update => update
            .call(update => update.transition(t)
          ),
          exit => exit.remove()
        )

      this.selections.node = this.selections.node
        .data(this.data, d => d.id)
        .join(
          enter => enter.append('circle')
            .attr('class', d => d.code ? 'country' : 'continent')
            .attr('cx', d => d.region.x)
            .attr('cy', d => d.region.y)
            .attr('r', 0)
            .attr('stroke', 'white')
            .attr('stroke-width', 0)
            .on('click', this.nodeClick)
            .on('mouseover', this.continentHover)
            .on('mouseout', this.continentUnhover)
            .call(enter => enter.transition(t)
              .attr('r', (d) => {
                if (d.edate) {
                  return 10
                } else {
                  return d.code ? 5 : d.count ? Math.exp(3 + 0.005 * (d.count.active + d.count.inactive)) : 10
                }
              })
              .attr('stroke-width', d => d.edate ? 0 : d.code ? 0 : 8)
            ),
          update => update
            .call(update => update.transition(t)
              .attr('r', (d) => {
                if (d.edate) {
                  return 10
                } else {
                  return d.code ? 5 : d.count ? Math.exp(3 + 0.005 * (d.count.active + d.count.inactive)) : 10
                }
              })
              .attr('stroke-width', d => d.edate ? 0 : d.code ? 0 : 8)
            ),
          exit => exit.remove()
        )
    },
    zoomed () {
      const { transform } = d3.event
      this.selections.g.attr('transform', transform)
      this.selections.g.attr('stroke-width', `${0.25 / transform.k}px`)
      this.selections.text.style('font-size', 12 / transform.k)
      this.selections.count.style('font-size', 12 / transform.k)
      if (this.scale !== d3.event.transform.k) { this.scale = d3.event.transform.k }
    },
    countryClick (d) {
      if (this.scale < 3) {
        this.selections.text.select((el) => {
          if (el.name === d.properties.region_wb) {
            this.selections.svg.transition().duration(750).call(
              this.zoom.transform,
              d3.zoomIdentity
                .translate(this.width / 2, this.height / 2)
                .scale(3)
                .translate(-el.region.x, -el.region.y)
            )
          }
        })
      } else {
      }
      this.countryUnhover(d)
    },
    nodeClick (d) {
      if (!this.selectedItem) {
        if (this.scale < 3) {
          this.selections.text.select((el) => {
            if (el.name === d.name) {
              this.selections.svg.transition().duration(750).call(
                this.zoom.transform,
                d3.zoomIdentity
                  .translate(this.width / 2, this.height / 2)
                  .scale(3)
                  .translate(-el.region.x, -el.region.y)
              )
            }
          })
        } else {
          const continent = this.map.find(el => el.name === d.region_wb)
          this.selectedItem = continent.countries.find(el => el.name === d.name)
        }
      } else {
      }
      this.continentUnhover(d)
    },
    continentHover (d) {
      if (this.scale < 3) {
        const countries = this.selections.g.selectAll('path')
        const continentCountries = countries.filter(td => td.properties.region_wb === d.name)
        continentCountries.classed('onContinent', true)
        const texts = this.selections.g.selectAll('text')
        const text = texts.filter(td => td.name === d.name)
        text.classed('onContinent', true)
      } else {
        const countries = this.selections.g.selectAll('path')
        const continentCountries = countries.filter(td => td.properties.name === d.name)
        continentCountries.classed('onContinent', true)
        const texts = this.selections.g.selectAll('text')
        const text = texts.filter(td => td.name === d.name)
        text.classed('onContinent', true)
      }
    },
    continentUnhover (d) {
      const countries = this.selections.g.selectAll('path')
      const continentCountries = countries.filter(td => td.properties.region_wb === d.name)
      continentCountries.classed('onContinent', false)
      const texts = this.selections.g.selectAll('text')
      const text = texts.filter(td => td.name === d.name)
      text.classed('onContinent', false)
    },
    countryHover (d) {
      if (this.scale < 3) {
        const countries = this.selections.g.selectAll('path')
        const continentCountries = countries.filter(td => td.properties.region_wb === d.properties.region_wb)
        continentCountries.classed('onContinent', true)
        const texts = this.selections.g.selectAll('text')
        const text = texts.filter(td => td.name === d.properties.region_wb)
        text.classed('onContinent', true)
      } else {
        const countries = this.selections.g.selectAll('path')
        const country = countries.filter(td => td.properties.name === d.properties.name)
        country.classed('onContinent', true)
        const texts = this.selections.g.selectAll('text')
        const text = texts.filter(td => td.name === d.properties.name)
        text.classed('onContinent', true)
      }
    },
    countryUnhover (d) {
      const countries = this.selections.g.selectAll('path')
      const continentCountries = countries.filter(td => td.properties.region_wb === d.properties.region_wb)
      continentCountries.classed('onContinent', false)
      if (this.scale < 3) {
        const texts = this.selections.g.selectAll('text')
        const text = texts.filter(td => td.name === d.properties.region_wb)
        text.classed('onContinent', false)
      } else {
        const texts = this.selections.g.selectAll('text')
        const text = texts.filter(td => td.name === d.properties.name)
        text.classed('onContinent', false)
      }
    },
    unselectAll () {
      const country = this.selections.g.selectAll('path')
      country.classed('selected', false)
    },
    selelectNodeByID (item) {
      const key = this.headquarter ? item.ophq : item.leghq
      const countryName = this.geoData.find(el => el.id === key)

      const country = this.selections.g.selectAll('path')
      country.classed('selected', false)
      const selected = country.filter(td => td.properties.name === countryName.name)
      selected.classed('selected', true)
      const d = selected.data()[0]
      let x = 0
      let y = 0
      if (!d || this.centered === d) {
        this.centered = null
      } else {
        const centroid = this.path.centroid(d)
        x = this.width / 2 - centroid[0]
        y = this.height / 2 - centroid[1]
        this.centered = d
      }
      this.selections.g.transition()
        .duration(750)
        .attr('transform', 'translate(' + x + ',' + y + ')')
    }
  }
}
</script>

<style lang="scss">
.map{
  path {
    fill: #9da0ab;
    stroke: grey;
    &.onContinent {
      fill: #151c3c !important;
    }
  }
  text {
    -moz-user-select: -moz-none;
    -o-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    font-weight: bold;
    font-size: 12px;
    &.count{
      fill: white;
    }
    &.country{
    }
    &.onContinent {
      fill: white !important;
      mix-blend-mode: difference;
      filter: invert(1) grayscale(1) contrast(9)
    }
  }
  circle {
    fill: #0E1436;
    &.country{
    }
  }
}
</style>
