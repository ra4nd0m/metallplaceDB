<template>
  <v-app id="inspire">
    <v-main>
      <Navbar/>
      <v-container>
        <v-row>

          <v-col>
            <v-form class="inputs">
              <h1>Добавить запись</h1>
              <MaterialDropdown solo v-model="form.materialId"/>
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
                  solo
                  v-model="formMaterial.name"
                  placeholder="Материал"
              ></v-text-field>

              <v-text-field
                  v-model="formMaterial.source"
                  solo
                  placeholder="Источник"
              ></v-text-field>

              <v-text-field
                  v-model="formMaterial.market"
                  solo
                  placeholder="Страна"
              ></v-text-field>

              <v-text-field
                  v-model="formMaterial.deliveryType"
                  solo
                  placeholder="Усл. поставки"
              ></v-text-field>

              <v-text-field
                  v-model="formMaterial.unit"
                  solo
                  placeholder="Ед. измерения"
              ></v-text-field>
              <form
                  ref="form"
              >
                <h3>Свойства</h3>
                <v-btn
                    elevation="6"
                    small
                    solo
                    @click="addProperty"
                    class="mb-6 mr-3"
                >+
                </v-btn>
                <v-btn
                    elevation="6"
                    small
                    solo
                    color="error"
                    @click="deleteProperty"
                    class="mb-6"
                >-
                </v-btn>
                <div class="form-row" v-for="(property, index) in formMaterial.properties" :key="index">
                  <v-text-field
                      v-model="property.name"
                      solo
                      :name="`formMaterial.properties[${index}][name]`"
                      placeholder="Название"
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
                  @click="this.getWeeklyReportClick"
                  class="mb-6"
              >Еженедельный
              </v-btn>
              <v-btn
                  elevation="6"
                  small
                  @click="this.getMonthlyReportClick"
                  class="mb-6"
              >Ежемесячный
              </v-btn>
              <v-date-picker v-model="dateReport" elevation="6" full-width="false" class="mb-10"></v-date-picker>
            </form>
          </v-col>
        </v-row>
        <v-container>
          <v-btn @click="sendRequest" color="primary" class="ma-5 mb-5">Обновить базу</v-btn>
          <!--
          <v-file-input
              solo
              v-model="file"
              @change="onFileChange"
              label="Select a file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          ></v-file-input>
          -->
          <v-progress-circular v-if="showLoading" indeterminate color="primary"></v-progress-circular>
          <v-alert v-if="showSuccess" type="success" :timeout="3000">
            Request completed successfully!
          </v-alert>
          <v-alert v-if="showError" type="error">
            {{ errorMessage }}
          </v-alert>
        </v-container>
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
import Navbar from "@/components/Navbar";

export default {
  name: "AddValue",
  components: {
    Navbar,
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
      deliveryType: null,
      source: null,
      market: null,
      unit: null,
      properties: [{name: ""}]
    },
    showLoading: false,
    showSuccess: false,
    showError: false,
    errorMessage: '',
    file: null,
  }),
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    async renewFile() {
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("fileSize", this.file.size);

      const response = await fetch("http://localhost:8080/UpdateMainFile", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      console.log(data)
    },
    sendRequest() {
      this.showLoading = true
      //try {
      //  this.renewFile()
      //} catch (err) {
      //  this.showLoading = false
      //  this.showError = true
      //  this.errorMessage = 'Возникла ошибка при загрузке файла: ' + err
      //  return
      //}
      // send request to server
      fetch('http://localhost:8080/initImport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
          .then(response => response.json())
          .then(data => {
            this.showLoading = false
            if (data.success) {
              this.showSuccess = true
            } else {
              this.showError = true
              this.errorMessage = data.error_message
            }
          })
          .catch(error => {
            this.showLoading = false
            this.showError = true
            this.errorMessage = 'Возникла ошибка при обновлении'
          })
    },
    getWeeklyReportClick() {
      getReport(this.dateReport, 'weekly')
    },
    getMonthlyReportClick() {
      getReport(this.dateReport, 'monthly')
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
  padding: 2em;
  margin: 6.5em auto 2em auto;
  border-radius: 0.25em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.25);
}
</style>