<template>
<div>
  <ListTable :todoList="todoList" :deleteTodoItem="deleteTodoItem" :changeTodoItem="changeTodoItem" :addTodoItem="addTodoItem" />
</div>
</template>

<script>
import ListTable from "../components/ListTable";
import {
  todoListMock
} from "../constant.js";
import {
  onMounted,
  reactive
} from "vue";

export default {
  setup() {
    let todoList = reactive([]);

    const deleteTodoItem = (deleteItem) => {
      const index = todoList.find((item) => item.id === deleteItem);
      todoList.splice(index, 1);
    };

    const addTodoItem = (todoItem) => {
      todoList.push(todoItem);
    };

    const changeTodoItem = (changeItem) => {
      const index = todoList.findIndex((item) => item.id === changeItem.id);
      if (index !== -1) {
        todoList[index].isFinished = !todoList[index].isFinished;
      }
    };

    onMounted(() => {
      todoList.push(...todoListMock);
    });

    return {
      todoList: todoList,
      deleteTodoItem,
      changeTodoItem,
      addTodoItem,
    };
  },
  components: {
    ListTable,
  },
};
</script>

<style></style>
