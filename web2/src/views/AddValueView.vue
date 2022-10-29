<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <v-form>
          <v-row
              cols="12" sm="6"
          >
            <v-col>
              <h1>Добавить запись</h1>
              <MaterialDropdown v-model="form.materialId"/>
              <PropertiesForm v-model="form.properties" :materialId="form.materialId"/>
              <v-date-picker v-model="form.dateAddValue" elevation="6" full-width="false" class="mb-10"></v-date-picker>
              <ButtonAddValue :data="form"></ButtonAddValue>
            </v-col>
            <v-col>

              <v-form>
                <h1>Добавить материал</h1>
                <v-text-field
                    required
                    v-model="formMaterial.name"
                    label="Материал, усл. поставки, страна"
                ></v-text-field>

                <v-text-field
                    v-model="formMaterial.source"
                    label="Источник"
                ></v-text-field>

                <v-text-field
                    v-model="formMaterial.market"
                    label="Рынок (страна)"
                ></v-text-field>

                <v-text-field
                    v-model="formMaterial.unit"
                    label="Ед. измерения"
                ></v-text-field>

                <form
                    ref="form"
                >
                  <h3>Свойства</h3>
                  <v-btn
                      elevation="6"
                      small
                      @click="addProperty"
                      class="mb-6 mr-3"
                  >+
                  </v-btn>
                  <v-btn
                      elevation="6"
                      small
                      color="error"
                      @click="deleteProperty"
                      class="mb-6"
                  >-
                  </v-btn>
                  <div class="form-row" v-for="(property, index) in formMaterial.properties" :key="index">
                    <v-text-field
                        v-model="property.name"
                        :name="`formMaterial.properties[${index}][name]`"
                        label="Название"
                    ></v-text-field>
                  </div>


                </form>

                <ButtonAddMaterial :data="formMaterial"></ButtonAddMaterial>
              </v-form>
            </v-col>
          </v-row>
        </v-form>

        <form>
          <h1 class="mb-6">Генерация отчета</h1>
          <v-btn
              elevation="6"
              small
              @click="this.getReportClick"
              class="mb-6"
          >Сгенерировать
          </v-btn>
        </form>
        <v-date-picker v-model="dateReport" elevation="6" full-width="false" class="mb-10"></v-date-picker>

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
      name: null,
      source: null,
      market: null,
      unit: null,
      properties: [{name: ""}]
    }
  }),
  methods: {
    getReportClick() {
      getReport(this.dateReport)
    },
    addProperty() {
      this.formMaterial.properties.push({
        name: ''
      })
    },
    deleteProperty() {
      this.formMaterial.properties.pop()
    },
  }
}

</script>

<style>
.add-properties > div {
  margin: 20px 0;
  padding-bottom: 10px;
}

.add-properties > div:not(:last-child) {
  border-bottom: 1px solid rgb(206, 212, 218);
}
</style>