<template>
  <div>
    <el-date-picker
      v-model="value1"
      type="datetimerange"
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
      :disabled-date="disabledDate"
      @calendar-change="calendarChange"
    />
    {{ value1 }}
  </div>
</template>

<script setup lang="ts">
// 此组件用于测试
import { ElDatePicker } from "element-plus";
import { ref } from "vue";

const value1 = ref<[Date, Date]>([new Date(), new Date()]);

const disabledDate = (day: Date) => {
  return Date.now() - day.getTime() >= 3 * 30 * 24 * 3600 * 1000;
};

const start1 = new Date();
const disabledDate2 = (day: Date) => {
  return day.getTime() >= start1.getTime();
};

const calendarChange = (date: [Date, Date]) => {
  const [start, end] = date;
  console.log(start, end);
};
</script>

<style scoped lang="less"></style>
