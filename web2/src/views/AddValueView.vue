<template>
  <v-app id="inspire">
    <v-main>
      <v-container>
        <v-row>

          <v-col>
            <v-form class="inputs">
              <h1>Добавить запись</h1>
              <MaterialDropdown v-model="form.materialId"/>
              <PropertiesForm v-model="form.properties" :materialId="form.materialId" class="startDate"/>
              <v-date-picker v-model="form.dateAddValue" elevation="6" full-width="false" class="mb-10"></v-date-picker>
              <ButtonAddValue :data="form"></ButtonAddValue>
            </v-form>
          </v-col>

          <v-col>
            <v-form class="inputs">
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
              <ButtonAddMaterial @clear="clear" :data="formMaterial"></ButtonAddMaterial>
            </v-form>
          </v-col>

          <v-col>
            <form class="inputs">
              <h1 class="mb-6">Генерация отчета</h1>
              <v-btn
                  elevation="6"
                  small
                  @click="this.getReportClick"
                  class="mb-6"
              >Сгенерировать
              </v-btn>
              <v-date-picker v-model="dateReport" elevation="6" full-width="false" class="mb-10"></v-date-picker>
            </form>
          </v-col>

        </v-row>
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
    clear() {
      this.formMaterial=  {
        name: null,
            source: null,
            market: null,
            unit: null,
            properties: [{name: ""}]
      }
    }
  }
}

</script>

<style lang="scss">
.inputs {
  background-color: white;
  max-width: 25em;
  min-height: 40em;
  max-height: 80em;
  padding: 2em;
  margin: 6.5em auto 2em auto;
  border-radius: 0.25em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.25);
}


</style>