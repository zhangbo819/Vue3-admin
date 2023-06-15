<template>
  <div>Chat</div>
  <div class="chatList" v-loading="dataLoading">
    <div v-for="(item, index) in data" :key="item.msg + index" :class="{ 'chatItem': true, 'local': item.form === local  }">
      {{ item.time }}
      <p>{{ item.msg }}</p>
    </div>
  </div>
  <div class="bottomTooltip">
    <ElInput class="input" v-model="inputValue" @keyup.enter="sendMessage" />
    <ElButton @click="sendMessage" :loading="loading">发送</ElButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { ElButton, ElInput } from "element-plus";
import axios from 'axios'

const local = 'yry'
const remote = 'zzb'

interface DataType {
  time: string | number;
  msg: string;
  form: string;
}

const user = ref(local)
const data = ref<DataType[]>([]);
const timer = ref<any>(null);
const inputValue = ref("");
const dataLoading = ref(false)

const startTimer = () => {
  timer.value && clearTimeout(timer.value);
  timer.value = setTimeout(async() => {
    // TODO api
    dataLoading.value = true
    // const url = ''
    // await axios.get(url, { form: user.value, time: Date.now()  })
    const res = [
      { time: 1686799984400, msg: "hello zzb", form: local },
      { time: 1686799994400, msg: "hello yry", form: remote },
      { time: 1686799994400, msg: "几拿地价佛is啊就是滴飞机束带结发is觉得佛i就是扫地机佛山降低佛山街司法鉴定哦if时间", form: remote },
    ];
    dataLoading.value = false

    data.value = res.map((i) => ({
      ...i,
      time: new Date(i.time).toLocaleString(),
    }));

    startTimer();
  }, 1000);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  timer.value && clearTimeout(timer.value);
});

const loading = ref(false)
const sendMessage = async() => {
  loading.value = true
  console.log('inputValue.value', inputValue.value)
  const params = {
    addData: [{ time: Date.now(), msg: inputValue.value, form: user.value }]
  }
  // TODO api
  const url = ''
  await axios.post(url, params)
  loading.value = false
}
</script>

<style scoped lang="less">
.chatList {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 55px - 32px - 80px);
  margin-top: 10px;
  padding: 24px 0;
  background-color: #f1f2f3;
  overflow-y: scroll;
  
  .chatItem {
    margin: 8px;
    padding: 8px;
    align-self: flex-start;
    background-color: #fff;
    max-width: 50%;
    border-radius: 8px;
    color: #181a1d;

    > p {
      margin-top: 6px;
    }
    
    &.local {
      align-self: flex-end; 
      background-color: aquamarine;
      > p {
        text-align: right;
      }
    }
  
  }

}

.bottomTooltip {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 12px;
  .input {
    padding: 12px;
    // width: calc(100% - 24px);
    flex: 1
  }
}
</style>
