<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    :plugins="plugins"
    :css-classes="cssClasses"
    :styles="styles"
    :width="width"
    :height="height"
  />
</template>

<script>
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      chartData: {
        labels: ["5/4/2022", "6/4/2022", "7/4/2022", "8/4/2022", "9/4/2022"],
        datasets: [{ label: "User Registred In last 5 Days", backgroundColor: "#f87979", data: [40, 20, 12, 45, 60] }],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },

  dates() {
    let datesArr = [];
    let d = new Date();

    console.log("Today is: " + d.toLocaleString());
    d.setDate(d.getDate() - 3);
    console.log("3 days ago was: " + d.toLocaleString());

    for (let index = 0; index < 5; index++) {
      datesArr.push(d.setDate(d.getDate() - index));
    }
    return datesArr;
  },
};
</script>
