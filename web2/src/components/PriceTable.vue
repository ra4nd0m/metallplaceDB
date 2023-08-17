<template>
  <v-form>
    <MaterialDropdown v-model="materialId"/>
    <v-btn @click="addRow" class="btn">+</v-btn>
    <v-btn @click="removeRow" class="btn">-</v-btn>
    <v-btn @click="loadMonthPredict" class="btn">Подгрузить м</v-btn>
    <v-btn @click="loadWeekPredict" class="btn">Подгрузить н</v-btn>
    <v-btn @click="sendTableData" class="v-btn--outlined btn">Сохранить</v-btn>
    <vue-excel-editor v-model="data">
      <vue-excel-column field="date" label="Date" type="string" width="180px"/>
      <vue-excel-column field="value" label="Value" type="string" width="150px"/>
    </vue-excel-editor>
  </v-form>

</template>

<script>
import VueExcelEditor from 'vue-excel-editor'
import Vue from 'vue'
import MaterialDropdown from "@/components/MaterialDropdown";
import {getNLastValues} from "@/getNLastValues";
import {getPropertyName} from "@/getPropertyName";
import {addValue} from "@/addValue";

Vue.use(VueExcelEditor)

export default {
  name: "PriceTable",
  data: () => ({
    materialId: null,
    monthPredictId: 5,
    weekPredictId: 4,
    nVals: 8,
    currentPredictId: null,
    data: []
  }),
  components: {MaterialDropdown},
  methods: {
    async loadMonthPredict() {
      this.currentPredictId = this.monthPredictId
      this.data = await getNLastValues(this.materialId, this.currentPredictId, this.nVals)
    },
    async loadWeekPredict(){
      this.currentPredictId = this.weekPredictId
      this.data = await getNLastValues(this.materialId, this.currentPredictId, this.nVals)
    },
    async sendTableData() {
      let propertyName = await getPropertyName(this.currentPredictId)
      this.data.forEach(v => {
        addValue(this.materialId, propertyName, v.value, v.date)
      })
    },
    addRow() {
      let date = this.calcDate()
      this.data.push({date: date, value:  0})
    },
    removeRow() {
      this.data.pop()
    },
    calcDate() {
      let date2 = new Date(this.data[this.data.length-1].date);
      let date1 = new Date(this.data[this.data.length-2].date);
      let diffTime = Math.abs(date2 - date1);
      let diffDays = diffTime / (1000 * 60 * 60 * 24);
      let date = new Date(date2);
      if (diffDays >= 28 && diffDays <= 32) {
        // month snap
        date.setMonth(date.getMonth() + 1)
      } else {
        date.setDate(date.getDate() + diffDays);
      }
      let nextDate = date.toISOString().slice(0,10);
      return nextDate
    }
  }
}
</script>

<style scoped>
.btn {
  display: inline-block; /* Display as inline block */
  cursor: pointer; /* Show a hand cursor on hover */
  margin-right: 1rem;
  margin-bottom: 1rem;
}
</style>