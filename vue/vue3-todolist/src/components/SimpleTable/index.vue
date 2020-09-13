<template>
<table class="table">
  <colgroup>
    <col v-for="item in columns" :key="item.key" :aria-colspan="item.span || 1" :width="item.width || '100px'" />
  </colgroup>
  <thead class="table-head">
    <th scope="col" v-for="(item, index) in columns" :key="'header -' + index">
      {{ item.title }}
    </th>
  </thead>
  <tbody>
    <tr v-for="(data, index) in tableData" :key="'tabledata' + index">
      <td v-for="(item, i) in columns" :key="'tabledata - index' + i">
        <template v-if="item.slot">
          <slot :name="item.slot" :index="index" :item="data"></slot>
        </template>
        <template v-else>{{ data[item.key] }}</template>
      </td>
    </tr>
  </tbody>
</table>
</template>

<script>
import {
  reactive,
  watchEffect
} from "vue";
export default {
  props: {
    dataSource: Array,
    columnConfig: Array,
    align: String,
  },
  setup(props) {
    let columns = reactive([]);
    let tableData = reactive([]);

    watchEffect(() => {
      columns = props.columnConfig;
      tableData = props.dataSource;
    });

    return {
      columns,
      tableData,
    };
  },
};
</script>

<style>
.table {
  text-align: left;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #e9e9e9;
}

.table th,
.table td {
  padding: 6px 12px;
  border: 1px solid #e9e9e9;
}

.table-head {
  height: 20px;
  background: #d4d4d3;
}
</style>
