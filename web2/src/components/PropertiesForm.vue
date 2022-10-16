<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
            cols="12"
            md="4"
            v-for="(property, id) in properties"
            :key="property.value"
        >
          <v-text-field
              v-bind:placeholder=property.text
              outlined
              required
          ></v-text-field>
        </v-col>
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
    materialId: Number
  },
  methods: {
    getOptions(materialId) {
        getPropertiesList(materialId).then(resp =>{
          this.properties  = resp
        })
    },
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
  },
}
</script>

<style scoped>

</style>