<template>
  <v-btn
      elevation="6"
      small
      @click="add"
  >Добавить свойство</v-btn>
</template>

<script>
import {addProperty} from "@/addProperty";

export default {
  name: "ButtonAddProperty",
  methods: {
    async add(){
      alert(this.data)
      await addProperty(this.data.materialId, this.data.propertyName)
    },
  },
  props: {
    data: Object
  },
}
</script>

<style scoped>

</style>