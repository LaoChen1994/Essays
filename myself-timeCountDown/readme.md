### Web Worker实现秒杀倒计时

#### 灵魂拷问 -> 为啥要用web worker

> 因为我们知道 setInterval(() => {}, 1000)代表的意思其实是最快1秒之后能执行, 而如果事件阻塞了的话 就不知道要多久我们才能执行上这个事件了, 因此如果倒计时的话,就会存在这个倒计时的时间被卡住的问题, 如果是秒杀的问题的话~问题有点严重

#### 1. 预备知识介绍

##### 1. 主进程和子进程之间主要通过消息进行通信

+ postMessage: 发送消息 -> 可以接受任何参数由父到子 或者 由子到父
+ onmessage: 接受postMessage发送的消息对应的回调

简单理解： 通过postMessage 发送消息 类似于 在对方进程中触发 消息事件，然后对方进程接受消息后 触发onmessage回调，做后续处理

##### 2. 动态加载一个web worker代码

一般web worker需要 子进程执行的代码是写在一个单独的js中的，但是我们可以通过blob + URL.createObjectURL来创建一个虚拟的文件，之后在执行web worker

~~~javascript
function getWorker(worker, param) {
    const code = worker.toString()
    const blob = new Blob([`(${code})(${JSON.stringify(param)})`])

    return new Worker(URL.createObjectURL(blob))
}
~~~

#### 2. 代码撸起

##### 1. 子进程代码

主要流程包括：

1. 监听父消息，开始和结束对应的计时时间
2. 处理倒计时得到的天，时，分，秒的信息
3. 每过一秒发送对应的1中信息给主进程

~~~javascript
function getCountDown(param) {
    let _timer = null
    let { leftTime } = param

    this.onmessage = e => {
        const { data: { type, interval } } = e

        const countDown = (milsecond) => {
            const second = milsecond / 1000

            if ( milsecond <= 0 ) {
                clearInterval(timer)
                return [0, 0, 0, 0]
            }

            const leftSecond = ~~(second % 60)
            const leftMinutes = ~~(second / 60 % 60)
            const leftHours = ~~(second / 60 / 60 % 24)
            const leftDay = ~~(second / 60 / 60 / 24 )

            return [leftDay, leftHours, leftMinutes, leftSecond]
        }

        nextTick = countDown(leftTime)

        if(type === 'start') {
            _timer = setInterval(() =>  {
                // 通过postMessage告诉父进程 我已经计时了1秒了 你可以操作了
                this.postMessage({ nextTick })
                leftTime = leftTime - interval
                nextTick = countDown(leftTime)
            } , interval)
        } else if (type === 'end') {
            clearInterval(_timer)
        }
    }
}
~~~

##### 2. 父进程代码

主要流程：

1. 启动子进程
2. 监听子进程倒计时时间并渲染到页面上

~~~javascript
const worker = getWorker(getCountDown, { leftTime: 691200000 })

worker.postMessage({ type: "start", interval: 1000 })
worker.onmessage = e => countRender(e.data.nextTick)
~~~

3. 渲染部分代码：

> 这里通过简单的元素对比来渲染对应的元素，减少dom操作，名曰~提升代码性能，其实好像这个例子里 不这么操作也没问题hhhhh
>
> + 用闭包维护一个老状态
> + 对比获得需要更新的dom元素
> + 然后对他的innerHtml进行操作

~~~javascript
function compareList(arr1 = [], arr2 = []) {
    let diffIndex = []

    for (let index = 0; index < arr1.length; index++) {
        if(arr1[index] !== arr2[index]) diffIndex.push(index)
    }

    return diffIndex    
}

// 渲染方法
function render() {
    const elem = document.getElementById('count_con')
    let firstRender = true;
    let prevTime = [0, 0, 0, 0]
    
    return function (params = [0, 0, 0, 0]) {

        params = params.map(item => item.toString().padStart(2, "0"))

        if (firstRender) {
            const html = params.reduce((p, c) => {
                return p + `
                    <div class="count_item" id="count_item">${c}</div>
                `
            }, '')

            elem.innerHTML = html
            firstRender = false
        } else {
            const nowCounts = document.getElementsByClassName("count_item")
            const diff = compareList(prevTime, params)

            diff.forEach(i => {
                nowCounts[i].innerHTML = params[i]
            })
        }

        prevTime = params
    }
}

~~~



#### 3. 实现效果

![计时器效果](./image/timer.gif)



