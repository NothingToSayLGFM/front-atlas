<template>
  <v-row align="center" justify="center">
    <svg id="svg-container" :width="width" :height="height" />
    <div style="display: none">
      {{ createGraph }}
      {{ updateGraph }}
    </div>
  </v-row>
</template>

<script>
import * as d3 from 'd3'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'EcosystemAtlasMod',
  data () {
    return {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      selections: {},
      data: [],
      simulation: null,
      zoom: null,
      colorScheme: ['#E6BF73', '#E6A474', '#D46960', '#DF739D', '#A580DE', '#808DDE', '#497EB9', '#94C3E9', '#69B5AF', '#67B579']
    }
  },
  computed: {
    ...mapState({
      taxonomy: 'taxonomy',
      categories: 'categories',
      zoomButton: 'zoom',
      updateGraph: state => state.updateGraph,
      createGraph: state => state.createGraph,
      year: state => state.filter_options.year
    }),
    ...mapGetters({ organisations: 'getOrganisations' }),
    selectedItem: {
      get () { return this.$store.getters.selectedItemLast },
      set (val) { this.$store.dispatch('updateSelectedItem', val) }
    },
    scale: {
      get () { return this.$store.state.scale.graph },
      set (val) { this.$store.commit('SET_GRAPH_SCALE', val) }
    }
  },
  watch: {
    updateGraph () {
      this.rebuild()
    },
    createGraph () {
      this.build()
    },
    taxonomy (val) {
    },
    zoomButton (val) {
      if (val) {
        this.selections.g.attr('transform', 'translate(' + this.x + ',' + this.y + ') scale(' + this.scale + ')')
        this.$store.commit('SET_ZOOM', false)
      }
    }
  },
  beforeMount () {
    this.width = d3.select('body').node().getBoundingClientRect().width - 308
    this.height = document.documentElement.clientHeight - 112
    this.x = this.width / 2
    this.y = this.height / 2
  },
  beforeDestroy () {
    this.scale = 1
  },
  async mounted () {
    const self = this
    await this.createData()
    this.selections.svg = d3.select(this.$el.querySelector('svg'))
    const svg = this.selections.svg
    this.zoom = d3.zoom()
      .scaleExtent([1 / 4, 4])
      .on('zoom', this.zoomed)
    svg.call(this.zoom)
    this.simulation = d3.forceSimulation(this.data.nodes)
      // .force('charge', d3.forceManyBody().strength(-600))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('link', d3.forceLink(this.data.links).id(d => d.id).distance((d) => {
        if (d.type === 'to segment') {
          return 100
        }
        if (d.type === 'to category') {
          return 70
        }
        if (d.type === 'to organisation') {
          return 70
        } else {
          return 80
        }
      }))
      .force('x', d3.forceX().strength(0.25))
      .force('y', d3.forceY().strength(0.25))
      .on('tick', self.ticked)

    this.selections.g = svg.append('g').attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ') scale(1)')
    this.selections.link = this.selections.g.append('g').attr('stroke', '#000').attr('stroke-width', 1.5).selectAll('.link')
    this.selections.node = this.selections.g.append('g').selectAll('.node')
    this.selections.text = this.selections.g.append('g').selectAll('text')
    this.restart()
  },
  methods: {
    async build () {
      await this.createData()
      await this.restart()
    },
    async rebuild () {
      await this.updateData()
      await this.restart()
    },
    nodeClick (d) {
      this.$store.dispatch('updateSelectedItem', d)
    },
    zoomed () {
      if (d3.event.sourceEvent.type === 'mousemove') {
        d3.event.transform.k = this.scale
      } else {
        this.scale = d3.event.transform.k
      }
      this.x = d3.event.transform.x
      this.y = d3.event.transform.y
      this.selections.g.attr('transform', d3.event.transform)
      const graphBox = this.selections.g.node().getBBox()
      const margin = 0
      const worldTopLeft = [graphBox.x - margin, graphBox.y - margin]
      const worldBottomRight = [
        graphBox.x + graphBox.width + margin,
        graphBox.y + graphBox.height + margin
      ]
      this.zoom.translateExtent([worldTopLeft, worldBottomRight])
    },
    dragstarted (d) {
      if (!d3.event.active) { this.simulation.alphaTarget(0.2).restart() }
      d.fx = d.x
      d.fy = d.y
    },
    dragged (d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    },
    dragended (d) {
      if (!d3.event.active) { this.simulation.alphaTarget(0) }
      d.fx = null
      d.fy = null
    },
    restart () {
      const t = d3.transition().ease(d3.easeCubic).duration(500)

      this.selections.text = this.selections.text
        .data(this.data.nodes, d => d.id)
        .join(
          enter => enter.append('foreignObject')
            .attr('width', 120)
            .attr('height', d => d.class === 'segment' ? 120 : 120)
            .attr('class', d => d.class + ' noselect')
            .style('font', "14px 'Helvetica Neue'")
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .html((d) => {
              if (!d.count) { return `<div class="graph-box"><p class="label">${d.name}</p></div>` }
              const segmentData = `<div class="count-box" ><div class="oval org active"></div><div class="count active">${d.count.active}</div><div class="oval org"></div><div class="count">${d.count.inactive}</div></div>`
              return `<div class="graph-box"><p class="label-${d.class}">${d.name}</p>${d.class === 'segment' ? segmentData : ''}</div>`
            })
            .call(enter => enter.transition(t)
              .style('opacity', 1)),
          update => update.attr('fill', d => d.edate ? d.cdate && (d.cdate.substr(0, 4) < this.year) ? 'white' : '#0E1337' : 'white')
            .html((d) => {
              if (!d.count) { return `<div class="graph-box"><p class="label">${d.name}</p></div>` }
              const segmentData = `<div class="count-box" ><div class="oval org active"></div><div class="count active">${d.count.active}</div><div class="oval org"></div><div class="count">${d.count.inactive}</div></div>`
              return `<div class="graph-box"><p class="label-${d.class}">${d.name}</p>${d.class === 'segment' ? segmentData : ''}</div>`
            })
            .call(update => update.transition(t)
              .style('opacity', d => d.size === 0 ? 0 : 1)),
          exit => exit.remove()
        )

      this.selections.node = this.selections.node
        .data(this.data.nodes, d => d.id)
        .join(
          enter => enter.append('circle')
            .attr('stroke', d => d.edate ? 'black' : this.colorScheme[d.group])
            .attr('stroke-dasharray', d => d.edate ? d.cdate && (d.cdate.substr(0, 4) < this.year) ? '3, 3' : '' : '')
            .attr('class', d => d.class)
            .on('click', d => (d.class === 'category' || d.edate) ? this.nodeClick(d) : undefined)
            .call(d3.drag()
              .on('start', this.dragstarted)
              .on('drag', this.dragged)
              .on('end', this.dragended))
            .call(enter => enter.transition(t)
              .attr('fill', d => d.edate ? d.cdate && (d.cdate.substr(0, 4) < this.year) ? 'white' : '#0E1337' : 'white')
              .attr('stroke-width', d => d.count ? Math.exp(2.5 + 0.005 * (d.count.active + d.count.inactive)) / 6 : 1)
              .attr('r', (d) => {
                if (d.edate) {
                  return d.size === 0 ? 0 : 10
                } else if (d.class === 'segment') {
                  return d.size === 0 ? 0 : d.count ? Math.exp(2.5 + 0.005 * (d.count.active + d.count.inactive)) : 10
                } else {
                  return d.size === 0 ? 0 : d.count.active + d.count.inactive ? Math.exp(2.5 + 0.005 * (d.count.active + d.count.inactive)) : 5
                }
              })),
          update => update.attr('fill', d => d.edate ? d.cdate && (d.cdate.substr(0, 4) < this.year) ? 'white' : '#0E1337' : 'white')
            .attr('stroke', d => d.edate ? 'black' : this.colorScheme[d.group])
            .attr('stroke-dasharray', d => d.edate ? d.cdate && (d.cdate.substr(0, 4) < this.year) ? '3, 3' : '' : '')
            .call(update => update.transition(t)
              .attr('fill', d => d.edate ? d.cdate && (d.cdate.substr(0, 4) < this.year) ? 'white' : '#0E1337' : 'white')
              .attr('stroke-width', d => d.count ? Math.exp(2.5 + 0.005 * (d.count.active + d.count.inactive)) / 6 : 1)
              .attr('r', (d) => {
                if (d.edate) {
                  return d.size === 0 ? 0 : 10
                } else if (d.class === 'segment') {
                  return d.size === 0 ? 0 : d.count ? Math.exp(2.5 + 0.005 * (d.count.active + d.count.inactive)) : 10
                } else {
                  return d.size === 0 ? 0 : d.count.active + d.count.inactive ? Math.exp(2.5 + 0.005 * (d.count.active + d.count.inactive)) : 5
                }
              })),
          exit => exit.remove()
        )
      this.selections.link = this.selections.link
        .data(this.data.links, d => d.source.id + '-' + d.target.id)
        .join(
          enter => enter.append('line')
            .call(enter => enter.transition(t)
              .style('opacity', d => d.target.size === 0 || d.source.size === 0 ? 0 : 1)),
          update => update
            .call(update => update.transition(t)
              .style('opacity', d => d.target.size === 0 || d.source.size === 0 ? 0 : 1)),
          exit => exit.remove()
        )

      this.simulation.nodes(this.data.nodes)
      this.simulation.force('link').links(this.data.links)
      this.simulation.alpha(1).restart()
    },
    ticked () {
      this.selections.node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      this.selections.text
        .attr('x', d => d.x - 60)
        .attr('y', d => d.y - 60)

      this.selections.link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
    },
    updateData () {
      if (!this.selectedItem) {
        this.data.nodes.forEach((el) => {
          const newData = this.taxonomy.find(cat => cat.id === el.id)
          el.count = newData.count
        })
      } else if (this.selectedItem.class === 'category') {
        const newCategory = this.selectedItem
        const newSubsegment = this.taxonomy.find(el => el.id === newCategory.parent)
        const newSegment = this.taxonomy.find(el => el.id === newSubsegment.parent)
        const orgArr = this.$store.state.organisations
        const newNodes = [newCategory, newSubsegment, newSegment, ...orgArr]
        this.data.nodes.forEach((el) => {
          const newData = newNodes.find(node => node.id === el.id)
          if (newData) {
            if (newData.class) {
              el.count = newData.count
            } else {
              el.edate = newData.edate
              el.cdate = newData.cdate
              el.name = newData.name
              el.categories = newData.categories
              el.size = newData.edate.substr(0, 4) > this.year ? 0 : 10
            }
          } else {
            el.size = 0
          }
        })
        const difference = this.$_.differenceBy(newNodes, this.data.nodes, 'id')
        this.data.nodes = [...this.data.nodes, ...difference]
        const links = []
        difference.forEach((el) => {
          links.push({
            target: el.id,
            source: this.selectedItem.id,
            type: 'to organisation'
          })
        })
        this.data.links = [...this.data.links, ...links]
      } else {
        const newOrg = this.$store.state.organisations.find(el => el.id === this.selectedItem.id)
        const organisationCategories = newOrg.categories
        const newCategories = this.$_.compact(organisationCategories.map(cat => this.taxonomy.find(el => cat.id === el.id)))
        const newSubsegments = newCategories.map(cat => this.taxonomy.find(el => cat.parent === el.id))
        const newSegments = newSubsegments.map(cat => this.taxonomy.find(el => cat.parent === el.id))
        const newNodes = [newOrg, ...this.$_.uniqBy(newSegments, 'id'), ...this.$_.uniqBy(newSubsegments, 'id'), ...newCategories]
        this.data.nodes.forEach((el) => {
          const newData = newNodes.find(node => node.id === el.id)
          if (newData) {
            if (newData.class) {
              el.count = newData.count
              el.size = 1
            } else {
              el.edate = newData.edate
              el.cdate = newData.cdate
              el.name = newData.name
              el.categories = newData.categories
              el.size = newData.edate.substr(0, 4) > this.year ? 0 : 10
            }
          } else {
            el.size = 0
          }
        })
      }
    },
    createData () {
      if (!this.selectedItem) {
        const categories = []
        const links = []
        this.taxonomy.forEach((el) => {
          if (Object.prototype.hasOwnProperty.call(el, 'parent')) {
            links.push({
              target: el.id,
              source: el.parent,
              type: Object.prototype.hasOwnProperty.call(el, 'children') ? 'to segment' : 'to category'
            })
          }
          const copy = Object.assign({}, el)
          categories.push(copy)
        })
        this.data.nodes = categories
        this.data.links = links
      } else if (this.selectedItem.class === 'category') {
        const newCategory = this.selectedItem
        const newSubsegment = this.taxonomy.find(el => el.id === newCategory.parent)
        const newSegment = this.taxonomy.find(el => el.id === newSubsegment.parent)
        const orgArr = this.$store.state.organisations
        const links = [
          {
            target: newSubsegment.id,
            source: newSegment.id,
            type: 'to segment'
          },
          {
            target: this.selectedItem.id,
            source: newSubsegment.id,
            type: 'to category'
          }
        ]
        orgArr.forEach((el) => {
          links.push({
            target: el.id,
            source: this.selectedItem.id,
            type: 'to organisation'
          })
        })
        this.data.nodes = JSON.parse(JSON.stringify([newSegment, newSubsegment, this.selectedItem, ...orgArr]))
        this.data.links = links
      } else {
        const newOrg = this.$store.state.organisations.find(el => el.id === this.selectedItem.id)
        const organisationCategories = this.selectedItem.categories
        const newCategories = this.$_.compact(organisationCategories.map(cat => this.taxonomy.find(el => cat.id === el.id)))
        const newSubsegments = newCategories.map(cat => this.taxonomy.find(el => cat.parent === el.id))
        const newSegments = newSubsegments.map(cat => this.taxonomy.find(el => cat.parent === el.id))
        const links = []
        newCategories.forEach((el, i) => {
          links.push({
            target: this.selectedItem.id,
            source: el.id,
            type: 'to organisation'
          })
          links.push({
            target: el.id,
            source: newSubsegments[i].id,
            type: 'to category'
          })
          links.push({
            target: newSubsegments[i].id,
            source: newSegments[i].id,
            type: 'to segment'
          })
        })
        this.data.nodes = JSON.parse(JSON.stringify([newOrg || this.selectedItem, ...this.$_.uniqBy(newSegments, 'id'), ...this.$_.uniqBy(newSubsegments, 'id'), ...newCategories]))
        this.data.links = links
      }
      // const nodeById = d3.map()
      // this.data.nodes.forEach((node) => {
      //   nodeById.set(node.id, node)
      // })
      // this.data.links.forEach((link) => {
      //   link.source = nodeById.get(link.source)
      //   link.target = nodeById.get(link.target)
      // })
    }
  }
}
</script>
