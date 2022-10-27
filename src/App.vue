<template>
  <div size="100%" title="Scan your Product" style="background: red; height: 100%">
    <StreamBarcodeReader :onDetected="logIt" />
  </div>
  <!-- <BarChart />
  <PieChart /> -->
</template>

<script setup>
import { ref, reactive } from "vue";
import StreamBarcodeReader from "./components/ScannerModal.vue";
import BarChart from "./components/Chart.vue";
import PieChart from "./components/PieChrat.vue";
const data = reactive({ loading: true, isAdding: false, barcode: null });

const onLoaded = () => (data.loading = false);

const logIt = (data) => {
  alert(data.codeResult.code);
};

const onDecode = async (text) => {
  alert("onDecode", text);
};
</script>

<style scoped>
.information {
  margin-top: 100px;
}
</style>
