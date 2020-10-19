<template>
  <v-row align="center" justify="center">
    <svg id="svg-container" :width="width" :height="height" />
  </v-row>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Test',
  data () {
    return {
      width: 0,
      height: 0,
      selections: {},
      nodes: [],
      links: [],
      simulation: null,
      colorScheme: ['#E6BF73', '#E6A474', '#D46960', '#DF739D', '#A580DE', '#808DDE', '#497EB9', '#94C3E9', '#69B5AF', '#67B579']
    }
  },
  computed: {
  },
  watch: {
  },
  beforeMount () {
    this.width = d3.select('body').node().getBoundingClientRect().width - 308
    this.height = document.documentElement.clientHeight - 112
  },
  beforeDestroy () {
    this.scale = 1
  },
  mounted () {
    this.svg = d3.select(this.$el.querySelector('svg'))
    const a = { id: 'a' }
    const b = { id: 'b' }
    const c = { id: 'c' }
    this.nodes = [a, b, c]
    this.links = []

    this.simulation = d3.forceSimulation(this.nodes)
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('link', d3.forceLink(this.links).distance(200))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .alphaTarget(1)
      .on('tick', this.ticked)

    this.selections.g = this.svg.append('g').attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')')
    this.selections.link = this.selections.g.append('g').attr('stroke', '#000').attr('stroke-width', 1.5).selectAll('.link')
    this.selections.node = this.selections.g.append('g').selectAll('.node')
    this.restart()

    d3.timeout(() => {
      this.links.push({ source: a, target: b })
      this.links.push({ source: b, target: c })
      this.links.push({ source: c, target: a })
      this.restart()
    }, 1000)

    d3.interval(() => {
      this.nodes.pop()
      this.links.pop()
      this.links.pop()
      this.restart()
    }, 2000, d3.now())

    d3.interval(() => {
      this.nodes.push(c)
      this.links.push({ source: b, target: c })
      this.links.push({ source: c, target: a })
      this.restart()
    }, 2000, d3.now() + 1000)
  },
  methods: {
    restart () {
      // const t = d3.transition().duration(750)

      this.selections.node = this.selections.node
        .data(this.nodes, d => d.id)
        .join(
          enter => enter.append('circle')
            .attr('fill', d => this.colorScheme[d.index])
            .attr('r', 9),
          update => update,
          exit => exit.remove()
        )

      this.selections.link = this.selections.link
        .data(this.links, d => d.source.id + '-' + d.target.id)
        .join(
          enter => enter.append('line'),
          update => update,
          exit => exit.remove()
        )

      this.simulation.nodes(this.nodes)
      this.simulation.force('link').links(this.links)
      this.simulation.alpha(1).restart()
      // this.simulation.alpha(1).tick(2500)
    },
    ticked () {
      this.selections.node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      this.selections.link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
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
        this.data.nodes = [this.selectedItem, newSubsegment, newSegment, ...orgArr]
        this.data.links = links
      } else {
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
        this.data.nodes = JSON.parse(JSON.stringify([this.selectedItem, ...this.$_.uniqBy(newSegments, 'id'), ...this.$_.uniqBy(newSubsegments, 'id'), ...newCategories]))
        this.data.links = links
      }
      const nodeById = d3.map()
      this.data.nodes.forEach((node) => {
        nodeById.set(node.id, node)
      })
      this.data.links.forEach((link) => {
        link.source = nodeById.get(link.source)
        link.target = nodeById.get(link.target)
      })
    }
  }
}
</script>
