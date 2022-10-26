<template>
  <div size="100%" title="Scan your Product" style="background: red">
    <div class="w-full flex flex-col items-center justify-center h-full">
      <textarea name="" v-model="data.barcode" id="" cols="30" rows="10"></textarea>
      <StreamBarcodeReader :onDetected="logIt" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import StreamBarcodeReader from "./components/ScannerModal.vue";

const data = reactive({ loading: true, isAdding: false, barcode });

const onLoaded = () => (data.loading = false);

const logIt = (data) => {
  data.barcode = data;
  alert(data, data.codeResult.code);
};

const onDecode = async (text) => {
  alert(text);
  if (data.isAdding) return false;

  data.isAdding = false;
};
</script>

<style scoped>
.information {
  margin-top: 100px;
}
</style>
