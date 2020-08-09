<template>
  <div>
    <h3>Son</h3>
    <ul>
      <li>名字：{{ common.name }}</li>
      <li>年龄：{{ common.age }}</li>
      <li>权利等级: {{ common.right }}</li>
    </ul>
    <GrandSon />
  </div>
</template>

<script>
import GrandSon from "./GrandSon";
import { inject } from "vue";

export default {
  setup() {
    const common = inject("commonInfo", {});
    console.log(common);

    return {
      common,
    };
  },
  components: {
    GrandSon,
  },
};
</script>

<style>
</style>