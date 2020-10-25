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

  









