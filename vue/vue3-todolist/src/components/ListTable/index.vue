<template>
<div class="todoWrap">
  <SimpleTable :dataSource="todoList" :columnConfig="column">
    <template v-slot:action="{ item }">
      <my-button :handleClick="handleChangeClick(item)" type="primary">修改状态</my-button>
      <my-button :handleClick="handleDeleteClick(item)" type="danger">删除</my-button>
    </template>

    <template v-slot:status="{ item }">
      <span v-if="item.isFinished">已完成</span>
      <span v-else>未完成</span>
    </template>
  </SimpleTable>
  <Controller :addTodoItem="addTodoItem" />
</div>
</template>

<script>
import SimpleTable from "../SimpleTable";
import myButton from "../Button";
import Controller from "../Controller";

export default {
  props: {
    todoList: Array,
    deleteTodoItem: Function,
    changeTodoItem: Function,
    addTodoItem: Function,
  },
  setup(props) {
    const column = [{
        title: "待办事项",
        key: "title",
      },
      {
        title: "目标",
        key: "target",
      },
      {
        title: "起始时间",
        key: "startTime",
        width: "150px",
      },
      {
        title: "结束时间",
        key: "endTime",
        width: "150px",
      },
      {
        title: "状态",
        slot: "status",
      },
      {
        title: "操作",
        slot: "action",
        width: "200px",
      },
    ];

    const handleChangeClick = (item) => () => {
      props.changeTodoItem(item);
    };

    const handleDeleteClick = (item) => () => {
      props.deleteTodoItem(item);
    };

    console.log(props.addTodoItem);

    return {
      column,
      handleChangeClick,
      handleDeleteClick,
    };
  },

  components: {
    SimpleTable,
    myButton,
    Controller,
  },
};
</script>

<style scope></style>
