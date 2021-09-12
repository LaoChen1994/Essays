# CSS世界读书笔记

## 1. 概述

### 1.1 是什么和使命

CSS: 层叠样式表，样式通过层层累加的方法来进行显示，这种层叠策略使得样式变得相当灵活。

CSS使命：CSS创建的使命就是为图文信息服务的。

### 1.2 CSS的流

**流是什么**：即文档流，是CSS中的一种基本的定位和布局的机制，用于引导元素排列和定位的一种规则。

**流体布局是是什么**：利用元素“流”的特性，来实现各类布局效果。流布局本身具有自适应特性，所以流体布局具有一定的适应性。(表格是自己的一套东西和流不是一路的)，曾经风靡的div + css就是典型的流体布局

## 2. 需要提前了解的属于或概念

### 2.1 了解的概念

+ 属性
+ 值
+ 关键字：保留的属性值
+ 变量
+ 长度单位
  + <number> + 长度单位 = <length>用于区分长度单位和值之间的区别
  + 相对长度单位：em、ex、rem、ch
  + 绝对长度单位：vh、vw、vmin、vmax、px等
+ 功能符（以函数的方式指定值）
  + rgba/hsla
  + url
  + calc
  + attr
  + scale（transform类）
+ 属性值：冒号后的所有上面的功能符、长度单位变量的组合就是属性值
+ 声名：一条css规则：属性名 + 属性值
+ 声名块：用{}括起来的多条声明
+ 规则或规则集：选择器 + 声名块
+ 选择器
+ 关系选择器
  + 后代选择器：通过空格链接
  + 相邻后代选择器：只选择符合规则的儿子元素，用>链接
  + 兄弟选择器：用~链接，选中元素后续的所有兄弟元素
  + 相邻兄弟选择器：选择符合规则的兄弟元素，用+链接，后一个相邻的元素
+ @规则：@media @font-face等规则

## 3. 流、元素与基本尺寸

### 3.1. 元素的种类

#### 3.1.1.块级元素 

通常指的是一个水平流上只能单独显示一个元素，多个元素需要换行。

**注意**：并不是所有的块级元素的display都是block, table的display为table，li的display为list-item
因此可以通过块级元素的方法来清除浮动

```css
.clear:after {
    content: '',
    display: table; /*这里也可以是block或list-item*/
    clear: both;
}
```

使用table或者block而很少用list-item清除浮动的原因
1. 字母较多
2. 容易出现li前面的不需要的小黑点
3. 兼容性不好，ie不支持伪类元素使用display为list-item

**内联盒子和块状容器**：例如inline将是内联盒子代表一行内可以排列多个内联元素，block是块状元素，其表示一行只能有一个元素，多个块状容器需要换行。

#### 3.1.2 特殊的盒子

1. 标记盒子：当我们使用ol或者ul标签下的li的时候，这个时候展示在页面上会有无序或者有序的标记符号，这个标记符号是放在标记盒子中
2. 内外盒子：inline-block代表外部是内联盒子，一行可以多个元素，但是内部又是块状容器(填满整个内部)，因此block其实代表的是block-block内外均为块状容器
3. inline-table: 外部是内敛盒子，内部是table，如果子元素设为display: table-cell会使内部为table布局

```html
和文字平起平坐的表格：<div class="inline-table">
    <p>第1列</p>
    <p>第2列</p>
</div>
```

```css
.inline-table {
    display: inline-table;
    width: 128px;
    margin-left: 10px;
    border: 1px solid #cad5eb;
}
.inline-table > p {
    display: table-cell;
}
```

### 3.2 width的细节

#### 3.2.1 width的作用范围

1. width: auto的表现形式
    + 充分利用空间：例如div, p这类块容器，他妈呢会充分充满父容器的空间(整体宽度受外部尺寸的影响)
    + 收缩与包裹：浮动，绝对定位、inline-block、table这类
    + 收缩到最小：类似table多列宽度不够，设为width: auto的列将被自动收缩
    + 超过父容器，如果外盒子有明确的width设定，内部盒子宽度超过外盒子或者white-space: nowrap的场景

2. 外部尺寸(块级元素)的特点：
    1. 正常流宽度： 宽度和浏览器保持一致，能够自动铺满父容器，所以不用设置对应的宽度
    2. 格式化宽度: 当position为absolute或者fixed且right和left或top和bottom同时存在的时候，宽度为父节点的宽度减掉对应的right + left或者top+ bottom的宽度或高度, 如下代码中.container的元素中的.content元素定位在顶部的中间，且左右的距离为20px
    
    ```html
    <div class="container">
      <div class="content">123</div>
    </div>
    ```
    
    ```css
    .container {
      width: 300px;
      height: 200px;
      background: yellow;
      position: relative;
    }
    
    .content {
      position: absolute;
      background: red;
      left: 20px;
      right: 20px;
    }
    ```
    
