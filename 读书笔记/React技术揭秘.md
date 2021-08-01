# React技术揭秘

## 一、原文传送门

[React技术揭秘](https://react.iamkasong.com/preparation/idea.html#react%E7%90%86%E5%BF%B5)

**感谢原作者的分享，让我们学到更多，这里只是针对原文中重点的记录，如果有需要的可以直接看原文**

## 二、React原理

### 2.1 React理念

React的特点：==快速响应==

制约瓶颈：

+ 大量计算操作导致掉帧（CPU瓶颈）
+ 网络请求，导致快速响应（IO瓶颈）

#### 2.1.1 CPU 瓶颈

直接渲染3000个节点，这个时候JS的执行时间已经超过了一帧的时间，这样就会导致卡顿。

【解决办法】只留给JS一定的时间进行JS的执行，剩下的时间交还给浏览器做UI的渲染，没有执行完的下一帧继续操作。

这种**将一个长任务切分成多个时间片内的短任务来执行**的过程，称为==时间切片==，解决的是CPU计算瓶颈导致的掉帧问题。

#### 2.1.2 IO的瓶颈

当是由于网络原因导致的页面加载缓慢，目前无法通过前端解决，只能就是前端加个loading，或者在当前页面进行一定停留的交互的方式解决。

【解决办法】Suspense + useDeferredValue, 将同步更新变为可中断的异步更新

### 2.2 新老React架构

#### 2.2.1 React 15架构

架构主要分层：

+ Reconciler -> 找出变化的组件
+ Renderer -> 将变化的组件渲染到页面上

【Reconciler】当触发this.setState, this.forceUpdate等API触发更新，时候工作：

+ 调用函数组件或者类组件的render方法，将JSX转成虚拟DOM
+ 进行虚拟DOM Diff算法
+ 找出更改的虚拟DOM
+ 通知Renderer将变化的虚拟DOM渲染到页面上

【Renderer】负责组件的渲染：

+ 将Reconciler通知得到的变化的虚拟DOM，进行相应的渲染工作

这种架构的话，Reconciler和Renderer之间是交替进行的，一旦递归树很大就会没办法停下来，是不会中断进行中的更新的。

#### 2.2.2 React 16架构

架构分层：

+ Scheduler：调度器，用来控制将更高优先级的任务，提前进入Reconciler
+ Reconciler：找出变化的组件
+ Renderer：将变化的组件渲染到页面上

















