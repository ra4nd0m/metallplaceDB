<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <v-row
            cols="12" sm="6" class="mb-10"
        >
          <v-col>
            <MaterialDropdown v-model="form.materialId"/>
            <PropertiesForm v-model="form.properties" :materialId="form.materialId"/>
            <v-date-picker v-model="form.dateAddValue" elevation="6" full-width="false" class="mb-10"></v-date-picker>
            <ButtonAddValue :data="form"></ButtonAddValue>
          </v-col>

          <v-col>
            <v-date-picker v-model="dateReport" elevation="6" full-width="false" class="mb-10"></v-date-picker>
            <v-btn
                elevation="6"
                small
                @click="this.getReportClick"
            >Сгенерировать отчет
            </v-btn>
          </v-col>
        </v-row>

        <v-text-field
            solo
            required
            v-model="formMaterial.newMaterialName"
            label="Материал, усл. поставки, страна"
        ></v-text-field>

        <v-text-field
            solo
            v-model="formMaterial.newMaterialSource"
            label="Источник"
        ></v-text-field>

        <v-text-field
            solo
            v-model="formMaterial.newMaterialUnit"
            label="Ед. измерения"
        ></v-text-field>
        <ButtonAddMaterial :data="formMaterial"></ButtonAddMaterial>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MaterialDropdown from "@/components/MaterialDropdown";
import PropertiesForm from "@/components/PropertiesForm";
import ButtonAddValue from "@/components/ButtonAddValue";
import {getReport} from "@/getReport";
import ButtonAddMaterial from "@/components/ButtonAddMaterial";

export default {
  name: "AddValue",
  components: {
    ButtonAddMaterial,
    MaterialDropdown,
    PropertiesForm,
    ButtonAddValue
  },
  data: () => ({
    form: {
      materialId: null,
      properties: [],
      dateAddValue: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    },
    dateReport: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    formMaterial: {
      newMaterialName: null,
      newMaterialSource: null,
      newMaterialUnit: null,
    }
  }),
  methods: {
    getReportClick() {
      getReport(this.dateReport)
    }
  }
}

</script>