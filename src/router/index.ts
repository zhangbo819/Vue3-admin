import { createMemoryHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Charts from "@/views/Charts/index.vue";
import DatePicker from "@/views/DatePicker/index.vue";
import AutoSearch from "@/views/AutoSearch/index.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Charts,
  },
  {
    path: "/Charts",
    name: "Charts",
    component: Home,
  },
  {
    path: "/DatePicker",
    name: "DatePicker",
    component: DatePicker,
  },
  {
    path: "/AutoSearch",
    name: "AutoSearch",
    component: AutoSearch,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;