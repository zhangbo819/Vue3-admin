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

      <div v-for="item in data" :key="item.name" class="input-item">
        <input v-model="item.name" />
        <input v-model="item.value" />

        <div v-for="j in item.data" :key="j.name">
          <input v-model="j.name" />
          <input v-model="j.value" />
        </div>
        <button @click="handleAddChild(item)">增加</button>
      </div>

      <button @click="handleAdd(data)">增加大类</button>

      <pre>{{ data }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, toRaw } from "vue";
import * as echarts from "echarts";
import LocalStore from "./LocalStore";
// import DATA from "./data";

// TODO 有空整体优化下

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

const data = reactive(
  LocalStore.get([
    { name: "测试1", value: 4 },
    {
      name: "测试2",
      value: 6,
      data: [
        { name: "a", value: 2 },
        { name: "b", value: 4 },
      ],
    },
  ]) as DataItem[]
);

let timer: any;

watch(data, () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    console.log("timer in");
    renderMap1();
    LocalStore.save(data);
  }, 300);
});

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

const handleAddChild = (item: DataItem) => {
  if (!item.data) {
    item.data = [];
  }
  handleAdd(item.data);
};

const handleAdd = (data: DataItem[]) => {
  data.push({ name: "", value: 0 });
};

// type EChartsOption = echarts.EChartsOption;
// const ctx = getCurrentInstance();

const renderMap1 = () => {
  var chartDom = document.getElementById("map1")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  const newData = toRaw(data).filter(
    (item) => item.data || item.value || item.name // 这三项全没有则隐藏
  );

  // 渲染前处理一下数据
  let sum = 0;
  newData.forEach((item) => {
    // 有子集 则累加
    if (item.data) {
      item.value = item.data.reduce((r, j) => {
        j.value = Number(j.value);
        r += j.value;
        return r;
      }, 0);
    }

    sum += item.value;
  });

  console.log("newData", newData);

  configMap1.title.subtext = "sum " + sum;
  configMap1.series[0].data = newData;

  console.log("configMap1", configMap1);

  myChart.setOption(configMap1);
  myChart.on("click", (e) => {
    renderMap2(e.data as DataItem);
  });
};

onMounted(() => renderMap1());

const renderMap2 = (data: DataItem) => {
  var chartDom = document.getElementById("map2")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  // TODO 挪走 数据统一处理
  const subtext = data.value
    ? data.value
    : data.data?.reduce((r, i) => r + i.value, 0);

  myChart.setOption({
    title: {
      text: data.name,
      subtext,
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
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  height: 80vh;
  // height: auto;
}

#map1,
#map2 {
  flex: 1;
  width: 80%;
  height: 500px;
}

.Input {
  display: flex;
  flex-direction: column;
  align-items: center;
  .input-item {
    margin: 10px 0;
  }
}
</style>
