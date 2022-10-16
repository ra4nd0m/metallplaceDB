<template>
  <v-app id="inspire">
    <v-main>
     <v-container>
       <MaterialDropdown v-model="materialId"/>
       <PropertiesForm :materialId = "materialId"/>
     </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MaterialDropdown from "@/components/MaterialDropdown";
import PropertiesForm from "@/components/PropertiesForm";
export default {
  name: "AddValue",
  components: {
    MaterialDropdown,
    PropertiesForm,
  },
  data: () => ({
    materialId: null,
  })
}
</script>