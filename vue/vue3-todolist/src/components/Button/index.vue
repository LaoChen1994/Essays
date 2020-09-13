<template>
<div :class="'v-button' + ' button-' + type" @click="handleClick()">
  <slot></slot>
</div>
</template>

<script>
export default {
  props: {
    handleClick: Function,
    type: {
      type: String,
      default: "primary",
    },
  },
};
</script>

<style>
.v-button {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
}

.v-button:last-child {
  margin-right: 0;
}

.button-primary {
  background: #1b74da;
  color: #fff;
}

.button-danger {
  background: #f44;
  color: #fff;
}
</style>
