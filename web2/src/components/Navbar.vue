<template>
    <v-toolbar app>
      <v-toolbar-items class="d-flex align-center">
        <v-btn flat to="/" class="px-2" >
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <v-btn flat to="/shortReport" class="px-2" v-tooltip:left="{ html: 'Short Report' }">
          <v-icon>mdi-file-document</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
</template>

<script>
export default {
  name: "Navbar"
}
</script>

<style scoped>

</style>