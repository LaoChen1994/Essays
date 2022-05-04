# React 进阶学习

##  前言

参考书籍：

1. [React进阶之路](https://weread.qq.com/web/reader/81b326407198d71881ba331k6c8328f022d6c8349cc72d5)
2. [React工程师修炼指南](https://weread.qq.com/web/reader/f0232240723982d3f02c0fd)

对自己不熟悉或者觉得有必要记录的内容做了记录：参考1中的五六两章 + 参考2中的第六章

## 1.  虚拟DOM和性能优化

React性能高的三个原因：

1. 虚拟DOM
2. 高性能的DIFF算法
3. 其他的优化办法

### 1.1 虚拟DOM

1. 真实DOM：html中真实的dom节点
2. 虚拟DOM：通过普通的javascript对象来描述DOM元素
3. 虚拟DOM中的字段：type, props, children......
4. 为什么性能要好，要减少DOM的操作：因为DOM的操作要比传统的javascript语句更费性能
5. 怎么减少对真实DOM的操作，将对真实DOM的操作转换为操作虚拟DOM


  > 所有问题都可以通过增加一层抽象得以解决

### 1.2 Diff算法

什么是diff算法：通过将==新老的虚拟DOM==进行对比，仅将虚拟DOM==修改部分到更新到对应的真实DOM==上，避免大量DOM节点的更新

调和（Reconciliation）：树比较后更新部分DOM节点的整个过程

**React Diff过程中的假设：**

1. 类型不同，将生成两颗不同的树
2. 列表中设置了key属性，通过key属性来表述对应的元素在更新过程中是否发生变化

**具体比较过程：**

1. 根结点类型发生变化：React认为是两颗不同的树，下面的所有DOM节点都会发生变化（很消耗性能，因为做了大量的DOM操作）
2. 根结点是相同的DOM元素：保留根结点，进而比较对应的属性，然后只更新那些变化了的属性
3. 当根结点是相同类型的组件：不销毁组件，执行组件的更新操作，在执行完render方法之后，根据返回的虚拟dom，决定如何更新dom树
4. 对于子节点就执行上述三步进行递归的方式进行比较
5. 列表的比较：1. 有key先比较key相同的节点。2. 没有key就对应位置同等比较



### 1.3 性能优化

React中常用的性能优化方式：

1. 使用生产环境版本的库(如果自己搭的环境，尽量将DefinePlugin中的process.NODE_ENV设置成production)
2. componentWillReceiveProps中监听如果是组件的props没变化，组件可以不用重新rerender，减少不必要的render，在shouldComponentUpdate中进行自定义的比较，**使用PureComponent组件会自动进行浅比较**
3. 使用key：使用key可以在列表渲染的时候明确对比的新老元素之间的关系，减少DOM的操作的比率



### 1.4 性能检测工具

1. React Develop Tools For Chrome：分析是否是生产
2. Chrome Performance Tab：分析指定操作过程中的开销
3. Why-did-you-update： 分析props和state的更新情况，优化代码中没有必要的渲染过程



## 2. 高阶组件

### 2.1 基本概念

高阶组件是从高阶函数演变而来：

|      | 高阶函数 | 高阶组件           |
| ---- | -------- | ------------------ |
| 本质 | 函数     | 函数               |
| 输入 | 函数     | 组件（类或者函数） |
| 输出 | 新的函数 | 新的组件           |

**总结**：高阶组件主要用来封装一些组件的通用逻辑，便于复用。本质上是一个装饰者设计模式



### 2.2 使用场景

1. 操纵props：拦截props对props进行增删改查各种包装
2. 通过ref访问组件实例：在高阶组件中通过ref的方式得到被包装的组件实例，便于后续操作
3. 组件状态提升：将组件的状态提升到高阶组件中管理，类似状态的托管，让被包装组件直接成为一个受控组件
4. 用其他元素包装组件：在外面再包一层，用于修改样式啥的



### 2.3 参数传递

高阶组件可以修改传到目标组件中参数具体的值，一般高阶组件返回的是一个函数，将对应的React组件进行包装，实现参数的劫持，例如redux中的connect，将props和dispatch绑定到对应的目标组件上

```javascript
HOC(...params)(WrapComponent)

connect(mapStateToProps, mapDispatchToProps)(WrapComponent)
```

**使用compose + 高阶函数可以显著提高代码的可读性和逻辑**

```javascript
function compose(...func) {
  if (func.length === 0) {
    return t => t
  }
  
  if (func.length === 1) {
    return func[0]
  }
  // 如果reduce没有给默认值的话，默认值为第一个值
  return func.reduce((a, b) => (...args) => a(b(args)))
}

// compose(a, b, c) => a()
```

这种通过高阶组件处理通用逻辑，然后通过参数传给下面的组件的方式，称为**属性代理**

### 2.4 继承方式实现高阶组件

这种方式需要强行去调用super.render也不是不可以，但是还是属性代理的方式更为通用

```javascript
function WithAuth (WrapComponent) {
  
  return class extends WrapComponent {
    render () {
      if (this.props.login) {
        return super.render()
      } else {
        return null
      }
    }
  }
}
```



### 2.5 注意事项

1. 高阶组件中为了查问题方便可以将高阶组件包的组件名称放到类组件的displayName中，获取组件的名称方法如下

   ```javascript
   function getComponentName (Component) {
     // 这个name是在组件的static静态属性人为指定的
     return Component.displayName, || Component.name || 'Component'
   }
   
   ```

2. 不要在render或者其他生命周期中使用高阶组件

3. 如果被包的组件有静态方法需要暴露，需要在高阶组件中进行复制，不然无法暴露出去

4. ref的传递需要通过props额外做一层传递

5. 高阶组件关注的是逻辑的抽象，重点关注其是一个函数，==不要错误的和父组件做等号==

## 3. React源码解析

### 3.1 React源码中常用的标记和数据类型

#### 3.1.1 Work Tag

这些标志通常打在fiber的tag上，用来标记react不同的元素类型

![image-20210903003554869](/Users/pidan/Library/Application Support/typora-user-images/image-20210903003554869.png)

#### 3.1.2 SideEffectTag

主要是用于表示更新的标志，NoEffect指的是没有更新，Placement代表的是插入状态

![企业微信截图_1b91a74e-9075-4e2f-add6-fbd220eac6d4](/Users/pidan/Library/Containers/com.tencent.WeWorkMac/Data/Library/Application Support/WXWork/Temp/ScreenCapture/企业微信截图_1b91a74e-9075-4e2f-add6-fbd220eac6d4.png)

**注意点：**

1. 为什么标志位都是二进制的形式，便于多个标志位进行叠加
2. 位运算速度极快

**举例**

workInProgress.effectTag & Update和workInProgress.effectTag & Ref -> 132，代表要同时执行update effect 和ref effect两件事



#### 3.1.3  ExecutionContext

用于标记React的执行栈。

![image-20210903004402765](/Users/pidan/Library/Application Support/typora-user-images/image-20210903004402765.png)



#### 3.1.4 PriorityLevel

用于代表事件的优先级，fiber中会将优先级高的事件先进行执行

![image-20210903004549812](/Users/pidan/Library/Application Support/typora-user-images/image-20210903004549812.png)

**注意**：数字越大，优先级越低



#### 3.1.5 RootExitStatus

根结点退出时的状态值，未完成RootIncomplete，已完成RootCompleted

![image-20210903095515626](/Users/pidan/Library/Application Support/typora-user-images/image-20210903095515626.png)



#### 3.1.6 currentEventTime

用于事件调度的时候，确定事件的开始时间，同一个事件上update接收相同的过期时间。

过期时间决定了update是如何批量执行的，期待相似优先级的且发生在同一个事件上的update接收相同的过期时间

![image-20210903095904144](/Users/pidan/Library/Application Support/typora-user-images/image-20210903095904144.png)



### 3.2  初次渲染与更新

触发更新的条件：ReactDOM.render（初次触发更新），setState、forceUpdate和Hook等均可触发更新



