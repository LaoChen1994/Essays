<template>
  <div>
    <div>{{ count }} / {{ object.foo }}</div>
    <button @click="addNumber">+1</button>
  </div>
</template>

<script>
import { reactive, ref } from "vue";

export default {
  props: {
    msg: String,
  },
  setup(props) {
    const count = ref(0);
    const object = reactive({ foo: "bar" });
    console.log(props.msg);

    const addNumber = () => {
      count.value++;
      object.foo += count.value;
    };

    return {
      count,
      object,
      addNumber,
    };
  },
};
</script>

<style>
</style>