<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from "./components/HelloWorld.vue";
// import Charts from "./components/Charts.vue";
import { ref } from "vue";
import Test from "./components/Test.vue";

const refA = ref("Hello");

setTimeout(() => {
  refA.value = "World";
}, 3000);
</script>

<template>
  <div>
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <!-- <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
    <!-- <Charts></Charts> -->
    <Test :msg="refA"></Test>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
body,
p {
  margin: 0;
}
</style>
