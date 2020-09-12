<template>
<div>
  <div>
    <input type="text" :ref="inputRef" />
    <button @click="focusInput">focus</button>
  </div>
  <div v-for="(item, i) in list" :ref="el => { divs[i] = el }" :key="{i}">{{ item }}</div>
</div>
</template>

<script>
import {
  ref,
  onMounted,
  watchEffect,
  unref,
  reactive,
  toRef,
  toRefs,
  isProxy,
  isRef,
  isReactive
} from "vue";

export default {
  setup() {
    let list = ref([1, 2, 3]);
    const divs = ref([]);
    const inputRef = ref(null);
    const _ref = ref(1);
    const _ref2 = ref({
      a: 1,
    });

    const _reactive1 = reactive(1);
    const _reactive2 = reactive({
      a: 1,
      b: 2
    });

    const getRefListInner = () => {
      const divRef = divs.value;

      divRef.forEach((ref) => {
        console.log(ref.innerHTML);
      });
    };

    onMounted(() => {
      setTimeout(() => {
        list.value = [4, 5, 6];
      }, 500);

      const _reactive1Ref = toRef(_reactive1);
      const _reactive2Ref = toRef(_reactive2, "a");
      const _reactiveRefs = toRefs(_reactive2);
      _reactive2Ref.value++;
      _reactive2.b++

      console.log("_ref = ", unref(_ref));
      console.log("_ref2 = ", unref(_ref2));
      console.log("_reactive = ", _reactive1Ref);
      console.log("_reactive2 = ", _reactive2.b);
      console.log("_refs = ", _reactiveRefs.b.value);
      console.log("_reactiveRefs = ", _reactiveRefs)

      console.log('********************************type*******************************')
      console.log("isRef = ", isRef(_ref)) // true
      console.log("isRef2 = ", isRef(_ref2)) // true
      console.log("isProxy ref2 = ", isProxy(_ref2)) // false
      console.log('isReactive ref = ', isReactive(_ref2)) // false
      console.log("isProxy ref2 = ", isProxy(_ref2.value)) // true
      console.log("isReactive = ", isReactive(_ref2.value)) // true

      console.log('isReactive reactive1 = ', isReactive(_reactive1))
      console.log('isReactive reactive2 = ', isReactive(_reactive2))
      console.log('isRef reactive2 = ', isRef(_reactive1.value))

      console.log('toRef single elem = ', isRef(_reactive1Ref))
      console.log("toRef total = ", isRef(_reactive1Ref))
      console.log("toRef obj isReactive = ", isReactive(_reactive2Ref.value))

      console.log("toRefs = ", isRef(_reactiveRefs))
      console.log('toRefs is Proxy = ', isRef(_reactiveRefs))
      console.log('toRefs isReactive = ', isReactive(_reactiveRefs))
      console.log("toRefs elem = ", isRef(_reactiveRefs.a))
    });

    watchEffect(() => {
      getRefListInner();
    });

    const focusInput = () => {
      inputRef.value && inputRef.value.focus();
    };

    return {
      list,
      divs,
      inputRef,
      focusInput,
    };
  },
};
</script>
