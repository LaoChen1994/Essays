## Vue 3学习笔记

### 1. 环境搭建

+ 参考资料：[官方文档](https://composition-api.vuejs.org/zh/api.html#setup)

+ 使用vue-cli搭建脚手架工具 -> 创建一个vue工程 -> 安装vue-next

  ~~~bash
  yarn global add vue-cli
  vue create vue-test
  cd vue-test
  vue add vue-next
  ~~~

### 2. 基础api使用

#### 1. setup

+ 功能类似于原来的mounted
+ 接受参数 props, context
+ 如果需要使用到pros，需要先在props这个参数中定义对应props的类型， **不要解构赋值**(会无法监听到传入参数的变化)
+ context中包含了对于内部组件的代理值包括attrs, slots等(**可以解构赋值，一直能拿到最新值**)

~~~vue
<template>
  <div>{{ count }} / {{ object.foo }}</div>
</template>

<script>
import { reactive, ref } from "vue";

export default {
  props: {
    msg: String,
  },
  setup(props) {
    const count = ref(0);
    const object = reactive({ foo: "bar" });
    console.log(props.msg);

    return {
      count,
      object,
    };
  },
};
</script>
~~~

#### 2. 响应式api

#### 1. reactive和ref

> 官方解释：
>
> reactive: 接收一个普通对象然后返回该普通对象的响应式代理。等同于 2.x 的 `Vue.observable()`
>
> ref:  接受一个参数值并返回一个响应式且可改变的 ref 对象。ref 对象拥有一个指向内部值的单一属性 `.value`。



##### 小例子

~~~vue
<template>
  <div>
    <div>{{ count }} / {{ object.foo }}</div>
    <button @click="addNumber">+1</button>
  </div>
</template>

<script>
import { reactive, ref } from "vue";

export default {
  props: {
    msg: String,
  },
  setup(props) {
    const count = ref(0);
    const object = reactive({ foo: "bar" });
    console.log(props.msg);

    const addNumber = () => {
      count.value++;
      object.foo += count.value;
    };

    return {
      count,
      object,
      addNumber,
    };
  },
};
</script>

<style>
</style>
~~~

##### 结果分析与总结

> 结果： 点击按钮无论是count还是object中的foo 都会同时变化

+ reactive 个人理解应该用在对于引用类型/对象类型的监听上，因为调用对应的值进行响应式变化的时候直接调用object.foo即可
+ ref个人理解，适用于基础类型，因为其引用的时候需要从count.value中获取，**这里要注意在模板中会自动调用ref.value**
+ ref如果传入的是一个对象，会自动调用reactive进行深层次转换

#### 2. computed

> 和vue2中的watch类似，但是是一个hooks函数调用的形式
>
> + 直接传入一个函数为默认定义了一个get方法
> + 手动写入get和set方法定义了一个ref对象，set方法为该computed改变时调用的回调

##### 小例子

~~~vue
<template>
  <div>
    <div>computed -> {{ computeCount }}</div>
    <ul>
      <li>{{ count1 }}</li>
      <li>{{ count2 }}</li>
      <li>{{ reactiveCount.count }}</li>
    </ul>
      
    <div class="con">
      <button @click="addCount">+1</button>
      <button @click="decrCount">-1</button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watchEffect } from "vue";

export default {
  setup() {
    const count1 = ref(0);
    let count2 = ref(1);
    const reactiveCount = reactive({ count: count2 });
    let computeCount = computed({
      get: () => count2.value + 1,
      set: (val) => (count2.value = val - 1),
    });

    const addCount = () => {
      computeCount.value++;
    };

    const decrCount = () => {
      computeCount.value--;
    };

    return {
      count1,
      count2,
      computeCount,
      reactiveCount,
      addCount,
      decrCount,
    };
  },
};
</script>

<style></style>

~~~

##### 结果分析

> 当通过点击+1，-1 更改computeCount值的时候，count2的值会同时变化

#### 3. watchEffect

> 官方定义：立即执行传入的一个函数，并响应式追踪其依赖，并在其依赖变更时重新运行该函数。类似react中的useEffect

##### 小例子

+ watchEffect 副作用的添加(vue 3会**自动识别为副作用添加依赖项**，不像react需要手动添加)
+ 调用watchEffect返回值，可以**解除副作用**
+ watchEffect接受一个onInvalidate的函数，当该副作用被解除或者组件被卸载的时候会调用该函数

~~~vue
<template>
  <div>
    <div>computed -> {{ computeCount }}</div>
    <ul>
      <li>{{ count1 }}</li>
      <li>{{ count2 }}</li>
      <li>{{ reactiveCount.count }}</li>
    </ul>
    <div class="con">
      <button @click="addCount">+1</button>
      <button @click="decrCount">-1</button>
      <button @click="stopEffect">Stop</button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watchEffect } from "vue";

