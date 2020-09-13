<template>
<div class="input">
  <span class="label">{{ label }}<span v-if="showCol">:</span></span>
  <input type="text" :value="modelValue" @input="handleInpuChange" class="input_bar" />
</div>
</template>

<script>
export default {
  props: {
    label: String,
    modelValue: String,
    showCol: Boolean,
  },
  methods: {
    handleInpuChange(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>

<style>
.input {
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
}

.label {
  margin-right: 6px;
  font-weight: 600;
}

.input_bar {
  height: 24px;
  border: 1px solid #eee;
  outline: none;
  padding: 4px 8px;
}

.input_bar:focus {
  border-color: #1155bb;
}
</style>
