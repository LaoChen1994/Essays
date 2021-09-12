# React 源码学习

## 0. 写在前面

[大佬的react源码分析](https://github.com/AttackXiaoJinJin/reactExplain)

1. 目前React的源码中有许多使用flow的地方来定义类型可以不看

2. \__DEV__是用在React开发环境下的代码，本文不看

## 1. React.createElement()和ReactElement()

### 1.1 从jsx -> js

在React中，通过createElement函数将JSX -> JS，通过jsx来实现了模版的编译，将html模版转换为js, 这里注意如果本身的模版就是一个嵌套的组件，在插件将jsx转为js的过程中就会转了

**编译前**

```html
<div id='one' class='two'>
  <span id="spanOne">this is spanOne</span>
  <span id="spanTwo">this is spanTwo</span>
</div>
```

**编译后**

```javascript
React.createElement(  "div", 
                    { id: "one", class: "two" }, 
                    React.createElement( "span", { id: "spanOne" }, "this is spanOne"),  
                    React.createElement("span", { id: "spanTwo" }, "this is spanTwo")
                   );
```

**注意：**如果这里的div是一个大写的函数，这里会把他处理成一个组件，作为一个变量传入，所以自定义组件都是大写开头

### 1.2 createElement源码分析

**源码坐标**：react16.8.6/packages/react/src/ReactElement.js

**函数源码**

简单讲讲createElement做了什么事：

1. 对config中的预设变量进行抽离：ref，key, \_\_seft和 \__source字段
2. 将其余的变量规整到props往后传
3. 对children进行规整，并将所有的children按顺序存到children中
4. 利用Object.freeze方法对children进行冻结，防止在开发环境下的children被篡改
5. 把defaultProps中的默认值作为初始值赋值给props
6. 利用ReactElement工厂方法创建元素，这里的主要参数，type, key, ref, self, source, owner, props

```javascript
//作用：根据所传的参数创建ReactElement元素

//  type:"div",
//  config:{ id: "one", class: "two" },
//  children:React.createElement( "span", { id: "spanOne" }, "this is spanOne"),
//  React.createElement("span", { id: "spanTwo" }, "this is spanTwo")

// 注意：react只写了3个参数，实际上，从第三个参数往后都是children
// 这里的type 需要注意，如果你是小写的标签
// 在jsx转为js的时候type是一个字符串
// 但是如果你是一个大写的标签，这个时候type是一个变量
// 这个时候这个变量其实在解析的时候就是对应的你extends Component或者函数式的组件了
export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;
  //赋给标签的props不为空时
  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      //防止是Number
      key = '' + config.key;
    }
    //__self、__source 暂时不知道是干啥用的属性
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      // 如果config中的属性不是标签原生属性，则放入props对象中
      // 这里的保留属性包括: ref, key, __self 和 __source
      // 除了保留属性，其他的都认为是他的props属性
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  // 子元素数量
  const childrenLength = arguments.length - 2;
  
  // 这里完成了对于props.children的操作
  // 就是我们通过props.children拿到的对应子元素的列表
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    // 依次将children push进array中
    // 有个问题这里为啥不直接用Array.push
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    //如果是development环境的话
    if (__DEV__) {
      // 冻结array
      // 未在微信发表
      // https://www.jianshu.com/p/91e5dc520c0d?utm_campaign=hugo&utm_medium=reader_share&utm_content=note&utm_source=weixin-friends&from=singlemessage&isappinstalled=0
      // 防止元素被篡改
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    //开发中写的this.props.children就是子元素的集合
    props.children = childArray;
  }

  // Resolve default props

  //为传入的props设置默认值，比如：
  //class Comp extends React.Component{
  //  static defaultProps = {
  //     aaa: 'one',
  //     bbb: () => {},
  //     ccc: {},
  //   };
  //
  // }

  if (type && type.defaultProps) {
    // 这里主要是为了兼顾类组件
    // 通过类组件static defaultProps可以为类组件设置props的初始值
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      //如果props数组中未设值，则设置默认值（注意：null也算设置了值）
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  if (__DEV__) {
    //一旦ref或key存在
    if (key || ref) {
      //如果type是组件的话，赋值displayName
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      //可不看
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(
    type,  //'div'
    key,  //null
    ref,  //null
    self, //null
    source, //null
    ReactCurrentOwner.current, //null或Fiber
    props, //自定义的属性、方法，注意：props.children=childArray
  );
}
```

**分析何为有效key和ref**

 ```javascript
//判断是否设置了ref的属性,true有，false没有
function hasValidRef(config) {
  //如果是development环境的话
  // 这个__DEV__是给react团队内部用来测试的，我们不用看
  if (__DEV__) {
    //如果config中存在ref属性的话
    //在jQuery中 .call/.apply的更大作用是绑定this
    if (hasOwnProperty.call(config, 'ref')) {
      //Object.getOwnPropertyDescriptor() es5
      //Object.getOwnPropertyDescriptors() es6
      //https://blog.csdn.net/qq_30100043/article/details/53424963

      //返回对象config的属性ref 的get对象
      const getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      //如果isReactWarning，则忽略ref属性，返回false
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  // 只要ref不是undefined就是认为是有效的
  return config.ref !== undefined;
}
//判断是否设置了key
//同hasValidRef，不解释了
function hasValidKey(config) {
  if (__DEV__) {
    if (hasOwnProperty.call(config, 'key')) {
      const getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  // 同理不为undefined 就为有效的key
  return config.key !== undefined;
}
 ```

### 1.3 ReactElemenet

**源码分析**

主要步骤分析：

1. 创建一个element对象，其中有几个比较重要的值，主要设置了元素的类型和内在一些元素的属性
2. 将对应创建的element返回，其实就一个工厂创建方法，目的是为了返回一个对象

**需要注意的**

1. $$typeof: 之后在render渲染到DOM上的时候，需要判断$$typeof === REACT_ELEMENT_TYPE才能渲染上去，通过createElement创建的都是ReactElement
2. 注释中提到，在测试环境中可以使用WeakMap来代替__DEV__环境下的store属性，这样有利于垃圾回收的优化，我理解提升了调试环境下的性能

```javascript
// 将传入的props最后返回一个虚拟DOM
// 这里注意，对于react的虚拟DOM实际上就是一个对象
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    //标识element的类型
    // 因为jsx都是通过createElement创建的，所以ReactElement的类型固定:为REACT_ELEMENT_TYPE
    // 重要！因为react最终渲染到DOM上时，需要判断$$typeof===REACT_ELEMENT_TYPE
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    //设置元素的内置属性
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    //记录创建react.element的组件（this？）
    _owner: owner,
  };

  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.

    //验证flag是不固定的.我们将其放置在一个store上，从而能冻结整个object
    //这样一旦它们被用在开发环境时，用WeakMap代替

    //WeakMap
    // http://es6.ruanyifeng.com/#docs/set-map
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    //方便测试用
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self,
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```

## 2. ReactComponent和PureComponent

**源码坐标**：react16.8.6/packages/react/src/ReactBaseClasses.js

### 2.1 React.Component

1. **React.Component的构造器**，对props，context，refs进行了赋值，另外虽然updater进行赋值，但是实际还是在renderer中注册的

2. 将一个空对象赋值给了isReactComponent, 当渲染的时候发现组件继承了这个属性，判断确实是一个React组件

```javascript
function Component(props, context, updater) {
  this.props = props;
  //我在工作中没用到context，可以参考下这个：
  //https://www.cnblogs.com/mengff/p/9511419.html
  //是React封装的全局变量API
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  //如果在组件中用了 ref="stringa" 的话，用另一个obj赋值
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  //虽然给updater赋了默认值，但真正的updater是在renderer中注册的
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
```

**React Component中的几个原型方法**
1. setState

**相关解析**：
1. Component本质上是一个类，该函数为其构造函数
2. 从源码中来看只是调用了updater中的enqueueSetState方法，来更新对应的React组件的状态,这部分在ReactDom中实现, 坐标ReactNoopUpdateQueue.js
3. 在setState中，他会先置校验更新State的类型，只有为function，object或null的时候才为有效的state
4. forceUpdate如上所说
5. React.Component中也没有实现render componentWillMount等内部方法，只涉及了部分属性


```javascript


// 更新Component内部变量的API，
// 也是开发中非常常用且重要的API

// https://www.jianshu.com/p/7ab07f8c954c
// https://www.jianshu.com/p/c19e259870a5

//partialState：要更新的state，可以是Object/Function
//callback： setState({xxx},callback)
Component.prototype.setState = function(partialState, callback) {
  // 判断setState中的partialState是否符合条件，
  // 如果不符合则抛出Error
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  //重要！state的更新机制
  //在react-dom中实现，不在react中实现
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

```

### 2.2 React.PureComponent

**什么是纯组件(PureComponent)**: 如果一个组件只依赖外部传入的参数和自身的state，这种组件就是纯组件，其中也包括context，因为context本质上就是props。

PureComponent中做的事：
1. 实现PureComponent对Component方法上的继承，这里通过Object.assign来将Component上的方法复制到Component上减少原型链查询的开销
2. 在原型上增加一个isPureReactComponent的属性来标识是一个纯组件

**源码分析**

```javascript

/**
 * Convenience component with default shallow equality check for sCU.
 */

// 这里一样都是refs, props, context
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

//PureComponent是继承自Component的,下面三行就是在继承Component

// 原型链方法的继承
// 将Component的方法拷贝到pureComponentPrototype上
// 用ComponentDummy的原因是为了不直接实例化一个Component实例，可以减少一些内存使用
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());

//PureComponent.prototype.constructor = PureComponent
pureComponentPrototype.constructor = PureComponent;

// Avoid an extra prototype jump for these methods.
// 避免多一次原型链查找,因为上面两句已经让PureComponent继承了Component
// 下面多写了一句Object.assign()，是为了避免多一次原型链查找

// Object.assign是浅拷贝，
// 将Component.prototype上的方法都复制到PureComponent.prototype上
// 也就是pureComponent的原型上
// 详细请参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
Object.assign(pureComponentPrototype, Component.prototype);

// 唯一的区别就是在原型上添加了isPureReactComponent属性去表示该Component是PureComponent
pureComponentPrototype.isPureReactComponent = true;
```

**几个问题**
Q1: React 怎么判断是否需要更新
A1: 看是否有shouldComponentUpdate参数，ReactFiberClassComponent中的checkShouldComponentUpdate会对纯组件做特殊的处理和判断

Q2: PureComponent和Component的区别
A2: PureComponent相较于Component在ReactFiberClassComponent有一个优化的shouldComponentUpdate的判断逻辑

## 3. React Ref相关内容

**源码坐标**：react16.8.6/packages/react/src/ReactCreateRef.js

### 3.1 createRef

主要作用：创建一个{ current： null }的对象, 默认值为null，如果是\__DEV__条件下不可添加删除属性

```javascript
// an immutable object with a single mutable value
//可修改value的 不可变的对象
export function createRef() {
  //初始化ref对象，属性current初始值为null
  const refObject = {
    current: null,
  };
  if (__DEV__) {
    //密封的对象,不可添加，删除属性，可以修改属性
    Object.seal(refObject);
  }
  return refObject;
}
```

### 3.2 forwardRef

**源码位置**：react16.8.6/packages/react/src/forwardRef.js

**源码作用**：透传ref这个参数到内部的组件上，可以完美利用ref这个原生参数

**注意点：**这里的话是，**如果是forwardRef包裹的元素，目前会将原来type对应的是一个函数现在会替换成一个对象，对象里面的$$typeof就是REACT_FORWARD_REF_TYPE + 一个render函数**， 这里一定要注意，**并不是说被forwardRef包裹之后，type就从reactELement变成了ReactForwardRef，而是type变成了一个对象～！**

![image-20210603000242811](/Users/pidan/Library/Application Support/typora-user-images/image-20210603000242811.png)

具体使用ref + forwardRef的例子可以看：[useRef, useImperativeHandle](https://blog.csdn.net/qq_24724109/article/details/103817607)

```javascript
export default function forwardRef(render) {
  return {
    // 被forwardRef包裹后，组件内部的$$typeof是REACT_FORWARD_REF_TYPE
    $$typeof: REACT_FORWARD_REF_TYPE,
    // render即包装的FunctionComponent，ClassComponent是不用forwardRef的
    render,
  };
}

```

## 4. 使用React Context

**源码位置**:react16.8.6/packages/react/src/ReactContext.js

### 4.1 context组件的使用方法：

```javascript
import React from 'react';
const contextTestOne = {  name:'chen',  length:22,};

export const wrapContext= React.createContext(contextTestOne.name)
```

```react
import { wrapContext as Context } from '@/utils/context';
const Father= props => {  
  return (
    <Context.Provider value={'this is provider'}>     
      <Child />
    </Context.Provider>
  )}
```

```react
import { wrapContext as Context } from '@/utils/context';
const getProviderValue= ()=>{  return }

export const Child = props=>{
  return (
    <Context.Consumer>
      { value => <span>{value}</span> }
    </Context.Consumer>
  );}
```

从使用方法分析，createContext返回至少需要有 Provider和Consumer这两个React组件

### 4.2 源码分析：

目前是去掉\__DEV__和flow定义的版本

简单总结：

1. createContext创建的是一个context的组件，这个组件就是一个$$typeof为REACT_CONTEXT_TYPE的虚拟dom，这个东西因为不是REACT_ELEMENT所以不会被渲染
2. 这个context的虚拟DOM就是Consumer这个React组件的真身
3. Provider，他本身是一个$$typeof为REACT_PROVIDER_TYPE的虚拟DOM，他内部含有的context为consumer的虚拟DOM，用来保存currentValue，这个currentValue有1和2的区分，其实是一样的，只是为了主副渲染器用而已。

```javascript
export function createContext<T>(
  defaultValue,
  //使用Object.is()计算新老context的差异
  calculateChangedBits,
) {
  if (calculateChangedBits === undefined) {
    calculateChangedBits = null;
  }

  const context = {
    // 还是那句话，ReactContext中的$$typeof是
    // 作为createElement中的属性type中的对象进行存储的，并不是ReactElement的$$typeof
    // 这个组件只是功能性的所以他不会被render出来，通过$$typeof来进行标识
    $$typeof: REACT_CONTEXT_TYPE,
    _calculateChangedBits: calculateChangedBits,
    //作为支持多个并发渲染器的解决方法，我们将一些渲染器分类为主要渲染器，将其他渲染器分类为辅助渲染器。
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary.

    //我们只希望最多有两个并发渲染器：React Native（主要）和Fabric（次要）;
    // React DOM（主要）和React ART（次要）。
    // 辅助渲染器将自己的context的value存储在单独的字段中。
    
    // We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.

    //<Provider value={xxx}>中的value就是赋值给_currentValue的

    //也就是说_currentValue和_currentValue2作用是一样的，只是分别给主渲染器和辅助渲染器使用
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.

    //用来追踪该context的并发渲染器的数量
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null,
  };
  //const obj={}
  //obj.provider._obj = obj
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context,
  };

  //const obj={}
  //obj.consumer=obj
  //也就是Consumber对象指向React.Context对象

  //在<Consumer>进行渲染时，为了保证Consumer拿到最新的值，
  //直接让Consumer=React.Context，
  // React.Context中的_currentValue已经被<Provider>的value给赋值了
  //所以Consumer能立即拿到最新的值
	context.Consumer = context;
  

  return context;
}
```

## 5. React children map

作用：React提供的顶层API，用于处理this.props.children不透明数据结构的实用方法，具体包括：

+ React.Children.map
+ React.Children.forEach
+ React.Children.count
+ React.Children.only
+ React.Children.toArray

### 5.1 mapChildren方法详解

**1. 使用案例**

```react
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { About } from './about';
import styles from './style.css'
import MultiChildren from './MultiChildren'

interface AppComponent {
  title: string;
}

export default class App extends Component<{}, AppComponent> {
  constructor(props) {
    super(props);

    this.state = {
      title: 'this is test 2 ',
    };
  }

  render() {
    const { title } = this.state;

    return (
      <MultiChildren>
        <h1 className={styles.font}>{title}</h1>
        <About />
        <div>
          <div>123</div>
          <div>456</div>
        </div>
      </MultiChildren>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

```

```react
// 使用案例
import React, { Component } from 'react'

export default class MultiChidren extends Component {

  render() {
    const children = React.Children.map(this.props.children, (item)=>{return [item,[item,] ]})
    console.log(children) 

    return (
      <div>
        { children }
      </div>
    )
  }
}
```

**输出的children：**![image-20210601235609276](/Users/pidan/Library/Application Support/typora-user-images/image-20210601235609276.png)

**2. 源码分析**

**源码坐标：react16.8.6/packages/react/src/ReactChildren.js**

总结关键步骤：

1. 调用顺序：

   ![image-20210602003801541](/Users/pidan/Library/Application Support/typora-user-images/image-20210602003801541.png)

2. 上下文的使用，所有在递归过程中需要用到的变量和结果都会保存在上下文中进行更新

```react
// 其实mapChildren调用了mapIntoWithKeyPrefixInternal
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  const result = [];
  //进行基本的判断和初始化后，调用该方法
  // 调用：React.Children.map(this.props.children, (item)=>{return [item,[item,] ]})
  // children -> this.props.chidren h1, About, div 
  // result -> []
  // null
  // func -> (item)=>{return [item,[item,] ]}
  // context -> null
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}
```

接下来看mapIntoWithKeyPrefixInternal这个函数

```react
function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  let escapedPrefix = '';
  // 第一次调用 prefix -> null 跳过
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  //从pool中找一个对象
  //[],'',(item)=>{return [item,[item,] ]},undefined

  // 初始化一个context
  //traverseContext=
  // {
  //  result:[],
  //  keyPrefix:'',
  //  func:(item)=>{return [item,[item,] ]},
  //  context:undefined,
  //  count:0,
  // }
  // 这里有一个对象池，第一次进入对象池为空，初始化一个
  const traverseContext = getPooledTraverseContext(
    array,
    escapedPrefix,
    func,
    context,
  );
  //将嵌套的数组展平
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  releaseTraverseContext(traverseContext);
}
```

```javascript
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  // children, '', mapSingleChildIntoContext, 
  //traverseContext=
  // {
  //  result:[],
  //  keyPrefix:'',
  //  func:(item)=>{return [item,[item,] ]},
  //  context:undefined,
  //  count:0,
  // }
  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}
```

在traverseAllChildrenImple中其实就是调用mapSingleChildIntoContext(*bookKeeping*, *child*, *childKey*) 这个函数

```javascript
function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  //解构赋值
  const {result, keyPrefix, func, context} = bookKeeping; // traverseContext
  //func:(item)=>{return [item,[item,] ]},
  //item即<span>1<span/>
  //第二个参数bookKeeping.count++很有意思，压根儿没用到，但仍起到计数的作用
  
  // child永远是当前层级的单个节点
  let mappedChild = func.call(context, child, bookKeeping.count++);
  //如果根据React.Children.map()第二个参数callback，执行仍是一个数组的话，
  //递归调用mapIntoWithKeyPrefixInternal，继续之前的步骤，
  //直到是单个ReactElement
  if (Array.isArray(mappedChild)) {
    //mappedChild:[item,[item,] ]
    //result:[]
    //childKey:.0
    //func:c => c
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, c => c);
  }
  //当mappedChild是单个ReactElement并且不为null的时候
  else if (mappedChild != null) {
    if (isValidElement(mappedChild)) {
      //赋给新对象除key外同样的属性，替换key属性
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        //如果新老keys是不一样的话，两者都保留，像traverseAllChildren对待objects做的那样
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey,
      );
    }
    //result即map时，return的result
    result.push(mappedChild);
  }
}
```

## 6. React update

### 6.1 React Ref更新

**源码位置**：react16.8.6/packages/react-reconciler/src/ReactFiberBeginWork.js

**源码作用**：更新ref指向的内容，并且更新对应的组件

##  7. ReactDom render学习

**源码坐标：**react16.8.6/packages/react-dom/src/client/ReactDOM.js

**调用ReactDOM render的结果**：

这里我们可以看到其实这里就是返回了一个Component类的实例，也就是上面的App

![image-20210604145556201](/Users/pidan/Library/Application Support/typora-user-images/image-20210604145556201.png)

**源码分析**：

```javascript
render(
    //元素
    element: React$Element<any>,
    //容器
    container: DOMContainer,
    //应用渲染结束后，调用的函数
    callback: ?Function,
  ) {
    //render方法本质是返回了函数legacyRenderSubtreeIntoContainer
    return legacyRenderSubtreeIntoContainer(
      null,
      element,
      container,
      //render不会复用节点，因为是前端渲染
      false,
      callback,
    );
  },
```

### 7.1 legacyRenderSubtreeIntoContainer

**源码分析**

```javascript
function legacyRenderSubtreeIntoContainer(
  // null
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: DOMContainer,
  forceHydrate: boolean,
  callback: ?Function,
) {
  // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.

  //render中一般渲染的是DOM标签，所以不会有_reactRootContainer存在，
  // 所以第一次渲染，root是不存在的
  let root: _ReactSyncRoot = (container._reactRootContainer: any);
  let fiberRoot;
  if (!root) {
    // Initial mount
    //创建一个ReactRooter
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    fiberRoot = root._internalRoot;

    //判断是否有callback
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        //根据fiberRoot获取公共Root实例
        //就是fiberRoot.current.child.stateNode
        const instance = getPublicRootInstance(fiberRoot);
        //通过该实例instance 去调用originalCallback方法
        originalCallback.call(instance);
      };
    }
    // Initial mount should not be batched.
    //初始化安装不应该批量更新
    unbatchedUpdates(() => {
      //element,fiberRoot,null,callback
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function() {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  return getPublicRootInstance(fiberRoot);
}
```

**流程分析**

1. 如果是第一次，mount的场景，这个时候会创建_reactRootContainer，他是一个包装过的ReactSyncRoot类型的对象
2. 通过调用updateContainer来挂载节点，区别是，如果是初次调用过的话，会通过unbatchedUpdates来包一层，不批量更新(目前还不理解)
3. 返回根节点的实例，也就是我们看到的第一张图的renderNode

#### 7.1.1 ReactRoot 根节点的创建过程

**调用链：**legacyCreateRootFromDOMContainer -> ReactSyncRoot -> createContainer -> FiberRootNode

**注意点**：

1. 创造根节点对于浏览器渲染和对服务端渲染有区别，浏览器渲染会将子节点全部循环删除

2. 实际创造的ReactRootNode就是FiberRootNode, FiberRootNode其实就是对node属性进行了初始化一下

   ```javascript
   function FiberRootNode(containerInfo, tag, hydrate) {
     this.tag = tag;
     this.current = null;
     this.containerInfo = containerInfo;
     this.pendingChildren = null;
     this.pingCache = null;
     this.finishedExpirationTime = NoWork;
     this.finishedWork = null;
     this.timeoutHandle = noTimeout;
     this.context = null;
     this.pendingContext = null;
     this.hydrate = hydrate;
     this.firstBatch = null;
     this.callbackNode = null;
     this.callbackExpirationTime = NoWork;
     this.firstPendingTime = NoWork;
     this.lastPendingTime = NoWork;
     this.pingTime = NoWork;
   
     if (enableSchedulerTracing) {
       this.interactionThreadID = unstable_getThreadID();
       this.memoizedInteractions = new Set();
       this.pendingInteractionMap = new Map();
     }
   }
   ```

3. 创建fiberRootNode的时候还创建了hostRootFiber, root.current = createRootFiber(tag), 未初始化的节点(还不知道有啥用),这个hostRootFiber实际上是一个FiberNode

4. 之后会讲创建的root放到ReactSyncRoot调用createContainer创建出来的root节点将放到对应的ReactRootNode这个类的_internalRoot节点之下

**数据结构的变化**

| 调用链阶段                       | 入参数                                           | 出参数                                                       |
| -------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| legacyCreateRootFromDOMContainer | DOM元素，例documenet.getElementById('#app')      | 同下                                                         |
| ReactSyncRoot                    | DOM元素(如果是浏览器渲染，是一个字元素为空的DOM) | 一个实例化的ReactSyncRoot对象，他的_internalRoot为为创建的FiberNode对象 |
| createContainer                  | DOM元素，tag，是否ssr                            | 同下                                                         |
| createFiberRoot                  | 同上                                             | 同下                                                         |
| FiberRootNode                    | 同上                                             | 一个FiberNode的实例化对象，current为uninitializedFiber时通过createHostRootFiber创建的，是个一个FiberNode，他的stateNode指向创建的root fiber node，uninitializedFiber创建的时候child和siblings都是null，还未给初始值 |

总结：所以创建的rootContainer的变化就是从一个dom的节点变成了一个ReactSyncRoot对象，这个对象其实里面包含了fiber需要用到的FiberNode的信息和真实dom的信息

#### 7.1.2 Fiber Node

创建的Fiber Node的结构

```javascript
function FiberNode(
  // 用于标记这个节点的标记，如果是初次创建节点是HostRoot，代表是根节点
  tag: WorkTag,
  // 根容器节点这里是null
  pendingProps: mixed,
  // 就是react标签上的key
  key: null | string,
  // 初次root container的时候
  // ConcurrentMode | BatchedMode | StrictMode;
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  // 达标的是元素的类型，比如div还是Home
  this.type = null;
  this.stateNode = null;

  // Fiber
  // 用于指向父节点
  this.return = null;
  // 指向第一个子元素
  this.child = null;
  // 指向兄弟节点
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  // 这些应该是用于记录更新时候的副作用
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null;

  if (enableProfilerTimer) {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN;

    // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).
    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  }

  //删除了 dev 代码
}
```

最后fiber创建的树结构为：

**从这个RootFiber中我们可以看到fiberNode的结构是单向的在父元素和第一个子元素之间是通过child进行连接，在平级的兄弟节点之间是通过sibilings的方式进行引用的，而不是通过child直接进行引用的**, 其具体的总结为：

1. 单向遍历
2. props.children连接
3. 子指父
4. doubleBuffer

![fiber node](https://user-gold-cdn.xitu.io/2019/8/19/16caa120cf2252fd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### 7.1.2 react updateContainer详解

**入参分析**： 

+ children：就是需要渲染的React节点，比如之前的App，他是jsx转成的虚拟dom的结果
+ fiberRoot：是7.1.1中提到的根节点的ReactSyncRoot对象，他本质上是一个对象，包含了需要渲染的对应的容器的信息
+ parentComponent：如果是根节点就是null
+ Callback: update之后的回调（这部分后面再看）

**源码分析**

```javascript
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): ExpirationTime {
  const current = container.current;
  // 1073741823
  // 这里是计算当前的时间
  // 他的实现时通过一个便宜量，为了超过v8对于系统最大的magic数字的限制导致的计算异常问题
  const currentTime = requestCurrentTime();
  const suspenseConfig = requestCurrentSuspenseConfig();
  //计算过期时间，这是React优先级更新非常重要的点
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );
  
  // 这里计算过期时间可以认为是，如果超过了过期时间，他就会更新（简单点看）
  return updateContainerAtExpirationTime(
    element,
    container,
    parentComponent,
    expirationTime,
    suspenseConfig,
    callback,
  );
}
```













## 1. React源码中常用的数据结构

#### 1.1 WorkTag