<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <MaterialDropdown v-model="materialId"/>
        <PropertiesForm v-model="properties" :materialId="materialId"/>
        <v-date-picker v-model="dateAddValue"></v-date-picker>
        <ButtonAddValue :materialId="materialId" :date="dateAddValue" :properties="properties"></ButtonAddValue>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MaterialDropdown from "@/components/MaterialDropdown";
import PropertiesForm from "@/components/PropertiesForm";
import ButtonAddValue from "@/components/ButtonAddValue";


export default {
  name: "AddValue",
  components: {
    MaterialDropdown,
    PropertiesForm,
    ButtonAddValue
  },
  data: () => ({
    materialId: null,
    DateAddValue: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
  })
}
</script>