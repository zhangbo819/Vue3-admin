import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Charts from "@/views/Charts/index.vue";

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,
  // },
  {
    path: "/",
    name: "Charts",
    component: Charts,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;