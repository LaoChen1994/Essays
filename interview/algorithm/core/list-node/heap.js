class MinHeap {
    constructor (list, fn) {
        this.heap = list
        this.fn = fn
        this.#buildHeap(this.heap)
    }

    getFormatValue (index) {
        if (!this.fn) return this.heap[index]

        return this.fn(this.heap[index])
    }

    swap(from, to) {
        [this.heap[from], this.heap[to]] = [this.heap[to], this.heap[from]]
    }

    get value() {
        return this.heap.slice(1)
    }

    #buildHeap () {
        this.heap.unshift(0)

        for (let i = 1; i < this.heap.length; i++) {
            let curr = i
            let parent = Math.floor(i / 2)

            while(curr > 0 && this.getFormatValue(parent) > this.getFormatValue(curr)) {
                this.swap(parent, curr)
                curr = parent
                parent = Math.floor(parent / 2)
            }
        }
    }

    add(num) {
        this.heap.push(num)
        let curr = this.heap.length - 1
        let parent = Math.floor(curr / 2)

        while (curr > 0 && this.getFormatValue(curr) < this.getFormatValue(parent)) {
            this.swap(curr, parent)
            curr = parent;
            parent = Math.floor(parent / 2)
        }
    }

    pop() {
        if (this.heap.length <= 1) {return null;}
        this.swap(1, this.heap.length - 1)

        const minVal = this.heap.pop()
        let curr = 1;
        let left = 2 * curr
        let right = 2 * curr + 1

        while (curr < this.heap.length - 1) {
            let minIdx = curr;

            if (left < this.heap.length && this.getFormatValue(minIdx) > this.getFormatValue(left)) {
                minIdx = left
            }

            if (right < this.heap.length && this.getFormatValue(minIdx) > this.getFormatValue(right)) {
                minIdx = right
            }

            if (minIdx === curr) {
                break
            }

            this.swap(curr, minIdx)
            curr = minIdx;
            left = curr * 2
            right = curr * 2 + 1
        }

        return minVal
    }
}

module.exports = {
    MinHeap
}

// const heap = new MinHeap([9,3,7,6,5,4,10,2])

// console.log(heap.value)
// heap.add(1)
// console.log(heap.value)
// console.log(heap.pop())
// console.log(heap.value)