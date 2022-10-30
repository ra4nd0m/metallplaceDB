<template>
  <v-btn
      elevation="6"
      small
      @click="add"
  >Добавить</v-btn>
</template>

<script>
import {addMaterialWithProperties} from "@/addMaterialWithProperties";

export default {
  name: "ButtonAddMaterial",
  props: {
    data: Object
  },
  methods: {
    add(){
      addMaterialWithProperties(this.data.name, this.data.source, this.data.market, this.data.unit, this.data.properties)
      this.$emit("clear")
    }
  }
}
</script>

<style scoped>

</style>