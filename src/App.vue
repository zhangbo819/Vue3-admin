<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from "./components/HelloWorld.vue";

// import { useRouter } from "vue-router";

// const router = useRouter();
// router.push("/DatePicker");
// console.log("app in");
</script>

<template>
  <div class="nav">
    <router-link to="/"> 首页 </router-link> |
    <!-- <router-link to="/DatePicker"> 时间框 </router-link> -->
    <router-link to="/Chat"> Chat </router-link>
  </div>
  <router-view />
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

.nav {
  display: flex;
  flex-direction: row;
  /* justify-content: space-around; */
}
</style>
