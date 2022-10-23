# 核心框架汇总

## 1. 刷题心得

### 1.1 算法的本质

数据结构中的所有算法本质是穷举。（除机器学习，密码学算法外）。

#### 1.1.1穷举的难点

1. 无遗漏

2. 无冗余

### 1.2 数组/单链表算法

相关考点：双指针

双指针技巧：

1. 二分查找

2. 快慢指针（滑动窗口）

3. 回文串技巧

4. 前缀技巧和差分数组技巧

### 1.3 二叉树系列算法

所有高级算法都可以认为是二叉树的衍生算法，比如回溯就是一个遍历一个多叉树

#### 1.3.1 二叉树递归解法的思路

1. 遍历一次二叉树得到结果

2. 分解问题计算得到答案

#### 1.3.2 遍历二叉树得到结果

**二叉树深度**

```javascript
function maxLength (tree) {
    let maxDepth = 0, depth = 0

    function traverse (root) {
        if (root === null) {
            maxDepth = Math.max(maxDepth, depth)
            return
        }

        depth++
        traverse(root.left)
        traverse(root.right)
        depth--
    }

    traverse(tree)

    return maxDepth
}
```

**二叉树的先序遍历**

```javascript
function preorder (tree) {
    let res = []

    function traverse (root) {
        if (root === null) {
            return
        }

        res.push(root.key)
        traverse(root.left)
        traverse(root.right)
    }

    traverse(tree)

    return res
}
```

#### 1.3.3 通过分解问题得到答案

通过分解问题，其实就有点像动态规划的解题思路

**求解二叉树深度**

```javascript
function maxLength2 (tree) {
    if (tree === null) {
        return 0
    }

    const leftLen = maxLength2(tree.left)
    const rightLen = maxLength2(tree.right)

    return Math.max(leftLen, rightLen) + 1
}
```

### 1.4 总结

算法学习要举一反三，比如二叉树其可以衍生出很多的算法，比如动态规划，回溯，BFS等

## 2. 双指针技巧秒杀七道链表题（一）

#### 前言

自己写了一个`ListNode`的实现，用于后续的代码测试

```javascript
class ListNode {
    constructor(val, next) {
        this.val = val || 0
        this.next = next || null
    }

    /**
     * 
     * @param {number[]} nums 
     * @returns {ListNode}
     */
    static getSingleListNodeFromArray (nums) {
        if (!nums.length) return null;

        const start = new ListNode(0)
        let curr = start

        for (let i = 0; i < nums.length; i++) {
            curr.next = new ListNode(nums[i])
            curr = curr.next            
        }

        return start.next
    }

    /**
     * 
     * @returns {number[]}
     */
    getNodes () {
        let arr = [];
        let curr = this;

        while (curr !== null) {
            arr.push(curr.val)
            curr = curr.next
        }

        return arr
    }
}
```

### 2.1 合并两个有序链表

#### 2.1.1 题目链接

