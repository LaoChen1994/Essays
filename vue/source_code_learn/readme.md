# Vue源码学习笔记

## 0. 学习环境搭建

### 1. 参考内容

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

### 2. 一个vue页面是如何被展示出来的

我们在进入页面渲染的createApp打上断点

![image-20201019231319118](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20201019231319118.png)

查询调用函数栈我们发现不简单，大致经过了这么几个函数：

#### 2.1  创建render

#####  2.1.1 利用baseCreateRender创建render

创建路径createApp -> 创建Render -> ensureRender -> 调用baseCreateRender(根据option创建render)

创建过程中用到的函数如下表，可以先不看，后面有需要的时候再来查

| 创建函数名               | 作用                          | 关键点 |
| :----------------------- | ----------------------------- | ------ |
| moveStaticNode           |                               |        |
| patch                    |                               |        |
| processText              |                               |        |
| processCommentNode       |                               |        |
| patchStaticNode          |                               |        |
| mountStaticNode          |                               |        |
| patchStaticNode          |                               |        |
| removeStaticNode         |                               |        |
| processElement           |                               |        |
| mountElement             |                               |        |
| setScopeId               |                               |        |
| mountChildren            |                               |        |
| patchElement             |                               |        |
| patchBlockChildren       |                               |        |
| patchProps               |                               |        |
| processFragment          |                               |        |
| processComponent         |                               |        |
| mountComponent           |                               |        |
| updateComponent          |                               |        |
| setupRenderEffect        |                               |        |
| updateComponentPreRender |                               |        |
| patchChildren            |                               |        |
| patchUnkeyedChildren     |                               |        |
| patchKeyedChildren       |                               |        |
| move                     |                               |        |
| UnmountFn                |                               |        |
| RemoveFn                 |                               |        |
| removeFragment           |                               |        |
| unmountComponent         |                               |        |
| unmountChildren          |                               |        |
| getNextHostNode          |                               |        |
| traverseStaticChildren   |                               |        |
| render                   | 将指定的vnode节点渲染到容器中 |        |

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

4. 

   

   








