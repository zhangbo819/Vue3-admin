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

type DataItem = {
  name: string;
  value: number;
  data?: DataItem[];
};
const DATA = [
  {
    name: "item1",
    value: 0,
    data: [
      { name: "subItem1", value: 1 },
      { name: "subItem2", value: 2 },
      { name: "subItem3", value: 2 },
    ],
  },
  {
    name: "item2",
    value: 0,
    data: [
      { name: "subItem1", value: 3 },
      { name: "subItem2", value: 2 },
      { name: "subItem3", value: 2 },
      { name: "subItem4", value: 2 },
    ],
  },
  {
    name: "item3",
    value: 0,
    data: [
      { name: "subItem1", value: 2 },
      { name: "subItem2", value: 2 },
    ],
  },
];

const data = DATA.map((i) => {
  i.value = i.data.reduce((r, i) => r + i.value, 0);
  return i;
});
const configMap1 = reactive({
  title: {
    text: "Referer of a Website",
    subtext: "sum " + data.reduce((r, i) => r + i.value, 0),
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
