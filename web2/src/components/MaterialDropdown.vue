<template>
  <v-container fluid>
    <v-row>
        <v-autocomplete
            item-text="text"
            item-value="value"
            :items="items"
            label="Материал"
            v-model="selected"
            @change="onChange"
            @click="onClick"
        ></v-autocomplete>
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
    },
    onClick() {
      this.getOptions()
      this.selected = this.value
    }
  }
}


</script>

<style >

</style>