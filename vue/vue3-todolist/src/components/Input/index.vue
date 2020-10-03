<template>
<div class="input">
  <span class="label">{{ label }}<span v-if="showCol">:</span></span>
  <input type="text" :value="modelValue" @input="handleInpuChange" class="input_bar" @focus="focus" @blur="blur" ref="inputRef" />
</div>
</template>

<script>
import {
  onMounted,
  ref
} from 'vue';
export default {
  props: {
    label: String,
    modelValue: String,
    showCol: Boolean,
    focus: {
      type: Function,
      default: () => {}
    },
    blur: {
      type: Function,
      default: () => {}
    },
  },
  setup(props, {
    emit
  }) {
    const inputRef = ref()

    const handleInpuChange = (event) => {
      emit("update:modelValue", event.target.value);
    }

    onMounted(() => {
      console.log('ref = ', inputRef.value)
    })

    const inputFocus = () => {
      inputRef.value && inputRef.value.focus()
    }

    return {
      handleInpuChange,
      inputFocus,
      inputRef
    }
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
