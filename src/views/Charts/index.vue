<template>
  <div class="charts">
    <div class="title">
      <p @click="active = ActiveType.Charts">Charts</p>
      <p @click="active = ActiveType.Input">Input</p>
    </div>

    <div v-show="active === ActiveType.Charts" class="row">
      <div id="map1"></div>
      <div id="map2"></div>
    </div>

    <!-- 着急写的太乱了 有时间重构下 -->
    <div v-show="active === ActiveType.Input" class="Input">
      <!-- {{ input }} -->
      <pre>{{ data }}</pre>

      <div v-for="item in data" :key="item.name" class="input-item">
        <input v-model="item.name" />
        <input v-model="item.value" />

        <div v-for="j in item.data" :key="j.name">
          <input v-model="j.name" />
          <input v-model="j.value" />
        </div>
        <button v-if="item.data" @click="handleAdd(item.data)">增加</button>
      </div>

      <button @click="handleAdd(data)">增加</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import * as echarts from "echarts";
// import DATA from "./data";

type DataItem = {
  name: string;
  value: number;
  data?: DataItem[];
};

enum ActiveType {
  Charts = "Charts",
  Input = "Input",
}

// const data = DATA;
const active = ref<ActiveType>(ActiveType.Charts);
const input = ref("");

const data = reactive([
  { name: "测试1", value: 4 },
  {
    name: "测试2",
    value: 6,
    data: [
      { name: "a", value: 2 },
      { name: "b", value: 4 },
    ],
  },
]);
const configMap1 = {
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
};

const handleAdd = (data: DataItem[] = []) => {
  data.push({ name: "", value: 0 });
};

// type EChartsOption = echarts.EChartsOption;
// const ctx = getCurrentInstance();

const renderMap1 = () => {
  var chartDom = document.getElementById("map1")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  myChart.setOption(configMap1);
  myChart.on("click", (e) => {
    renderMap2(e.data as DataItem);
  });
};

onMounted(() => renderMap1());
watch(data, renderMap1);

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
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 12px;
    p {
      color: #000;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
.row {
  display: flex;
  flex-direction: row;
}
.Input {
  display: flex;
  flex-direction: column;
  align-items: center;
  .input-item {
    margin: 10px 0;
  }
}
#map1,
#map2 {
  flex: 1;
  // width: 80%;
  height: 400px;
}
</style>
