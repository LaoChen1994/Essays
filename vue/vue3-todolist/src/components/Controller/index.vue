<template>
<div class="controller_wrap">
  <form class="controller_form">
    <my-input label="输入代办事项" v-model="todoForm.title" showCol="true"></my-input>
    <my-input label="输入目标" v-model="todoForm.target" showCol="true"></my-input>
    <my-input label="输入完成时间" v-model="todoForm.startTime" showCol="true"></my-input>
    <my-input label="输入结束时间" v-model="todoForm.endTime" showCol="true"></my-input>
  </form>
  <my-button :handleClick="getInputVal" class="confirm_btn">获取值</my-button>
</div>
</template>

<script>
import {
  reactive,
  ref,
  watchEffect
} from "vue";
import myButton from "../Button";

import myInput from "../Input";
export default {
  props: {
    addTodoItem: Function,
  },
  setup(prop) {
    const todoForm = reactive({
      title: "",
      target: "",
      startTime: "",
      endTime: "",
    });
    const inputVal = ref("");

    watchEffect(() => {
      console.log(inputVal.value);
    });

    console.log(prop);

    const getInputVal = () => {
      prop.addTodoItem(todoForm);
    };

    return {
      inputVal,
      todoForm,
      getInputVal,
    };
  },
  components: {
    myInput,
    myButton,
  },
};
</script>

<style>
.controller_wrap {
  width: 300px;
  margin-top: 20px;
}

.controller_form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controller_form .input {
  margin-bottom: 10px;
}

.confirm_btn {
  margin-left: 20px;
}
</style>
