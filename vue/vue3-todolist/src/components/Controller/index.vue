<template>
  <div class="controller_wrap">
    <form class="controller_form">
      <my-input
        label="输入代办事项"
        v-model="todoForm.title"
        showCol="true"
      ></my-input>
      <my-input
        label="输入目标"
        v-model="todoForm.target"
        showCol="true"
      ></my-input>
      <my-date-picker
        v-model="todoForm.startTime"
        label="输入起始时间"
      ></my-date-picker>
      <my-date-picker
        label="输入结束时间"
        v-model="todoForm.endTime"
      ></my-date-picker>
    </form>
    <my-button :handleClick="getInputVal" class="confirm_btn"
      >添加事件</my-button
    >
  </div>
</template>

<script>
import { reactive, ref, toRaw } from "vue";

import myButton from "../Button";
import myInput from "../Input";
import myDatePicker from "../SimpleDatePicker";

import { cloneDeep } from "lodash";

export default {
  props: {
    addTodoItem: Function,
  },
  setup(prop) {
    const initFormData = {
      title: "",
      target: "",
      startTime: "",
      endTime: "",
    };

    const todoForm = reactive(cloneDeep(initFormData));
    const inputVal = ref("");

    const getInputVal = () => {
      console.log(toRaw(todoForm));
      prop.addTodoItem(cloneDeep(toRaw(todoForm)));

      Object.entries(initFormData).map(([key, value]) => {
        console.log(key, value);
        todoForm[key] = value;
      });
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
    myDatePicker,
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
