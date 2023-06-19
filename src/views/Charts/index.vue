<template>
  <div class="charts">
    <header class="title">
      <p @click="active = ActiveType.Charts">Charts</p>
      <p @click="active = ActiveType.Input">Input</p>
    </header>
    <header class="toolbar">
      <ElButton @click="toggleFlat">{{ isFlat ? "恢复" : "平铺" }}</ElButton>
    </header>

    <!-- 地图 -->
    <section v-show="active === ActiveType.Charts" class="row">
      <div id="map-sum" class="map"></div>
      <div id="map-item" class="map"></div>
    </section>

    <!-- 输入 tab -->
    <!-- 着急写的太乱了 有时间重构下 -->
    <section v-show="active === ActiveType.Input" class="Input">
      <!-- {{ input }} -->

      <div
        v-for="(item, index) of data"
        :key="'item_' + index"
        class="input-item"
      >
        <input v-model="item.name" />
        <!-- <input v-model="item.value" type="number" pattern="number" /> -->
        <input v-model="item.value" type="text" inputmode="decimal" />

        <div
          v-for="(childItem, childIndex) of item.data"
          :key="'childItem' + index + childIndex"
        >
          <input v-model="childItem.name" />
          <!-- <input v-model="childItem.value" type="number" pattern="number" /> -->
          <input v-model="childItem.value" type="text" inputmode="decimal" />
        </div>
        <button @click="handleAddChild(item)">增加</button>
      </div>

      <div class="tools">
        <button @click="handleAdd(data)">增加大类</button>
        <button @click="handleCleanUp">整理</button>
      </div>

      <pre>{{ data }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, toRaw } from "vue";
import { ElButton } from "element-plus";
import * as echarts from "echarts";
import LocalStore from "./LocalStore";
import { ActiveType, SumData } from "./interface";
import { formatOriginalData, formatShowData } from "./util";
// import DATA from "./data";

// TODO 有空整体优化下

// const data = DATA;
const active = ref<ActiveType>(ActiveType.Charts);
// const input = ref("");

const data: SumData[] = reactive(
  LocalStore.get([
    { name: "测试1", value: 4 },
    {
      name: "测试2",
      value: 0,
      data: [
        { name: "A", value: 2 },
        { name: "C", value: 4 },
      ],
    },
    {
      name: "测试3",
      value: 0.1,
    },
  ])
);

let timer: any;

watch(data, () => {
  // console.log("watch data", data);
  const formatData = formatOriginalData(toRaw(data));
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    renderSumMap(formatData);
    LocalStore.save(formatData);
  }, 300);
});

const configMap1 = {
  title: {
    text: "Total table",
    subtext: "sum " + data.reduce((r, i) => r + Number(i.value), 0),
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  // TODO legend
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

const handleAdd = (data: SumData[]) => {
  data.push({ name: "", value: 0 });
};

const handleAddChild = (item: SumData) => {
  if (!item.data) {
    item.data = [];
  }
  item.data.push({ name: "", value: 0 });
  item.data = [...item.data]; // 触发更新
};

// type EChartsOption = echarts.EChartsOption;
// const ctx = getCurrentInstance();

// 平铺 收缩逻辑
const isFlat = ref(false);
const toggleFlat = () => {
  isFlat.value = !isFlat.value;
};
watch(isFlat, () => {
  const formatData = formatOriginalData(toRaw(data));
  renderSumMap(formatData);
});

// 渲染总体的 Map
const renderSumMap = (formatData: SumData[]) => {
  var chartDom = document.getElementById("map-sum")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  let { newData, sum } = formatShowData(formatData);

  if (isFlat.value) {
    newData = newData.reduce((r, i) => {
      if (i.data) {
        r.push(...i.data);
      } else {
        r.push(i);
      }
      return r;
    }, [] as SumData[]);
  }

  configMap1.title.subtext = "sum " + sum.toFixed(2);
  configMap1.series[0].data = newData;

  // console.log("configMap1", configMap1);

  myChart.setOption(configMap1);
  myChart.on("click", (e) => {
    renderItemMap(e.data as SumData);
  });
};

onMounted(() => {
  const formatData = formatOriginalData(toRaw(data));
  renderSumMap(formatData);
});

const renderItemMap = (data: SumData) => {
  var chartDom = document.getElementById("map-item")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  myChart.setOption({
    title: {
      text: data.name,
      subtext: data.value, // 副标题显示总数
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

const handleCleanUp = () => {
  // 大类排序
  data.sort((a, b) => Number(b.value) - Number(a.value));
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

  .toolbar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 8px 0;
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

.map {
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
    button {
      display: block;
      // margin: 0 auto;
    }
  }

  .tools {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    button + button {
      margin-left: 10px;
    }
  }
}
</style>
