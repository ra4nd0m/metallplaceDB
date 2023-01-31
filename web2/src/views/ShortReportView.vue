<template>
  <v-app>
    <v-main>
      <Navbar/>
      <v-form class="inputs" @submit.prevent="handleSubmit">
        <h2>Компоновка отчета</h2>
        <v-container>
          <v-row v-for="(block, index) in reportBlocks" :key="index">
            <v-col cols="12">
              <v-text-field solo label="Заголовок" v-model="block.title" class="ma-2"
                            :rules="[(v) => !!v || 'Введите заголовок']"/>
            </v-col>
            <v-col cols="12">
              <v-textarea solo label="Абзац" v-model="block.paragraphsRaw" @input=splitParagraphs(block) class="ma-2"
                          :rules="[(v) => !!v || 'Введите текст абзаца']"/>
            </v-col>
            <v-col cols="12" class="ma-2">
              <v-file-input
                  solo
                  v-model="block.file"
                  label="Файл"
                  @change="handleFileUpload(block, $event)"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              ></v-file-input>
            </v-col>
            <v-divider v-if="index < reportBlocks.length - 1" class="my-divider" color="black"></v-divider>
          </v-row>
        </v-container>
        <v-container class="ma-2">
          <v-row>
            <v-col cols="12" class="ma-2">
              <v-btn elevation="6"
                     class="ma-2"
                     small
                     @click="addBlock">
                <v-icon>mdi-plus</v-icon>
                Добавить раздел
              </v-btn>
              <v-btn elevation="6"
                     color="error"
                     small
                     class="ma-2"
                     @click="removeBlock">
                <v-icon>mdi-minus</v-icon>
                Удалить раздел
              </v-btn>
              <v-btn elevation="6"
                     small
                     type="submit"
                     class="ma-2">

                <v-icon>mdi-file-document</v-icon>
                Сгенерировать
              </v-btn>

            </v-col>
          </v-row>

        </v-container>
        <v-date-picker v-model="dateReport" elevation="6" full-width="false"></v-date-picker>
      </v-form>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar";
import PriceTable from "@/components/PriceTable";
import 'core-js/features/typed-array/uint8-array';
import {getShortReport} from "@/getShortReport";

export default {
  name: "ShortReportView.vue",
  components: {PriceTable, Navbar},
  data() {
    return {
      dateReport: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      reportBlocks: [{
        title: '',
        paragraphs: [''],
        paragraphsRaw: '',
        file: null,
      },
      ],
    };
  },
  methods: {
    addBlock() {
      this.reportBlocks.push({
        title: '',
        paragraphs: [],
        file: null,
      });
    },
    removeBlock() {
      this.reportBlocks.pop()
    },
    splitParagraphs(block) {
      block.paragraphs = block.paragraphsRaw.split(`\n`)
    },
    handleFileUpload(block, e) {
      let file = e;
      let reader = new FileReader();
      reader.addEventListener('load', function (e) {
        block.file = e.target.result.split(",")[1];
      });
      reader.readAsDataURL(file);
    },
    handleSubmit() {
      getShortReport(this.reportBlocks, this.dateReport)
    },
  },
}


</script>

<style lang="scss">
.inputs {
  background-color: white;
  max-width: 50em; /* Increased max-width value */
  min-height: 40em;
  padding: 2em;
  margin: 6.5em auto 2em auto;
  border-radius: 0.25em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.25);
}

.my-divider {
  border-top: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
}
</style>