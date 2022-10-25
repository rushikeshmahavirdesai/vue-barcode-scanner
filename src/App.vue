<template>
  <div id="qr-code-full-region"></div>
  {{ resultCode }}
</template>

<script>
import { Html5QrcodeScanner } from "html5-qrcode";
export default {
  name: "App",

  components: {},
  data() {
    return {
      resultCode: "",
    };
  },
  //
  created() {
    // this.getCartAllItems();
  },
  mounted() {
    const config = {
      fps: this.fps,
      qrbox: this.qrbox,
    };
    const html5QrcodeScanner = new Html5QrcodeScanner("qr-code-full-region", config);
    html5QrcodeScanner.render(this.onScanSuccess);
  },
  methods: {
    onScanSuccess(decodedText, decodedResult) {
      this.resultCode = decodedText + "===" + decodedResult;
      this.$emit("result", decodedText, decodedResult);
    },
  },
};
</script>
