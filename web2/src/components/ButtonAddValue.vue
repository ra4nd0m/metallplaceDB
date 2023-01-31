<template>
  <v-btn
      elevation="6"
      small
      @click="add"
  >Добавить запись</v-btn>
</template>

<script>
import {addValue} from "@/addValue";

export default {
  name: "ButtonAddValue",

  methods: {
    add(){
      this.data.properties.forEach(p => {
        if (p.input !== null || p.input !== ""|| p.input !== " "){
          addValue(this.data.materialId, p.text, p.input, this.data.dateAddValue)
        }
      })
    }
  },
  props: {
    data: Object
  },
}
</script>

<style scoped>

</style>