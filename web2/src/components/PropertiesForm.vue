<template>
  <v-form>
    <v-container>
      <v-row v-for="property in properties"
      :key="property.value">

          <v-text-field
              :placeholder="property.text"
              solo
              required
              v-model="property.input"
              @change="onChange"
          ></v-text-field>

      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import {getPropertiesList} from "@/getProperties";

export default {
  name: "PropertiesForm",
  data: () => ({
    properties: [],
  }),
  props: {
    materialId: Number,
    value: Array
  },
  methods: {
    getOptions(materialId) {
        getPropertiesList(materialId).then(resp =>{
          this.properties  = resp
        })
    },
    onChange(){
      this.$emit('input', this.properties)
    }
  },
  watch: {
    materialId: function (){
      this.getOptions(this.materialId)
    }
  },
  mounted() {
    if(this.materialId) {
      this.getOptions(this.materialId)
    }
    this.properties = this.value
  },
}
</script>

<style scoped>

</style>