function isEmbeddedInIframe() {
  return window !== window.parent;
}
function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
docReady(function () {
  var isInIframe = isEmbeddedInIframe();
  if (isInIframe) {
    showAntiEmbedWindow();
  }

  location.href = "#reader";
  var qrboxFunction = function (viewfinderWidth, viewfinderHeight) {
    // Square QR Box, with size = 80% of the min edge.
    var minEdgeSizeThreshold = 250;
    var edgeSizePercentage = 0.8;

    var minEdgeSize = viewfinderWidth > viewfinderHeight ? viewfinderHeight : viewfinderWidth;
    var qrboxEdgeSize = Math.floor(minEdgeSize * edgeSizePercentage);
    if (qrboxEdgeSize < minEdgeSizeThreshold) {
      if (minEdgeSize < minEdgeSizeThreshold) {
        return { width: minEdgeSize, height: minEdgeSize };
      } else {
        return {
          width: minEdgeSizeThreshold,
          height: minEdgeSizeThreshold,
        };
      }
    }
    return { width: qrboxEdgeSize, height: qrboxEdgeSize };
  };

  let html5QrcodeScanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: qrboxFunction,
    // Important notice: this is experimental feature, use it at your
    // own risk. See documentation in
    // mebjas@/html5-qrcode/src/experimental-features.ts
    experimentalFeatures: {
      useBarCodeDetectorIfSupported: true,
    },
    rememberLastUsedCamera: true,
    aspectRatio: 1.7777778,
  });

  let qrResultHandler = new QrResult(function () {
    if (html5QrcodeScanner.getState() === Html5QrcodeScannerState.PAUSED) {
      html5QrcodeScanner.resume();
    }
  });

  function onScanSuccess(decodedText, decodedResult) {
    console.log(decodedText, decodedResult);
    if (html5QrcodeScanner.getState() !== Html5QrcodeScannerState.NOT_STARTED) {
      html5QrcodeScanner.pause(/* shouldPauseVideo= */ true);
    }

    let scanType = "camera";
    if (html5QrcodeScanner.getState() === Html5QrcodeScannerState.NOT_STARTED) {
      scanType = "file";
    }
    qrResultHandler.onScanSuccess(decodedText, decodedResult, scanType);
  }
  html5QrcodeScanner.render(onScanSuccess);
  Logger.logScanStart(isInIframe);
});
