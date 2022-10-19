<template>
  <v-btn
      elevation="6"
      small
      v-on:click="add"
  >Добавить запись</v-btn>
</template>

<script>
import {addValue} from "@/addValue";

export default {
  name: "ButtonAddValue",
  methods: {
    add(){
      this.properties.forEach(property => {
        addValue(this.materialId, property.value, property.text.toString(), this.date)
      })
    }
  },
  props: {
    materialId: Number,
    properties: [] = [],
    date: String
  },
}
</script>

<style scoped>

</style>