[力扣21](https://leetcode.cn/problems/merge-two-sorted-lists/)

#### 2.1.2 实现

使用双指针，分别对需要合并的两个数组进行跟踪即可

```javascript
var mergeTwoLists = function(list1, list2) {
    var newList = new ListNode()
    curr = newList

    while (list1 !== null && list2 !== null) {
        if (list1.val < list2.val) {
            curr.next = list1
            list1 = list1.next
        } else {
            curr.next = list2
            list2 = list2.next
        }

        curr = curr.next
    }

    if (list1 === null) {
        curr.next = list2
    }

    if (list2 === null) {
        curr.next = list1
    }

    return newList.next
};
```

### 2.2 单链表分解

#### 2.2.1 题目链接

[力扣86](https://leetcode.cn/problems/partition-list/)

#### 2.2.2 实现

1. 将原来的链表拆分成两个子链表

2. 遍历原链表将小于链表值的放到一个链表中，大于target的放到一个链表中

3. 连接两个链表即可

```javascript
var partition = function (head, x) {
  let min = new ListNode();
  let max = new ListNode();
  let curr = head,
    minHead = min,
    maxHead = max;

  if (head === null) {
    return null;
  }

  while (curr !== null) {
    if (curr.val >= x) {
      maxHead.next = curr;
      maxHead = maxHead.next;
    } else {
      minHead.next = curr;
      minHead = minHead.next;
    }
    curr = curr.next;
    maxHead.next = null;
    minHead.next = null
  }

  minHead.next = max.next

  return min.next;
};
```

### 2.3 合并k个有序链表

#### 2.3.1 题目链接

[力扣23](https://leetcode.cn/problems/merge-k-sorte)

#### 2.3.2 实现一：归并合并

1. 使用归并思路，不断将数组切分，

2. 通过两个链表合并的思路进行合并

3. 复杂度应该为`O(log n)`

```javascript
function mergeKLists(lists) {
    if (!lists.length) return null

    /**
     * 
     * @param {ListNode[]} lists 
     * @param {number} start 
     * @param {number} end
     * @returns {ListNode}
     */
    function _merge (lists, start, end) {
        if (end - start <= 1) {
            return lists[start]
        }

        const mid = (start + end) >> 1
        return mergeTwoLists(_merge(lists, start, mid), _merge(lists, mid, end))
    }

    return _merge(lists, 0, lists.length)
}
```

#### 2.3.3 实现二：最小堆合并

**题解**

1. 构建最小堆

2. 堆入栈是从下至上调整堆（插入元素放在堆底）

3. 堆出栈是从上至下调整堆（堆顶和堆底元素互换位置）

**最小堆的构建**

```javascript
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
}       right = curr * 2 + 1
        }

        return minVal
    }
}
```

**最小堆k个有序链表合成实现**

```javascript
function mergeKListsWithHeap(lists) {
    lists = list.filter(item => item !== null)
    if (!lists.length) return null
    const heap = new MinHeap(lists, (node) => {
        return node.val
    })
    const p = new ListNode()
    let dummy = p
    if (!lists.length) return null

    while(heap.value.length > 0) {
        let p = heap.pop()
        if (p === null) {
            continue;
        }
        dummy.next = p;
        dummy = dummy.next
        p = p.next
        if (p === null) {
            continue
        }
        heap.add(p)
    }

    return p.next
}
```

### 2.4 删除链表的倒数第n个节点

#### 2.4.1 题目链接

[力扣19](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

#### 2.4.2 题解思路（重要）

<mark>如何拿到倒数第K个节点呢？</mark>

1. 方法一：遍历两次，第一次获得链表长度，第二次找到n-k+1个节点

2. 方法二：
   
   1. 使用快慢指针，p1先走k步，然后p2和p1之后同时开始走n-k步（注意：此时p1到了k+1，p2才走出第一步）
   
   2. 当快指针走到null时
   
   3. 慢指针刚好走到n-k+1也就是倒数第n个节点上

![](https://labuladong.github.io/algo/images/%e9%93%be%e8%a1%a8%e6%8a%80%e5%b7%a7/2.jpeg)

#### 2.4.3 代码实现

根据上面的经验，如果要删除倒数第k个节点，这个时候我们需要得到的是第k个节点的前一个节点，因此只需要让p1走到k+1的时候，这个时候p2再走即可

```javascript
var removeNthFromEnd = function (head, n) {
    let p1 = head, p2 = null, step = 0

    while (p1 !== null) {
        p1 = p1.next;
        step++;
        if (step >= n + 1) {
            if (p2 === null) {
                p2 = head
            } else {
                p2 = p2.next
            }
        }
    }

    if (p2 === null) {
        head = head.next
    }

    if (p2 && p2.next !== null) {
        p2.next = p2.next.next
    }

    return head
};
```

#### 2.4.4 相关衍生

- 如何获取一个链表的中点
  
  - 快指针走2n，慢指针走n

- 如何判断有环 
  
  - 快指针2n去走，慢指针n的方式去走
  - 当快慢指针相等即使有环，快指针能走到null就无环

- 如何判断有环的链表的起点
  
  - 快指针2n去走，慢指针n取走
  
  - 碰到时，将慢指针指向head
  
  - 再次相遇的点就是有环链表的起点
  
  ![](https://labuladong.github.io/algo/images/%e5%8f%8c%e6%8c%87%e9%92%88/2.jpeg)
  
  因为两边离起点的距离都是`k-m`，所以也是利用了快慢指针的插值

### 2.5 判断两个链表是否相交

#### 2.5.1 题目链接

[力扣160](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

#### 2.5.2 代码实现

题解思路，因为两个链表长度不一样导致双指针无法同步，因此，我们只需要将双指针进行同步就行，如何同步？就是双指针的都完A/B两个链表。

```javascript
 var getIntersectionNode = function(headA, headB) {
    let p1 = headA, p2 = headB;

    let flag1 = false, flag2 = false

    while (p1 !== null && p2 !== null) {
        if (p1 === p2) {
            return p1
        }

        if (p1.next === null && !flag1) {
            p1 = headB
            flag1 = true
        } else {
            p1 = p1.next
        }

        if (p2.next === null && !flag2) {
            p2 = headA
            flag2 = true
        } else {
            p2 = p2.next
        }
    }

    return null
};
```

## 3. 双指针秒杀七道数组题目（二）

### 前言

对于数组和链表问题，一般使用`快慢指针`和`左右指针`两种技巧，快慢指针在`第二章`中已经有大量的例题，左右指针一般解决的是二分查找的问题

### 3.1 快慢指针技巧

#### 3.1.1 为什么

使用快慢指针的技巧可以让你在原地修改数组

#### 3.1.2 例题（一）删除有序数组中的重复项

##### 3.1.2.1 题目链接

[力扣26](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)

##### 3.1.2.2 代码实现

**题解思路**：

1. 使用快慢指针

2. 快指针一直向右

3. 当慢指针的值和快指针不同，慢指针向前走一步，将快指针对应的值赋值给慢指针

4. 最后满指针的位置就是所有非重复项

![](https://labuladong.github.io/algo/images/%e6%95%b0%e7%bb%84%e5%8e%bb%e9%87%8d/1.gif)

```javascript
var removeDuplicates = function(nums) {
    if (nums.length <= 1) {
        return nums.length
    }

    let slow = 0, fast = 0;

    while (fast < nums.length) {
        if (nums[fast] !== nums[slow]) {
            slow++
            nums[slow] = nums[fast]
        }

        fast++
    }

    return slow + 1
}
```

#### 3.1.3 例题（二）删除排序链表中的重复元素

##### 3.1.3.1 题目链接

[力扣83](https://leetcode.cn/problems/remove-duplicates-from-sorted-list/)

##### 3.1.3.2 代码实现

和3.1.2相同思路，快慢指针

```javascript
 var deleteDuplicates = function(head) {
    let slow = head, fast = head;

    if (head === null) {
        return null
    }

    while (fast !== null) {
        if (fast.val !== slow.val) {
            slow = slow.next;
            slow.val = fast.val
        }

        fast = fast.next
    }

    slow.next = null

    return head
};
```

#### 3.1.4 例题（三）移除元素

##### 3.1.4.1 题目链接

[力扣27](https://leetcode.cn/problems/remove-element/)

##### 3.1.4.2 代码实现

实现方式一样，不再赘述

```javascript
var removeElement = function(nums, val) {
    let slow = 0;

    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== val) {
            nums[slow] = nums[fast]
            slow++
        }
    }

    return slow
};
```

#### 3.1.5 移动零

##### 3.1.5.1 题目链接

[力扣283](https://leetcode.cn/problems/move-zeroes/)

##### 3.1.5.2 代码实现

一样的实现思路使用快慢指针并做交换

```javascript
 var moveZeroes = function(nums) {
    let slow = 0;

    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== 0) {
            [nums[slow], nums[fast]] = [nums[fast], nums[slow]]
            slow++
        }
    }
};
```

## 3.2 滑动窗口算法

### 3.2.1 滑动窗口代码框架

滑动窗口的原理也是快慢指针，其算法的大致框架如下：

```javascript
function(s) {
  let left = 0, right = 0
  let need = {}

  while(right < s.length) {
    const c1 = s[right]
    if (!need[c1]) {
      // 窗口内是否符合题目要求判断
    }

    while (窗口内判断条件用于收缩左指针) {
      left++
    }

    // 右边指针扩展
    right++
  }
};
```

### 3.2.2 题目一：无重复最长子字符串

#### 3.2.2.1 题目链接

[力扣3](https://leetcode.cn/problems/longest-substring-without-repeating-characters/submissions/)

#### 3.2.2.2 代码实现

**题解思路**：

1. 使用need来判断子串是否为无重复

2. 无重复字串就right++，并且不断更新最长的无重复子串

3. 如果是重复子串那么，这个时候左指针不断收缩，直到再次符合要求

**实现：**

```javascript
var lengthOfLongestSubstring = function (s) {
  let left = 0,
    right = 0,
    len = 0;
  let need = {};

  while (right < s.length) {
    const c1 = s[right];

    if (!need[c1]) {
      need[c1] = 1;
    } else {
      need[c1] = need[c1] + 1;
    }

    while (left <= right && need[c1] && need[c1] > 1) {
      if (need[s[left]]) {
        need[s[left]]--;
      }

      left++;
    }

    if (right - left + 1 > len) {
      len = right - left + 1;
    }

    right++;
  }
};
```



### 3.2.3 题目二：最小覆盖子串

#### 3.2.3.1 题目链接

[力扣76](https://leetcode.cn/problems/minimum-window-substring/)

#### 3.2.3.2 代码实现

**题解**

1. 滑动窗口右指针一直向右直到找到满足长度的最小子串

2. 找到子串后，做指针向右减小窗口，直到找到更小的符合条件的子串

3. 当左指针移到不满足长度的子串时停止，右指针继续向右



**实现**

```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
  let left = 0, right = 0, minStr = s
  let need = {}, slideWindow = {}

  // 初始化条件
  for (let i = 0; i < t.length; i++) {
    const char = t[i];
    if (!need[char]) {
      need[char] = 1
    } else {
      need[char] = need[char] + 1
    }
  }

  if (!isValidStr(getWindowCharMap(s))) {
    return ''
  }

  slideWindow = {}

  function isValidStr (slideWindow) {
    return Object.keys(need).reduce((match, key) => {
      return need[key] <= slideWindow[key] && match
    }, true)
  }

  /**
   * 
   * @param {string} str 
   * @return {boolean}
   */
  function getWindowCharMap (str) {
    const slideWindow = {}
    // @todo 这个地方可以做优化
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (!slideWindow[char]) {
        slideWindow[char] = 1
      } else {
        slideWindow[char] = slideWindow[char] + 1
      }
    }

    return slideWindow
  }

  while (right < s.length) {
    var c1 = s[right]

    if (slideWindow[c1]) {
      slideWindow[c1] = slideWindow[c1] + 1
    } else {
      slideWindow[c1] = 1
    }

    right++
    while(isValidStr(slideWindow) && left < right) {
      if (right - left < minStr.length) {
        minStr = s.slice(left, right)
      }

      c2 = s[left]
      if (slideWindow[c2] > 0) {
        slideWindow[c2] = slideWindow[c2] - 1
      }

      left++
    }
  }

  return minStr
};
```



## 3.3 左右指针算法

### 3.3.1 例题（一）二分查找

#### 3.3.1.1 二分查找使用条件

1. 数组

2. 有序

#### 3.3.1.2 代码实现

**题解**：

1. 中点值`mid`小于目标值，搜索范围为`[mid + 1, right]`

2. 中点值`mid`大于目标值，搜索范围为`[left, mid - 1]`

**实现**

```javascript
function binarySearch(nums, target) {
  let left = 0,
    right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    if (nums[mid] > target) {
      right = mid - 1;
      continue;
    }

    left = mid + 1;
  }

  return -1;
}
```



### 3.3.2 例题（二）两数之和

#### 3.3.2.1 题目链接

[力扣167](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)

#### 3.3.2.2 代码实现

**题解**：

1. 左右指针之和小于目标，左指针右移

2. 大于目标，右指针左移

**实现**

```javascript
var twoSum = function (numbers, target) {
  let left = 0,
    right = numbers.length - 1;

  while (left <= right) {
    const result = numbers[left] + numbers[right];
    if (result === target) {
      return [left + 1, right + 1];
    }

    if (result > target) {
      right--;
      continue;
    }

    left++;
  }
};
```

### 3.3.3 例题（三）反转字符串

##### 3.3.3.1题目链接

[力扣344](https://leetcode.cn/problems/reverse-string/submissions/)

##### 3.3.3.2 代码实现

```javascript
var reverseString = function(s) {
    let left = 0, right = s.length - 1

    if (s.length <= 1) return

    while (left <= right) {
        [s[left], s[right]] = [s[right], s[left]]
        left++
        right--
    }
};
```

### 3.4 中心向两侧扩展双指针

有时候我们找对称结构，需要通过从中心向两侧扩展的双指针策略

#### 3.4.1 例题（一）最长回文子串

##### 3.4.1.1 题目链接

[力扣5](https://leetcode.cn/problems/longest-palindromic-substring/)

##### 3.4.1.2 代码实现

**题解**：

1. 遍历

2. 然后从该节点向左右两边，如果左右两边的值相同，就是回文串

3. 回文串为奇数串，左指针起始位置和右指针相同

4. 回文串为偶数，右指针起始位置 = 左指针起始位置 + 1 

```javascript
var longestPalindrome = function(s) {
    let res = s[0]
    for (let i = 0; i < s.length - 1; i++) {
        const odd = expand(s, i);
        const even = expand(s, i, i + 1)

        console.log("i =>", i, " even =>", even, " odd => ", odd)

        if (res.length < odd.length) {
            res = odd
        }

        if (res.length < even.length) {
            res = even
        }
    }

    return res
};


function expand (s, l, r = l) {
    let left = l, right = r, str = s[left];
    while (left >= 0) {
        if (s[left] === s[right]) {
            str = s.slice(left, right + 1)
            left--;
            right++
        } else {
            return str
        }
    }
    
    return str
}
```