export default {
  setup() {
    let count1 = ref(0);
    let count2 = ref(1);
    let timer = null;
    const reactiveCount = reactive({ count: count2 });
    let computeCount = computed({
      get: () => count2.value + 1,
      set: (val) => (
        (count2.value = val - 1), console.log("computed改变为", val)
      ),
    });

    const addCount = () => {
      computeCount.value++;
    };

    const decrCount = () => {
      computeCount.value--;
    };

    const stop = watchEffect((onInvalidate) => {
      if (!timer) {
        timer = setInterval(() => {
          count1.value++;
        }, 1000);
      }

      onInvalidate(() => {
        clearInterval(timer);
      });
    });

    watchEffect(() => {
      console.log("computedCount = ", computeCount.value);
      console.log("count1 = ", count1.value);
      console.log("count2 = ", count2.value);
    });
      
    const stopEffect = () => stop();

    return {
      count1,
      count2,
      computeCount,
      reactiveCount,
      addCount,
      decrCount,
      stopEffect,
    };
  },
};
</script>

<style></style>

~~~

##### 结果分析与总结

> 结果：
>
> 	1. 当computeCount改变的时候，会打印computeCount, count1, count2的值，count1的每1s会增加
>  	2. computed的console前于watchEfffect
>  	3. 点击Stop按钮后，count1不再增加且点击+1和-1不会再有console

从上述可以得到几个结论：

+ computed的**set响应前于watchEffect**
+ watchEffect会**自动收集依赖**，且**异步执行**，且在同一个tick中多次执行一个watchEffect会被自动合并
+ 使用**onInvalidate**可以执行一个函数去**取消失效回调，或之前副作用中的失效的异步操作**

#### 4. watch

> 官方说明: `watch` API 完全等效于 2.x `this.$watch` （以及 `watch` 中相应的选项）。`watch` 需要侦听特定的数据源，并在回调函数中执行副作用。默认情况是懒执行的，也就是说仅在侦听的源变更时才执行回调。

##### 小例子

~~~vue
<template>
  <div>
    <div>computed -> {{ computeCount }}</div>
    <ul>
      <li>{{ count1 }}</li>
      <li>{{ count2 }}</li>
      <li>{{ reactiveCount.count }}</li>
    </ul>
    <slot></slot>
    <div class="con">
      <button @click="addCount">+1</button>
      <button @click="decrCount">-1</button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watchEffect, watch } from "vue";

export default {
  setup() {
    let count1 = ref(0);
    let count2 = ref(1);
    const reactiveCount = reactive({ count: count2 });
    let computeCount = computed({
      get: () => count2.value + 1,
      set: (val) => (
        (count2.value = val - 1), console.log("computed改变为", val)
      ),
    });

    const addCount = () => {
      computeCount.value++;
    };

    const decrCount = () => {
      computeCount.value--;
    };

    watch(
      () => count2.value,
      (newCount2, preCount2) => {
        console.log("单一数据监听: new: ", newCount2, "prev: ", preCount2);
      }
    );

    watch(
      [computeCount, count2],
      ([newComputeCount, newCount2], [prevComputed, prevCount2]) => {
        console.log(
          "多数据监听: computed = ",
          newComputeCount,
          "count2 = ",
          newCount2
        );
        console.log(
          "多数据监听: prev_computed = ",
          prevComputed,
          "prev_count2 = ",
          prevCount2
        );
      }
    );

    return {
      count1,
      count2,
      computeCount,
      reactiveCount,
      addCount,
      decrCount,
    };
  },
};
</script>
~~~

##### 结果分析与总结

> 点击 + 1按钮有如下console：
>
> + 单一数据监听: new:  2 prev:  1
>
> + 多数据监听: computed =  3 count2 =  2
>
> + 多数据监听: prev_computed =  2 prev_count2 =  1

**总结**

1. 如果watch监听**ref定义的变量需要监听到x.value**, 不然无法生效
2. 功能和watchEffect类似，值变化之后调用回调，但是**watchEffect是自动获取依赖，watch需要自己手动绑定依赖**

### 3. vue 3生命周期

| vue 2生命周期 | vue 3对应生命周期 | 备注 |
| ------------- | ----------------- | ---- |
| beforeCreate  | setup             |      |
|created|setup|现在初始化的工作可以通过setup完成，setup完成数据的初始化|
|beforeMount|onBeforeMount|根据初始化的数据挂载对应的页面元素|
|mounted|onMounted|元素挂载完成|
|beforeUpdate|onBeforeUpdate|页面元素更新之前的回调, 但其实没有现在通过这个回调获取变化之后和现在的state|
|updated|onUpdated|更新完毕后的回调函数，如果针对单一变量的话，我理解可以直接用watchEffect来实现对于单一元素的变化回调|
|beforeDestory|onBeforeUnmount|组件卸载之前的回调|
|destory|onUnmounted|组件卸载之后的回调|

#### 1. 执行顺序探究

##### 小例子

~~~vue
// lifeCircle.vue
<template>
  <div>
    <h1>LifeCircle</h1>
    <div>count: {{ count }}</div>
    <button @click="addCount">+1</button>
  </div>
