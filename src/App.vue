<template>
  <div size="100%" title="Scan your Product" style="background: red">
    <div class="w-full flex flex-col items-center justify-center h-full">
      <StreamBarcodeReader />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import StreamBarcodeReader from "./components/ScannerModal.vue";

const data = reactive({ loading: true, isAdding: false });

const onLoaded = () => (data.loading = false);

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
