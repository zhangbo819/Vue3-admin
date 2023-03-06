<template>
  <div class="charts">
    <div class="title">
      <p @click="active = ActiveType.Charts">Charts</p>
      <p @click="active = ActiveType.Input">Input</p>
    </div>

    <!-- 地图 -->
    <div v-show="active === ActiveType.Charts" class="row">
      <div id="map-sum" class="map"></div>
      <div id="map-item" class="map"></div>
    </div>

    <!-- 输入 tab -->
    <!-- 着急写的太乱了 有时间重构下 -->
    <div v-show="active === ActiveType.Input" class="Input">
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

interface ItemData {
  name: string;
  value: number;
  data?: { name: string; value: number }[];
}

interface SumData {
  name: string;
  value: number;
  data?: ItemData[];
}

enum ActiveType {
  Charts = "Charts",
  Input = "Input",
}

// const data = DATA;
const active = ref<ActiveType>(ActiveType.Charts);
// const input = ref("");

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
  ]) as SumData[]
);

let timer: any;

watch(data, () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    renderSumMap();
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
  data.push({ name: "", value: 0, data: [] });
};

const handleAddChild = (item: SumData) => {
  if (!item.data) {
    item.data = [];
  }
  item.data.push({ name: "", value: 0 });
};

// type EChartsOption = echarts.EChartsOption;
// const ctx = getCurrentInstance();

// 处理所有数据
const _formatData = () => {
  const newData = toRaw(data).filter(
    (item) =>
      (item.data && item.data.reduce((r, i) => r + i.value, 0)) || // 有子类时，子类也必须有值
      +item.value // 这两项全没有则隐藏
  );

  let sum = 0; // 总值

  newData.forEach((item) => {
    if (item.data) {
      let value = 0;

      item.data = item.data
        .filter((item) => item.value) // 1 过滤掉为空项
        .map((son) => {
          // 2 根据子集的数目重新计算父级
          value += Number(son.value);

          return son;
        });

      // 左小右大排序
      item.data.sort((a, b) => b.value - a.value);

      item.value = value;
    } else {
      // 没有子集，给一个子集
      item.data = [{ ...item }];
    }

    sum += Number(item.value);
  });

  // 左小右大排序
  newData.sort((a, b) => b.value - a.value);

  //  TODO 将最小的几个合并
  // const smallTarget = sum / 5; // 小于总值的五分之一
  // for (let i = newData.length - 1; i >= 0; i--) {
  //   const item = newData[i];

  //   if (item.data?.length === 1) {
  //   }
  // }

  console.log("newData", newData);
  return { newData, sum };
};

// 渲染总体的 Map
const renderSumMap = () => {
  var chartDom = document.getElementById("map-sum")!;
  // console.log("chartDom", chartDom);
  var myChart = echarts.init(chartDom);

  const { newData, sum } = _formatData();

  configMap1.title.subtext = "sum " + sum.toFixed(2);
  configMap1.series[0].data = newData;

  console.log("configMap1", configMap1);

  myChart.setOption(configMap1);
  myChart.on("click", (e) => {
    renderItemMap(e.data as SumData);
  });
};

onMounted(() => renderSumMap());

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
  }
}
</style>
