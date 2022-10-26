<template>
  <div class="charts">
    <p>Charts</p>
    <div class="row">
      <div id="map1"></div>
      <div id="map2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import * as echarts from "echarts";
import DATA from "./data";

type DataItem = {
  name: string;
  value: number;
  data?: DataItem[];
};

// const data = DATA;
const data = [{ value: 0 }];
const configMap1 = reactive({
  title: {
    text: "Total table",
    subtext: "sum " + data.reduce((r, i) => r + i.value!, 0),
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
      data,
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
  myChart.on("click", (e) => {
    renderMap2(e.data as DataItem);
  });
});

const renderMap2 = (data: DataItem) => {
  var chartDom = document.getElementById("map2")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  myChart.setOption({
    title: {
      text: data.name,
      subtext: data.value,
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: data.data,
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
};
</script>

<style scoped lang="less">
.charts {
  // background: #ff08;
}
.row {
  display: flex;
  flex-direction: row;
}
#map1,
#map2 {
  flex: 1;
  // width: 80%;
  height: 400px;
}
</style>
