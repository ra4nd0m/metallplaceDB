<template>
  <div id="app">
    <router-view />
  </div>

</template>

<script>
import AddValueView from "@/views/AddValueView";
import ShortReportView from "@/views/ShortReportView";
export default {
  name: 'App',
  components: {
    AddValueView,
    ShortReportView
  },

  data: () => ({
    //
  }),
};
</script>
