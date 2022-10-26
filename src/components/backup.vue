<template>
	<el-drawer v-model="cart.mobileScanner" @closed="cart.mobileScanner = false" size="100%" title="Scan your Product">
		<div class="w-full flex flex-col items-center justify-center h-full">
			<div v-if="data.loading">Loading....</div>
			<QuoggaReader @onDetected="onDecode" />
			<!-- <StreamBarcodeReader v-if="cart.mobileScanner" :busy="data.isAdding" @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader> -->
		</div>

		<template #footer>
			<div class="p-4">
				<button class="btn btn-primary" @click="cart.mobileScanner = false">Close</button>
			</div>
		</template>
	</el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import StreamBarcodeReader from "../components/StreamBarcodeReader.vue";
import QuoggaReader from "../components/QuoggaReader.vue";
import cart from "../store/cart";
import products from "../store/products";

const data = reactive({ loading: true, isAdding: false });
const audio = new Audio("/beep.mp3");

const onLoaded = () => (data.loading = false);

const onDecode = async (text) => {
	if (data.isAdding) return false;
	const product = products.findProductByBarocde(text.codeResult.code);
	data.isAdding = true;
	if (product) {
		playSound();
		await cart.addToCart(product);
	}
	data.isAdding = false;
};

function playSound() {
	if (audio) audio.play();
}
</script>

<style scoped>
.information {
	margin-top: 100px;
}
</style>

























































<template>
	<div id="interactive" class="viewport scanner">
		<video />
		<canvas class="drawingBuffer" />
	</div>
</template>

<script>
import Quagga from "quagga";
export default {
	name: "QuaggaScanner",
	props: {
		onDetected: {
			type: Function,
			default(result) {},
		},
		onProcessed: {
			type: Function,
			default(result) {
				let drawingCtx = Quagga.canvas.ctx.overlay;
				let drawingCanvas = Quagga.canvas.dom.overlay;
				if (result) {
					if (result.boxes) {
						drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
						result.boxes
							.filter(function (box) {
								return box !== result.box;
							})
							.forEach(function (box) {
								Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
									color: "green",
									lineWidth: 2,
								});
							});
					}
					if (result.box) {
						Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
							color: "#00F",
							lineWidth: 2,
						});
					}
					if (result.codeResult && result.codeResult.code) {
						Quagga.ImageDebug.drawPath(result.line, { x: "x", y: "y" }, drawingCtx, { color: "red", lineWidth: 3 });
					}
				}
			},
		},
		readerTypes: {
			type: Array,
			default: () => [
				"code_128_reader",
				"ean_reader",
				"ean_8_reader",
				"code_39_reader",
				"code_39_vin_reader",
				"codabar_reader",
				"upc_reader",
				"upc_e_reader",
				"i2of5_reader",
				"2of5_reader",
				"code_93_reader",
			],
		},
		readerSize: {
			type: Object,
			default: () => ({
				width: 640,
				height: 480,
			}),
			validator: (o) => typeof o.width === "number" && typeof o.height === "number",
		},
		aspectRatio: {
			type: Object,
			default: () => ({
				min: 1,
				max: 2,
			}),
			validator: (o) => typeof o.min === "number" && typeof o.max === "number",
		},
		facingMode: {
			type: String,
			default: () => "environment",
		},
	},
	data: function () {
		return {
			isLoading: true,
			quaggaState: {
				inputStream: {
					type: "LiveStream",
					constraints: {
						width: { min: this.readerSize.width },
						height: { min: this.readerSize.height },
						facingMode: this.facingMode,
						aspectRatio: { min: 1, max: 2 },
					},
				},
				locator: {
					patchSize: "medium",
					halfSample: true,
				},
				numOfWorkers: 2,
				frequency: 10,
				decoder: {
					readers: this.readerTypes,
				},
				locate: true,
			},
		};
	},
	watch: {
		onDetected: function (oldValue, newValue) {
			if (oldValue) Quagga.offDetected(oldValue);
			if (newValue) Quagga.onDetected(newValue);
		},
		onProcessed: function (oldValue, newValue) {
			if (oldValue) Quagga.offProcessed(oldValue);
			if (newValue) Quagga.onProcessed(newValue);
		},
	},
	mounted: function () {
		Quagga.init(this.quaggaState, function (err) {
			if (err) {
				return console.error(err);
			}
			Quagga.start();
		});
		Quagga.onDetected(this.onDetected);
		Quagga.onProcessed(this.onProcessed);
	},
	destroyed: function () {
		if (this.onDetected) Quagga.offDetected(this.onDetected);
		if (this.onProcessed) Quagga.offProcessed(this.offProcessed);
		Quagga.stop();
	},
};
</script>

<style scoped>
.viewport {
	position: relative;
}
.viewport canvas,
.viewport video {
	width: 100%;
	/* height: 100%; */
	/* position: absolute;
	left: 0;
	top: 0; */
}
</style>
