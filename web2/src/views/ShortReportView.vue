<template>
  <v-app>
    <v-main>
      <v-toolbar app>
        <v-toolbar-items>
          <v-btn flat to="/" class="px-2" >
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-btn flat to="/shortReport" class="px-2" v-tooltip:left="{ html: 'Short Report' }">
            <v-icon>mdi-file-document</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-form class="inputs" @submit.prevent="handleSubmit">

        <h2>Компоновка отчета</h2>
        <v-container>
          <v-row v-for="(block, index) in reportBlocks" :key="index">
            <v-col cols="12">
              <v-text-field solo label="Заголовок" v-model="block.title" class="ma-2" :rules="[(v) => !!v || 'Title is required']"/>
            </v-col>
            <v-col cols="12" v-for="(paragraph, index) in block.paragraphs" :key="index">
              <v-textarea solo label="Абзац" v-model="paragraph.text" class="ma-2" :rules="[(v) => !!v || 'Paragraph is required']"/>
            </v-col>
            <v-col cols="12" class="ma-2">
              <v-btn elevation="6"
                     small @click="addParagraph(block)" class="ma-2">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn elevation="6"
                     small color="error" @click="removeParagraph(block)" class="ma-2">
                <v-icon>mdi-minus</v-icon>
              </v-btn>

            </v-col>
            <v-col cols="12" class="ma-2">
              <v-file-input solo v-model="block.file" label="Файл" @change="handleFileUpload(block, $event)"></v-file-input>
            </v-col>
            <v-divider v-if="index < reportBlocks.length - 1" class="my-divider" color="black"></v-divider>

          </v-row>
        </v-container>
        <v-container class="ma-2">
          <v-row>
            <v-col cols="12" class="ma-2">
              <v-btn elevation="6"
                     small @click="addBlock">
                <v-icon>mdi-plus</v-icon> Добавить раздел
              </v-btn>
              <v-btn elevation="6"
                     small type="submit" color="grey">
                <v-icon>mdi-file-document</v-icon> Сгенерировать
              </v-btn>
            </v-col>

          </v-row>
        </v-container>
      </v-form>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "ShortReportView.vue",
  data() {
    return {
      reportBlocks: [{
        title: '',
        paragraphs: [''],
        file: null,
      },
      ],
    };
  },
  methods: {
    addBlock() {
      this.reportBlocks.push({
        title: '',
        paragraphs: [''],
        file: null,
      });
    },
    addParagraph(block) {
      block.paragraphs.push('');
    },
    removeParagraph(block) {
      block.paragraphs.pop();
    },
    handleFileUpload(block, event) {
      block.file = event.target.files[0]
    },
    handleSubmit() {
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