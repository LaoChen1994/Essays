<template>
  <div>
    <h2>Parent</h2>
    <Son />
  </div>
</template>

<script>
import { provide, reactive } from "vue";
import Son from "./Son";

export default {
  setup() {
    const userInfo = reactive({
      name: "",
      age: 0,
      right: 0,
    });

    provide("commonInfo", userInfo);

    return {
      userInfo,
    };
  },
  components: {
    Son,
  },
};
</script>

<style>
</style>