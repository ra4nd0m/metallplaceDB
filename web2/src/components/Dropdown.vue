<template>
  <v-container fluid>
    <v-row align="center">
      <v-col
          class="d-flex"
          cols="12"
          sm="6"
      >
        <v-select
            item-text="text"
            item-value="value"
            :items="items"
            label="Материал"
            solo
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {getMaterialList} from "@/getMaterials";

export default {
  name: "dropdown",
  data: () => ({
    items: [],
  }),
  mounted() {
    this.getOptions()
  },
  methods: {
    getOptions() {
      getMaterialList().then(resp =>{
        this.items = resp
      })
    }
  }
}


</script>

<style scoped>


</style>