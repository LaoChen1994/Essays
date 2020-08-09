<template>
  <div>
    <div>computed -> {{ computeCount }}</div>
    <ul>
      <li>{{ count1 }}</li>
      <li>{{ count2 }}</li>
      <li>{{ reactiveCount.count }}</li>
    </ul>
    <slot></slot>
    <div class="con">
      <button @click="addCount">+1</button>
      <button @click="decrCount">-1</button>
      <button @click="stopEffect">Stop</button>
    </div>

    <ul>
      <li v-for="(item, index) in dataList.list" :key="index">{{ item.data.text }}</li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, computed, watchEffect, watch } from "vue";

export default {
  setup() {
    let count1 = ref(0);
    let count2 = ref(1);
    let dataList = reactive({ list: [] });
    let timer = null;
    const reactiveCount = reactive({ count: count2 });
    let computeCount = computed({
      get: () => count2.value + 1,
      set: (val) => (
        (count2.value = val - 1), console.log("computed改变为", val)
      ),
    });

    const addCount = () => {
      computeCount.value++;
    };

    const decrCount = () => {
      computeCount.value--;
    };

    watch(
      () => count2.value,
      (newCount2, preCount2) => {
        console.log("单一数据监听: new: ", newCount2, "prev: ", preCount2);
      }
    );

    watch(
      [computeCount, count2],
      ([newComputeCount, newCount2], [prevComputed, prevCount2]) => {
        console.log(
          "多数据监听: computed = ",
          newComputeCount,
          "count2 = ",
          newCount2
        );
        console.log(
          "多数据监听: prev_computed = ",
          prevComputed,
          "prev_count2 = ",
          prevCount2
        );
      }
    );

    const stop = watchEffect((onInvalidate) => {
      if (!timer) {
        // timer = setInterval(() => {
        //   count1.value++;
        // }, 1000);
        timer = null;
      }

      onInvalidate(() => {
        clearInterval(timer);
      });
    });

    watchEffect(() => {
      console.log("computedCount = ", computeCount.value);
      console.log("count1 = ", count1.value);
      console.log("count2 = ", count2.value);
    });
    const stopEffect = () => stop();

    return {
      count1,
      count2,
      computeCount,
      reactiveCount,
      addCount,
      decrCount,
      stopEffect,
      dataList,
    };
  },
};
</script>

<style></style>
