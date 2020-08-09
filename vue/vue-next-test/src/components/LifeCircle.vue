<template>
  <div>
    <h1>LifeCircle</h1>
    <div>count: {{ count }}</div>
    <button @click="addCount">+1</button>
  </div>
</template>

<script>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  ref,
  watchEffect,
} from "vue";

export default {
  setup() {
    console.log("setup");
    const count = ref(0);

    const addCount = () => {
      count.value++;
    };

    watchEffect(() => {
      console.log(count.value);
    });

    onBeforeMount(() => {
      console.log("onBeforeMount");
    });

    onMounted(() => {
      console.log("onMounted");
      count.value++;
    });

    onBeforeUpdate(() => {
      console.log("onBeforeUpdate");
    });

    onUpdated(() => {
      console.log("updated");
    });

    onBeforeUnmount(() => {
      console.log("onBeforeMount");
    });

    onUnmounted(() => {
      console.log("onUnmounted");
    });

    return {
      count,
      addCount,
    };
  },
};
</script>

<style>
</style>