<template>
  <div class="charts">
    <p>Charts 1</p>
    <div class="row">
      <div id="map1"></div>
      <div id="map2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import * as echarts from "echarts";

const configMap1 = reactive({
  title: {
    text: "Referer of a Website",
    subtext: "Fake Data",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  // legend: {
  //   orient: "vertical",
  //   left: "left",
  // },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

// type EChartsOption = echarts.EChartsOption;
// const ctx = getCurrentInstance();

onMounted(() => {
  var chartDom = document.getElementById("map1")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  myChart.setOption(configMap1);
});

onMounted(() => {
  var chartDom = document.getElementById("map2")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  myChart.setOption(configMap1);
});
</script>

<style scoped lang="less">
.charts {
  background: #ff08;
}
.row {
  display: flex;
  flex-direction: row;
}
#map1, #map2 {
  flex: 1;
  // width: 80%;
  height: 400px;
}
</style>