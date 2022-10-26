<template>
  <v-btn
      elevation="6"
      small
      @click="add"
  >Добавить</v-btn>
</template>

<script>
import {addMaterial} from "@/addMaterial";

export default {
  name: "ButtonAddMaterial",
  props: {
    data: Object
  },
  methods: {
    add(){
      addMaterial(this.data.name, this.data.source, this.data.market, this.data.unit)
    }
  }
}
</script>

<style scoped>

</style>