</template>

<script>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  ref,
} from "vue";

export default {
  setup() {
    console.log("setup");
    const count = ref(0);

    const addCount = () => {
      count.value++;
    };

    onBeforeMount(() => {
      console.log("onBeforeMount");
    });

    onMounted(() => {
      console.log("onMounted");
    });

    onBeforeUpdate(() => {
      console.log("onBeforeUpdate");
    });

    onUpdated(() => {
      console.log("updated");
    });

    onBeforeUnmount(() => {
      console.log("onBeforeMount");
    });

    onUnmounted(() => {
      console.log("onUnmounted");
    });

    return {
      count,
      addCount,
    };
  },
};
</script>

<style>
</style>
~~~

~~~vue
// Index.vue
<template>
  <div id="app">
    <button @click="showLifeCircle">show life circle</button>
    <life-circle v-if="isShowLife" />
  </div>
</template>

<script>
import LifeCircle from "./components/LifeCircle.vue";

export default {
  name: "App",
  components: {
    LifeCircle,
  },
  data() {
    return {
      isShowLife: false,
    };
  },
  methods: {
    showLifeCircle() {
      this.isShowLife = !this.isShowLife;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

~~~

##### 结果分析和总结

1. **没有数据更新**场景的执行过程

> + 点击show life circle按钮出现lifeCircle组件，console提示
>   + setup
>   + onBeforeMount
>   + onMounted
>
> + 点击 + 1按钮
>   + onBeforeUpdate
>   + updated
> + 再次点击show life circle按钮lifeCircle消失，console提示
>   + onBeforeMount
>   + onUnmounted

结论1：

+ 当对于没有在声明周期中更新页面data的过程，在**创建组件**过程中执行**setup，onBeforeMount, onMounted**
+ 在数据更新时候更新顺序为**onBeforeUpdate，updated **
+ 当组件卸时的更新顺序： **onBeforeMount,  onUnmounted**

2. 如果**存在数据更新**的时候的执行过程

~~~vue
// 在setup中添加下面的代码，来模拟onMounted时候异步载入数据时候的情况

watchEffect(() => {
	console.log(count.value);
});

onMounted(() => {
    // mounted中加载数据
    console.log("onMounted");
    count.value++;
});
~~~



> + 上述当点击show life circle加载LifeCycle组件的时候，页面的更新为
>   + setup
>   + 0
>   + onBeforeMount
>   + onMounted
>   + onBeforeUpdate
>   + 1
>   + updated

从结果可以看到：

+ 数据在setup更新后，直接通过watchEffect钩子函数执行(此时不执行update钩子)
+ 在mounted更新后，会进入update的过程
+ watchEffect在更新过程中的执行顺序: onBeforeUpdate -> watchEffect -> updated

### 4. 依赖注入

> provide, inject 类似于React中的Context，我们可以通过Context上下文将一个共同需要用到的状态或者方法直接在深层的子组件中拿到，而不需要通过一直将方法嵌套的模式来完成

#### 调用方法

> 1. 在setup中调用，在需要提供全局变量父组件中，直接使用provide提供一个对应的全局变量(可以是响应式的参数)
> 2. 在深层需要使用该变量的时候，通过inject拿到对应的变量
> 3. 这个变量如果是响应式的，当其变化的时候可以自动更新视图

#### 小例子

+ 在这里我们构造三个嵌套组件最外层Parent、一级子组件Son, 二级嵌套子组件GrandSon

~~~vue
/*Parent.vue*/
<template>
  <div>
    <h2>Parent</h2>
    <Son />
  </div>
</template>

<script>
import { provide, reactive } from "vue";
import Son from "./Son";

export default {
  setup() {
    const userInfo = reactive({
      name: "",
      age: 0,
      right: 0,
    });

    provide("commonInfo", userInfo);

    return {
      userInfo,
    };
  },
  components: {
    Son,
  },
};
</script>

<style>
</style>
~~~

~~~vue
/*Son.vue*/
<template>
  <div>
    <h3>Son</h3>
    <ul>
      <li>名字：{{ common.name }}</li>
      <li>年龄：{{ common.age }}</li>
      <li>权利等级: {{ common.right }}</li>
    </ul>
    <GrandSon />
  </div>
</template>

<script>
import GrandSon from "./GrandSon";
import { inject } from "vue";

export default {
  setup() {
    const common = inject("commonInfo", {});
    console.log(common);

    return {
      common,
    };
  },
  components: {
    GrandSon,
  },
};
</script>

<style>
</style>
~~~

~~~vue
/*GrandSon*/
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
~~~

#### 结果

![](D:\Learn\Essays\vue\vue-next-test\public\provide.gif)

#### 分析

+ 通过provide(key, value)在上层绑定一个全局变量，然后在需要使用的地方通过inject(key)得到对应的绑定结果
+ provide中可以通过传入响应式参数，当深层次组件更新该元素后使上层相关视图也一起变化

###  5. 模板Refs

