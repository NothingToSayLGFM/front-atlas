<template>
  <v-footer
    app
    color="#E3E3E3"
    height="40"
    class="footer"
  >
    <v-container class="py-0 my-0">
      <span style="color:#828597; font-size: 12px; line-height: 20px;">Cambridge Centre for Alternative Finance © {{ new Date().getFullYear() }}</span>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style lang="scss" scoped>
.footer {
  z-index: 10000;
}
</style>
