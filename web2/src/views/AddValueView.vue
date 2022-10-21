<template>
  <v-app id="inspire">
    <v-main>
      <v-container >
        <v-col cols="12"
         sm="6">
          <MaterialDropdown v-model="form.materialId"/>
          <PropertiesForm v-model="form.properties" :materialId="form.materialId"/>
          <v-date-picker v-model="form.dateAddValue" elevation="6" full-width="false" class="mb-10" ></v-date-picker>
          <ButtonAddValue :data="form"></ButtonAddValue>
        </v-col>
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
    form: {
      materialId: null,
      properties: [],
      dateAddValue: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)

    }
  }),

}

</script>