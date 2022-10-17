<template>
  <v-container fluid>
    <v-row align="center">
      <v-col
          class="d-flex"
          cols="12"
          sm="6"
      >
        <v-autocomplete
            item-text="text"
            item-value="value"
            :items="items"
            label="Материал"
            solo
            v-model="selected"
            @change="onChange"
        ></v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {getMaterialList} from "@/getMaterials";

export default {
  name: "materialDropdown",
  data: () => ({
    items: [],
    selected: Number
  }),
  props: {
    value: Number
  },
  mounted() {
    this.getOptions()
    this.selected = this.value
  },
  methods: {
    getOptions() {
      getMaterialList().then(resp =>{
        this.items = resp
      })
    },
    onChange(selectedId){
      this.$emit('input', parseInt(selectedId));
    }
  }
}


</script>

<style scoped>


</style>