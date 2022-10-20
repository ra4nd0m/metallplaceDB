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
      console.log(this.data)
      // this.properties.forEach(property => {
      //   addValue(this.form.materialId, property.value, property.text.toString(), this.date)
      // })
    }
  },
  props: {
    data: Object
  },
}
</script>

<style scoped>

</style>