<template>
  <v-btn
      elevation="6"
      small
  >Добавить запись</v-btn>
</template>

<script>
import {addValue} from "@/addValue";

export default {
  name: "ButtonAddValue",
  methods: {
    add(){
      addValue(this.materialId, this.propertyId, this.value, this.date)
    }
  },
  props: {
    materialId: Number,
    propertyId: Number,
    value: Number,
    date: String
  },
}
</script>

<style scoped>

</style>