3. 内部尺寸与流体特性

1. 包裹性：如果一个元素是display: inline-block, 其最大宽度不会超过容器，如果外部元素有最大宽度，那么也不会超过外部元素的最大宽度。

包裹代表：不管内部元素多长，多宽，都会包裹在整个inline-block中
自适应性：如果外部有父容器，宽度不会超过父容器，内部的文字也会自动布局

**包裹性的应用**: 某个模块的文字是动态的，可能是几个字也可能是一句话，希望文字少的时候居中显示，文字超过一行的时候居左展示,这里要注意要是中文，如果是英文或者数字的话，换行可能不太行，需要添加word-break

```html
<div class="container">
  <div class="text">你好啊你好啊你好啊你好啊你好啊</div>
</div>
```

```css
.container {
  width: 100px;
  padding: 10px;
  background: red;
  text-align: center;
}

.text {
  display: inline-block;
  text-align: left;
}
```

2. 首选最小宽度

这里探讨的是如果一个inline-block的width为0的时候，那么这个时候内部有文字或图片的话，他的包裹性会是如何的？

+ 这里分为几个情况：
    + 内部为中文字：这个时候最小宽度为每个汉字的宽度
    + 西方文字：一般不会自动短句，会终止于空格，短横线，问号以及其他字符，如果需要单个字符换行可以使用，word-break: all;

实际开发中的应用：

+ 通过外部容器width为0，内部元素display: inline;来使文字换行，一行只展示一个中文字
+ 实现凹凸的效果： width: 0 + inline元素outline实现

   ```html
   <div class="container">
      <div class="text">love你love</div>
    </div>
    
    <div class="container">
      <div class="text">你love你</div>
    </div> 
   ```
   
   ```css
   .container {
      display: inline-block;
      width: 0;
    }
    
    .text {
      display: inline;
      color: white;
      outline: 1px solid #000;
    }
    
    .container:nth-child(2) {
      margin-left: 80px;
      transform: rotate(180deg);
    }
   ```
3. 最大宽度

定义：指的是元素可以有的最大宽度，如果内联盒子内部没有块级元素，或者块级元素没有设定宽度值，则实际上是最大连续内联盒子的宽度

理解：以inline-block为例，如果本身inline-block这个行内元素外边界没有设宽，内部也是一个块级元素，所以如果有块级元素就是自己占一行，因此最长的宽度就是最大的连续行内元素拼起来的宽度。

#### 3.2.2 width的作用范围

盒子的分类：
    + border-box
    + padding-box
    + content-box
    
盒子的初始类型为content-box,即如果一个盒子模型有100px，那么初始化情况下一定是content这个内容区的宽度为100px，如果这个时候有padding和margin，那么整体盒子的大小是100px + padding + margin；

这种盒子模型可能带来的问题：
1. 流动性流失：当宽度作用在content-box上限制了其内部元素的流动性，因为他的宽度被限制了
2. 与现实世界表现不一致：这个很好理解，因为我们认为是100px，其实他是100 + padding + margin

解决办法：宽度分离，将宽度抽离到父组件控制，这样内部元素还能保持内部元素的流动性，是元素在内部自适应呈现


```css
.box {
    width: 100px;
    margin: 20px;
    padding: 20px;
}

.father {
    width: 180px;
}

.son {
    padding: 20px;
    margin: 20px;
}
```

#### 3.2.2 height

1. height: auto

> 因为本身作为一个流体模型，height就是一层一层高度累加的总和，所以这里height: auto就是这样增加的，是很好理解的。

2. height: 100%不生效

原因：规范中规定，如果包含元素没有显示指定的高度或者绝对定位，那么默认的height就是auto，所以auto * 100%没办法算出来，因此height: 100%不生效

**解决办法**：

1. 父元素指定高度（这种场景的高度100%是content-box）
2. 绝对定位（这种场景100%高度是父元素的border-box）


### 3.3 min-width和max-width以及min-height和max-height

#### 3.3.1 min-width/max-width应用

对于适配不同的屏幕，以及一些过大的图片的适配的时候，用max-width或者min-width可以有效地保证页面的展示符合我们的预期

#### 3.3.2 初始值

max-**系列：默认值为none 

min-**系列：默认值为auto

#### 3.3.3 max-width与width的覆盖关系

1. max-width会覆盖width，且不能通过!important来进行覆盖
2. min-width的覆盖性要高于max-width, 就是当两者同时存在且起冲突的时候，min-width说了算

### 3.3.4 任意元素的展开收起

max-width的一个应用，如果需要做元素的展开手气，在展开的时候可以max-height给一个足够大的值，然后渲染出来就会是height: 100%, 在不超过最大高度的情况下

### 3.4 内敛元素