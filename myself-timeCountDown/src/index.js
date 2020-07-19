function getWorker(worker, param) {
    const code = worker.toString()
    const blob = new Blob([`(${code})(${JSON.stringify(param)})`])

    return new Worker(URL.createObjectURL(blob))
}

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
                this.postMessage({ nextTick })
                leftTime = leftTime - interval
                nextTick = countDown(leftTime)
            } , interval)
        } else if (type === 'end') {
            clearInterval(_timer)
        }
    }
}

function compareList(arr1 = [], arr2 = []) {
    let diffIndex = []

    for (let index = 0; index < arr1.length; index++) {
        if(arr1[index] !== arr2[index]) diffIndex.push(index)
    }

    return diffIndex    
}


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

const countRender = render()

const worker = getWorker(getCountDown, { leftTime: 691200000 })

worker.postMessage({ type: "start", interval: 1000 })
worker.onmessage = e => countRender(e.data.nextTick)

