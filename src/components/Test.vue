<template>
  <h1>{{ props.msg }}</h1>

  <p>{{ places }}</p>

  <p>{{ places2 }}</p>

  <!-- <button type="button" @click="count++">count is: {{ count }}</button> -->
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";

const props = defineProps<{ msg: string }>();

console.log("props", props);

// const count = ref(0);

interface placeType {
  name: string;
  a: string;
  b?: string;
}

const places = ref<placeType[]>([]);
const places2 = reactive<placeType[]>([]);

onBeforeMount(() => {
  places.value = [{ a: "1", b: "2", name: "11" }];

  places2.push({
    a: "1",
    b: "2",
    name: "11",
  });

  setTimeout(() => {
    places.value[0].a = "100";

    places2[0].a = "1000";
  }, 3000);
});

console.log(
  "places.value.map((i) => i.name)",
  places.value.map((i) => i.name)
);
</script>

<style scoped></style>
