# Vue源码学习笔记

## 0. 学习环境搭建

[如何搭建调试vue3源码](https://juejin.im/post/6844903959153344525)中叙述的主要步骤

1. clone vue 3源码

   ```bash
   git clone https://github.com/vuejs/vue-next.git
   ```

2. 安装依赖

   ```bash
   yarn install
   ```

3. 配置sourcemap

   ```javascript
   // rollup.config.js
   output.sourcemap = true
   
   // tsConfig.json
   // 配置在compilerOptions下
   {
       //...
       "compilerOptions": {
           // ....
           "sourceMap": true
       }
   }
   ```

4. 启动调试命令

   ```bash
   yarn dev
   ```

5. 写个测试demo通过chrome打开，并打断点

   ```html
     <script src="../../dist/vue.global.js"></script>
     <div id="test">
       <p>{{name}}</p>
     </div>
   
   
   
     <script>
       const App = {
         data(){
           return{
             name:"vue"
           }
         },
       }
       let vm = Vue.createApp(App).mount("#test");
     </script>
   
   ```

## 1. Vue结构

### 1.1 Vue 3源码结构

数据监听的设计模式，观察者模式，vue 3通过proxy代替了原来的Object.defineProperty来实现数据监听，并且加入了新的Composition API，来实现代码的抽离。

Vue 3重构之后，源码大致可以分为以下几个部分：

![image-20201114161127343](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201114161127343.png)

+ compile -> 将template -> js -> vdom
+ reactivity -> 实现响应式，实现数据监听
+ runtime -> 为vdom提供运行时需要的函数进行执行

### 1.2 Vue 3 vs Vue 2

Vue 3相较于Vue 2做了以下几个改进：

compile：

+ 用Proxy代替defineProperty
  + Object.defineProperty需要遍历或者递归来绑定对象的所有属性，影响首屏渲染
  + Object.defineProperty无法监听新增和属性和数组操作
+ vdom重写
  + 静态标记
  + 标记静态节点
    + 如果是静态节点就不打标，如果是动态节点就会会动态属性的类型打标例如class, props, text等
    + 这里是通过位运算进行打标的||组合， &&校验
  + diff算法的更新(未看)
    + vue2: 双端比较
    + vue3: 最长递增子序列

runtime：

+ 引入hooks

## 2 Vue 的简单响应实现

### 2.1 vue 3 composition API的使用

简单的一个数据监听的实现，看一看目前的vue 3 + composition API是怎么用的？

```javascript
const state = ref(1)

effect(() => {
    console.log('effect = ', state.value)
})

effect(() => {
    console.log('effect2 = ', state.value)
})
```

需要实现有以下几个点：

+ 在state.value更新的时候需要去执行对应的回调
+  使用effect函数的时候需要注册回调
+ 依赖的自动收集

如何实现？

+ 发布订阅模式

![image-20201114164759644](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201114164759644.png)

![image-20201114211301423](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201114211301423.png)

#### 2.1.1 如何自动收集副作用

```javascript
const param = ref(2)
effect(fn)
// 为了方便说明，我们将响应式参数param简称ref
// effect 称为副作用
// 称为变量
```

vue 3主要思路：

1. proxy或者defineProperty监听get方法时，去执行track收集引用ref的依赖
2. 在track中将回调注册到，store中的回调列表中
3. 每次effect新建的时候执行fn，**因为fn如果引用到ref一定会触发ref的get方法**，在这里就会注册上对应的副作用

### 2.2 简单实现ref的例子

#### 2.2.1 ref基础实现

```javascript
// 创建一个effect方法
function effect (fn) {
    effect.activeEffect = fn;
    fn()
}

effect.activeEffect = null

// event center
export class Desp {
    constructor() {
        this.subs = new Set()
    }

    depend() {
        if(effect.activeEffect) {
            this.subs.add(effect.activeEffect)
        }
    }

    notify() {
        this.subs.forEach(effect => effect())
    }
}


function ref(initVal) {
    let _value = initVal;
    let desp = new Desp()

    return {
        get value() {
            // 依赖收集
            desp.depend()
            return _value
        },
        set value(value) {
            // 修改的时候通知desp执行回调
            _value = value
            desp.notify()
        }
    }
}
```
#### 2.2.2 proxy版本
```javascript
const getCommonHandler = (desp) =>  ({
    get(target, property) {
        desp.depend()
        return target[property]
    }, 
    set() {
        Reflect.set(...arguments)
        desp.notify()
        return true
    }
})

function createProxyRef(initVal) {
    let _value = initVal
    let desp = new Desp()

    let proxy = new Proxy({ value: _value }, getCommonHandler(desp))

    return proxy
}
```

### 2.3 康康源码长啥样

![image-20201114171506685](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201114171506685.png)

![image-20201114171654268](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201114171654268.png)

### 2.4 拆分源码结构

+ track: 用于收集依赖

+ trigger: 用于调用副作用

+ targetMap: 一个用于收集reactive响应式参数的大数组，**将reactive收集的对象与其对象中参数对应的响应式effect形成1对多的映射关系**，其结构大致如下

   ```javascript
  targetMap = {
      {a, b}: {
          a: [effect1, effect2],
          b: [effect3]
      }
  }
  ```

+ effectStack: 用于缓存多个effect，在一次flush中


## 3. Compile

### 3.1 简介

vue compile做了什么？

1. 利用各种类型的parser创建ast (html -> ast)
2. 通过vFor，vIf等各种基于vue语法编写的transform改写ast节点 (ast -> vue_ast)
3. 利用generate将生成的代码挂在context上，然后生成运行时的js代码 (vue_ast -> js (vdom))

### 3.2 调试过程

我们在进入页面渲染的createApp打上断点

查询调用函数栈我们发现不简单，大致经过了这么几个函数：

#### 2.1  创建render

#####  2.1.1 利用baseCreateRender创建render

创建路径createApp -> 创建Render -> ensureRender -> 调用baseCreateRender(根据option创建render)

创建过程中用到的函数如下表，可以先不看，后面有需要的时候再来查

| 创建函数名               | 作用                          | 关键点     |
| :----------------------- | ----------------------------- | ---------- |
| moveStaticNode           |                               |            |
| patch                    | 渲染更新节点                  | 详见第四章 |
| processText              | 处理文本节点                  | 详见第四章 |
| processCommentNode       |                               |            |
| patchStaticNode          | 渲染静态节点                  | 详见第四章 |
| mountStaticNode          | 挂载静态节点                  | 详见第四章 |
| removeStaticNode         |                               |            |
| processElement           | 处理原生的element             |            |
| mountElement             | 挂载原生的element             |            |
| setScopeId               | 模块之间独立                  |            |
| mountChildren            | 挂载子节点                    |            |
| patchElement             | 渲染原生的element             |            |
| patchBlockChildren       |                               |            |
| patchProps               |                               |            |
| processFragment          |                               |            |
| processComponent         |                               |            |
| mountComponent           |                               |            |
| updateComponent          |                               |            |
| setupRenderEffect        |                               |            |
| updateComponentPreRender |                               |            |
| patchChildren            |                               |            |
| patchUnkeyedChildren     |                               |            |
| patchKeyedChildren       |                               |            |
| move                     |                               |            |
| UnmountFn                |                               |            |
| RemoveFn                 |                               |            |
| removeFragment           |                               |            |
| unmountComponent         |                               |            |
| unmountChildren          |                               |            |
| getNextHostNode          |                               |            |
| traverseStaticChildren   |                               |            |
| render                   | 将指定的vnode节点渲染到容器中 |            |

最终返回值：

![image-20201020223945554](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201020223945554.png)

#### 2.2 通过render创建的createApp创建App

**createApp接受两个参数：**

1. render

   ![image-20201020224145999](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201020224145999.png)

   + render函数接受的参数

     + vnode：vue 2 的那种虚拟dom节点的虚拟节点

     + container：需要渲染到的对应容器

       >  从render函数中可以看到：**如果vnode存在则会调用patch方法进行渲染，如果不存在会将对应容器中的节点进行卸载操作**

     + 其他函数的分析在下面的章节里面介绍

2. hydrate

   ![image-20201021221822564](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201021221822564.png)

   从渲染过程来看初始值为undefined，估计目前没用，看到作者的注释，应该是一个DOM特例，后面看看有啥用

**createAppApi的输出：**

1. app对象：

   在这个对象中有我们熟悉的，use，mount，unmount，mixin等方法，我们之前通过use方法来使用类似vuex的插件，通过mixin来混入通用的元素，使用mount来向父节点挂载对应的vnode，这个App的对象我们通过createAppApi来创建，下面是部分函数的截图：

   + mount: 

     ![image-20201021222845407](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201021222845407.png)

     mount主要做了这么几个事：

     1. 生成vnode
     2. 传入context
     3. **如果有是混合模式渲染，就通过hydrate进行渲染，否则通过render进行渲染**，<font color="red">主要做的就是通过render方法将vnode挂载到对应的父容器上</font>
     4. 设置节点的父容器
     5. 返回节点组件的proxy（组件实例）

   + use

     ![image-20201021224432533](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201021224432533.png)

     use主要做的事情：

     1. 通过一个Set，installedPlugins来判断是否插件已经注册，如果已经注册就提示一波
     2. 调用plugin的install或者plugin本身是个函数的话，通过传入app来完成注册
     3. 在plugin中能获得对应app的对象的所有信息

##### 2.2.1 获取创建app的mount函数并重写

![image-20201021225452752](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201021225452752.png)

重写的主要原因：

1. 判断是否父容器存在(在app中的mount其实未判断父容器是否有效)
2. 
3. 初始化原来组件内使用的component(createApp时写到_component中)和现有有效父容器的innerHTML
4. 设置一些属性，返回挂载后的组件实例

##### 2.2.2 返回生成的app组件

如题

#### 2.3 调用修改过的App.mount挂载对应app到container

我们之后调用App.mount(container)使用修改的mount方法将对应的节点挂载到对应的父节点中，这里需要注意的是，此时我们的component信息已经在都在调用mount的app实例当中了，因为刚才我们App.createApp其实是创建了一个App的实例。

##### 2.3.1 节点渲染过程

**关键**：

+ 从2.2下面的图可以看到，我们修改的mount其实调用的是mount

+ mount中主要是通过render进行渲染，来看下render函数

  ![image-20201022004701624](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201022004701624.png)

+ render函数中如果vnode存在会调用patch方法，我们来看patch方法

  ![image-20201022005159630](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201022005159630.png)

  patch有如下几个入参：

  + n1: 代表父组件的_vnode属性，如果这个属性没有就认为是mount时候调用的
  + n1: 代表需要挂在上去的目标vnode
  
  + container: 代表挂在父容器的element
+ 后面的参数在mount的时候不会用到
  
##### 2.3.2 patch方法解析

![image-20201024141036339](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201024141036339.png)

1. 主要的解析过程：
  
   通过vnode的type和之前的shapeFlags来对不同类型的组件调用不同的方法进行渲染，我们先来看对普通组件的处理processComponent
  
2. processComponent的处理
  
   主要是调用了mountComponent -> setupComponent -> setupStatefulComponent



**VNode的主要类型**：

  ~~~typescript
  export const enum ShapeFlags {
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 1 << 1,
    STATEFUL_COMPONENT = 1 << 2,
    TEXT_CHILDREN = 1 << 3,
    ARRAY_CHILDREN = 1 << 4,
    SLOTS_CHILDREN = 1 << 5,
    TELEPORT = 1 << 6,
    SUSPENSE = 1 << 7,
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEPT_ALIVE = 1 << 9,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
  }
  ~~~

  **NodeType主要类型：**

```typescript
enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  ATTRIBUTE,
  DIRECTIVE,
  // containers
  COMPOUND_EXPRESSION,
  IF,
  IF_BRANCH,
  FOR,
  TEXT_CALL,
  // codegen
  VNODE_CALL,
  JS_CALL_EXPRESSION,
  JS_OBJECT_EXPRESSION,
  JS_PROPERTY,
  JS_ARRAY_EXPRESSION,
  JS_FUNCTION_EXPRESSION,
  JS_CONDITIONAL_EXPRESSION,
  JS_CACHE_EXPRESSION,

  // ssr codegen
  JS_BLOCK_STATEMENT,
  JS_TEMPLATE_LITERAL,
  JS_IF_STATEMENT,
  JS_ASSIGNMENT_EXPRESSION,
  JS_SEQUENCE_EXPRESSION,
  JS_RETURN_STATEMENT
}
```









#### 2.x 生成JS代码

##### 2.x.1 生成context

Q1: context有何用？

context主要包含vue在生成代码过程中一些中间方法以及一个递归过程中顶层变量存储的功能

Q2: 中有哪些东西

主要分为共用方法 + 共用属性，其具体功能如下表：

| 类别     | 方法名            | 作用                                                         |
| -------- | ----------------- | ------------------------------------------------------------ |
| 共用方法 | push(code, node)  | 将对应的code，添加到context的code中，全局代码的生成          |
| 共用方法 | indent()          | 换行并将context中的indentLevel + 1， 用于控制缩进            |
| 共用方法 | deindent()        | indentLevel - 1用于控制缩进，可以选择是否换行                |
| 共用方法 | newline(indent)   | 按照上一行的缩进大小进行换行                                 |
| 共用属性 | helper()          | 返回helpNameMap -> 这个helpNameMap里面存储的是runtim-core中，就是生成js后，调用的Vue中运行时的一些关键函数的函数名 |
| 共用属性 | mode              | 函数和模块的话会不一样，如果是模块会带上一个scopeId在生成模板的时候 |
| 共用属性 | indentLevel       | 缩进的格数                                                   |
| 共用属性 | runtimeModuleName | 如果是module那种，一般我们通过import {} from 'vue'，所以默认值为vue |
| 共用属性 | runtimeGlobalName | 如果通过script标签引入的那种，会在全局创建Vue对象，挂载到window.Vue上，所以这里就用的是Vue |
| 共用属性 | prefixIdentifiers |                                                              |

##### 2.x.2 引入需要引用的函数和变量

这部分主要从Vue或者vue中引入需要引入最后生成实际DOM元素的东西，根据是否为模块，分别调用genFunctionPreamble或者genModulePremeble来生成对应的代码：

我们来看下genFunctionPreamble:

1. 根据是否为浏览器环境，生成不同的引入函数的代码端

   ![image-20201031220348593](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201031220348593.png)

   || 服务端渲染 | 浏览器渲染 |
   |---| ---------- | ---------- |
   |genFunctionPreamble做的事| 直接将之前在ast解析时候的helper引入到生成代码中 | 从ast中先引入在静态hepler中存在的函数 |
   |其他| 引入@vue/server-renderer | |

   ![image-20201031220517306](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201031220517306.png)

**Q： genFunctionPreamble方法做了啥**

   主要通过genHoists方法，其传入参数为**ast解析后的node列表**，以及**生成函数中的全局上下文context**, 在genHoists中其实通过genNode来具体生成元素对应的代码，genNode调用参数主要为**一个vnode节点**和对应的上下文**context**。

   ![image-20201031221600900](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201031221600900.png)

   1. genNode函数解析

      genNode根据不同的nodeType来调用不同的方法来完成对于ast处理后的vnode进行解析，我们通过一个JS_OBJECT_EXPRESSION的常规vnode 的解析来看一看他是如何生成各类的vue js的代码的：

      ![image-20201031222111684](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201031222111684.png)

   2. genObjExpression

      Q1：这个函数的作用是什么

      A1:  主要用来生成对象的javascript代码

      Q2: 这个函数的流程

      A2： 如下

      ​	(1) 判断是否多行 -> 是否有多个参数

      ​	(2) 生成tag上的标签的key，value，并插入其中的**:**

      ​	  	![image-20201031223921003](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201031223921003.png)

        	(3) 如果多个属性的话需要加上，并换行

##### 2.x.3 生成render函数

1. 主要根据以下几点，来生成不同的render的函数的定义，并换行

+ 是否独立作用域
+ 是否ssr

![image-20201031230244672](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201031230244672.png)

2. 使用with块级作用域来解决参数中带有this.xxx的问题

   ![image-20201031230600235](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201031230600235.png)

​      ![image-20201031230649350](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201031230649350.png)

之后，在ctx中引入需要在生成的代码中引入的helper，Vue runtime过程中生成真实DOM的方法

##### 2.x.4 生成对应的DOM节点

1. 调用genVNodeCall，其中用到的几个关键的参数来控制函数的嵌套，所有我们写的类似Fragment等其实都对应了相映的Vue中的一个函数进行处理

![image-20201101013430452](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201101013430452.png)

+ directives
+ isBlock
+ diableTracking

2. 通过genNodeList将具体的tag, props children等进行JS代码的生成，逻辑大概可以概括为

   1. 如果是string -> 直接push进去就行，比如tagName, 用来直接作为createBlock的参数就行
   2. 如果是数组，比如子元素的处理，这个时候直接调用genNodeAsArray
   3. 否则的话，比如不存在的元素，在调用genNodeList会处理成null，或者是个对象，比如props是可变的场景直接调用genNode, 通过nodeType进行渲染，操作
   4. 加入一个参数就加一个逗号

3. genNodeListAsArray:  这个函数主要是用来生成多个props或者children用的，其原理就是通过genNodeList然后如果是children就直接调用后通过genNode来进行处理即可，按照上面的原理找props然后根据对应元素的nodeType, 递归生成即可，这里要注意的是，作为同一个变量的nodeList在同一层的话要用括号


##### 2.x.5 生成代码的样子

[Vue 3 template explorer](https://vue-next-template-explorer.netlify.app/)

```html
<div>{{ a }}</div>
```

```javascript
import { toDisplayString as _toDisplayString, createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue"

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createBlock("div", null, _toDisplayString(_ctx.a), 1 /* TEXT */))
}
```

这里有两个关键的函数：

+ openBlock

  ![image-20201124010327939](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201124010327939.png)

  **关键**：为一个节点树提供一个block的容器，根据官方所说可知，需在createBlock之前被调用，这里更新了当前的block -> currentBlock

+ createBlock

  ![image-20201124010659428](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201124010659428.png)

  **步骤**：

  + 创建对应的vnode -> 如果有子节点递归调用createVNode

  + 将当前的vnode保存在block中,并关闭当前的block

    ![image-20201124011410007](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201124011410007.png)

    **close的时候blockStack会出栈，所以下一次的currentBlock为当前节点的父节点**

  + 

### 4.  vdom 

####  4.1 为何要更新diff算法

1. 因为双端对比可能导致一次diff时间超过单帧的刷新时间，所以需要优化(**类似react fiber要解决的问题**)
2. JSX和手写的render function h('div', null, children)是完全动态的，过度的灵活性导致可利用的优化信息不足

#### 4.2 Vue 3怎么做？

1. 如果静态节点不diff
2. 动态节点引入block tree
   + 每个区块内部基于动态节点指令(v-for v-if)切割嵌套区块
   + 每个区块内部结构固定(方便递归)
   + 每个区块内部的动态元素进行存储记录(一个Array)
3. 通过时间片进行更新，flushupdate

#### 4.3 Vue 3中如何更新节点信息

##### 4.3.1 更新dom展示

当页面mount的时候，会默认为该组件实例挂一个setupRender的钩子，通过这个钩子，可以完成从vnode -> 实dom的转变。

![image-20201122180333195](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201122180333195.png)

##### 4.3.2 setupRenderEffect解析

setupRenderEffect主要做了哪些事：

+ 初次mount
  + 调用响应的生命周期钩子函数(beforeMount, onVnodeBeforeMount, mount, onVnodeMount)
  + 判断是否为hydrateNode（未看）
  + 给组件打上标记
  + 调用patch方法开始挂载组件，mount状态patch的第一个参数为空
  + 根据keepAlive将父组件处于Suspense状态(未看)
  + 设置isMounted标志位为true
  
+ 后续update

  + 组件本身动态参数变化(next为空)
    + 将next设为当前的节点vnode，执行后续步骤
  + 父组件更新调用processComponent触发的(next不为空)
    + 加载之前一次render的vnode，利用updateComponentPreRender -> flushPreFlushCbs。
  + 调用beforeUpdate钩子
  + 给组件打上标记
  + 解析新节点的vnode(renderComponentRoot) -> 这里会调用之前mount挂载在vnode实例上的render函数进行渲染
  + render函数: 通过template -> vnode的转换过程



##### 4.3.3 render函数生成node

一个简单的render函数如下：

![image-20201125011526916](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201125011526916.png)

主要内容包括：

+ openBlock
+ createBlock
+ createVNode（后面讨论）

#### 4.5 VNode创建过程

#### 4.5.1 createVNode

![image-20201122230926602](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201122230926602.png)

主要是调用了createVNodeWithArgsTransform和_createVNode这两个方法

![image-20201122231412402](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201122231412402.png)

其主要作用是：

+ **将template -> vnode**

+ 生成clone节点，目前发生的场景为，如果这种情况下，_createVNode传入的type为一个vnode，其他情况不会传入一个vnode

  ```vue
  <component :is="vnode" />
  ```

其主要生成的过程为：

+ 规整type的类型 -> 区分函数组件还是类组件

+ 规整class

+ 规整style

+ 根据type的类型来对vnode进行打标

  ```typescript
  export const enum ShapeFlags {
    ELEMENT = 1,
    FUNCTIONAL_COMPONENT = 1 << 1,
    STATEFUL_COMPONENT = 1 << 2,
    TEXT_CHILDREN = 1 << 3,
    ARRAY_CHILDREN = 1 << 4,
    SLOTS_CHILDREN = 1 << 5,
    TELEPORT = 1 << 6,
    SUSPENSE = 1 << 7,
    COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
    COMPONENT_KEPT_ALIVE = 1 << 9,
    COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
  }
  ```
  
+ 生成新的vnode节点 -> 其本质上是一个对象 (调用renderComponentRoot)

  ![image-20201122232919736](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201122232919736.png)

+ vnode对于子节点的规整 (主要通过传入的vnode的shapeFlag和children类型进行判断)

  其目的是为了规整统一其children的类型和shapeFlag(节点)的类型：

  + 数组子节点：一个元素下面有多个子节点的情况，（典型Fragment，这个时候由于多个子节点已经被解析为vnode因此不用单独处理了）

    ![image-20201125011322684](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201125011322684.png)

  + 对象子节点(子节点仍是一个vnode的场景，多层嵌套)
    + 当前节点为element节点 或TELEPORT(传送门)
    + 当前节点为slot节点
    
  + 文本子节点
    + 当前节点类型为传送门
      + ![image-20201125005947796](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201125005947796.png)
    + 其他类型认为是文本子节点

+ 对于Suspense节点的规整(未整理)

  

  










#### 4.4 类似fiber时间片的思想 ---- > flushJobs

##### 4.4.x flushJobs是什么

1. 浏览器空闲的时间对vdom进行更新对比

2. 调用方法大约如下，以组件未更新加载前一次的vdom为例：

   ![image-20201122205937696](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201122205937696.png)

   ![image-20201122210003455](C:\Users\msi\AppData\Roaming\Typora\typora-user-images\image-20201122210003455.png)

3. 

##### 4.4.X 队列排序的作用

+ 组件的更新从父元素到子元素(因为父元素总是在子元素之前创建，所以render effect的优先级更小)
+ 如果一个组件在父组件更新时被卸载了，这个时候它应该被忽略