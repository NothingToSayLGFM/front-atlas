<template>
  <v-row>
    <v-col>
      Index
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Index',
  created () {
    this.$router.push(this.localePath('/visualisation/graph'))
  }
}
</script>
