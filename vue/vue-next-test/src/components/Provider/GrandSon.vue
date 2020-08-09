<template>
  <div class="wrap">
    <fieldset>
      <legend>GrandSon Modify</legend>
      <div class="item">
        <span>修改姓名</span>
        <input type="text" v-model="common.name" />
      </div>

      <div class="item">
        <span>修改年龄</span>
        <input type="number" v-model="common.age" />
      </div>

      <div class="item">
        <span>修改权利</span>
        <div>
          <input type="radio" id="Manager" value="10" v-model="common.right" />
          <label for="Master">管理员</label>
        </div>
        <div>
          <input type="radio" id="Origin" value="1" v-model="common.right" />
          <label for="Origin">普通人</label>
        </div>
        <div>
          <input type="radio" id="None" value="0" v-model="common.right" />
          <label for="None">无</label>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  setup() {
    const common = inject("commonInfo", {});
    console.log(common);

    return {
      common,
    };
  },
};
</script>

<style>
.item {
  text-align: left;
}

.wrap {
  width: 300px;
  margin: 0 auto;
}
</style>