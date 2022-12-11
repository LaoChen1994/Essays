# 核心框架汇总

- [核心框架汇总](#核心框架汇总)
  - [1. 刷题心得](#1-刷题心得)
    - [1.1 算法的本质](#11-算法的本质)
      - [1.1.1穷举的难点](#111穷举的难点)
    - [1.2 数组/单链表算法](#12-数组单链表算法)
    - [1.3 二叉树系列算法](#13-二叉树系列算法)
      - [1.3.1 二叉树递归解法的思路](#131-二叉树递归解法的思路)
      - [1.3.2 遍历二叉树得到结果](#132-遍历二叉树得到结果)
      - [1.3.3 通过分解问题得到答案](#133-通过分解问题得到答案)
    - [1.4 总结](#14-总结)
  - [2. 双指针技巧秒杀七道链表题（一）](#2-双指针技巧秒杀七道链表题一)
    - [前言](#前言)
      - [2.1 合并两个有序链表](#21-合并两个有序链表)
    - [2.1.1 题目链接](#211-题目链接)
    - [2.1.2 实现](#212-实现)
      - [2.2 单链表分解](#22-单链表分解)
    - [2.2.1 题目链接](#221-题目链接)
    - [2.2.2 实现](#222-实现)
      - [2.3 合并k个有序链表](#23-合并k个有序链表)
    - [2.3.1 题目链接](#231-题目链接)
    - [2.3.2 实现一：归并合并](#232-实现一归并合并)
    - [2.3.3 实现二：最小堆合并](#233-实现二最小堆合并)
      - [2.4 删除链表的倒数第n个节点](#24-删除链表的倒数第n个节点)
    - [2.4.1 题目链接](#241-题目链接)
    - [2.4.2 题解思路（重要）](#242-题解思路重要)
    - [2.4.3 代码实现](#243-代码实现)
    - [2.4.4 相关衍生](#244-相关衍生)
      - [2.5 判断两个链表是否相交](#25判断两个链表是否相交)
    - [2.5.1 题目链接](#251-题目链接)
    - [2.5.2 代码实现](#252-代码实现)
  - [3. 双指针秒杀七道数组题目（二）](#3-双指针秒杀七道数组题目二)
    - [前言](#前言-1)
    - [3.1 快慢指针技巧](#31-快慢指针技巧)
      - [3.1.1 为什么](#311-为什么)
      - [3.1.2 例题（一）删除有序数组中的重复项](#312-例题一删除有序数组中的重复项)
        - [3.1.2.1 题目链接](#3121-题目链接)
        - [3.1.2.2 代码实现](#3122-代码实现)
      - [3.1.3 例题（二）删除排序链表中的重复元素](#313-例题二删除排序链表中的重复元素)
        - [3.1.3.1 题目链接](#3131-题目链接)
        - [3.1.3.2 代码实现](#3132-代码实现)
      - [3.1.4 例题（三）移除元素](#314-例题三移除元素)
        - [3.1.4.1 题目链接](#3141-题目链接)
        - [3.1.4.2 代码实现](#3142-代码实现)
      - [3.1.5 移动零](#315-移动零)
        - [3.1.5.1 题目链接](#3151-题目链接)
        - [3.1.5.2 代码实现](#3152-代码实现)
  - [3.2 滑动窗口算法](#32-滑动窗口算法)
    - [3.2.1 滑动窗口代码框架](#321-滑动窗口代码框架)
    - [3.2.2 题目一：无重复最长子字符串](#322-题目一无重复最长子字符串)
      - [3.2.2.1 题目链接](#3221-题目链接)
      - [3.2.2.2 代码实现](#3222-代码实现)
    - [3.2.3 题目二：最小覆盖子串](#323-题目二最小覆盖子串)
      - [3.2.3.1 题目链接](#3231-题目链接)
      - [3.2.3.2 代码实现](#3232-代码实现)
  - [3.3 左右指针算法](#33-左右指针算法)
    - [3.3.1 例题（一）二分查找](#331-例题一二分查找)
      - [3.3.1.1 二分查找使用条件](#3311-二分查找使用条件)
      - [3.3.1.2 代码实现](#3312-代码实现)
    - [3.3.2 例题（二）两数之和](#332-例题二两数之和)
      - [3.3.2.1 题目链接](#3321-题目链接)
      - [3.3.2.2 代码实现](#3322-代码实现)
    - [3.3.3 例题（三）反转字符串](#333-例题三反转字符串)
      - [3.3.3.1题目链接](#3331题目链接)
      - [3.3.3.2 代码实现](#3332-代码实现)
    - [3.4 中心向两侧扩展双指针](#34-中心向两侧扩展双指针)
      - [3.4.1 例题（一）最长回文子串](#341-例题一最长回文子串)
        - [3.4.1.1 题目链接](#3411-题目链接)
        - [3.4.1.2 代码实现](#3412-代码实现)

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

### 3.2 滑动窗口算法

#### 3.2.1 滑动窗口代码框架

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

#### 3.2.2 题目一：无重复最长子字符串

##### 3.2.2.1 题目链接

[力扣3](https://leetcode.cn/problems/longest-substring-without-repeating-characters/submissions/)

##### 3.2.2.2 代码实现

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

#### 3.2.3 题目二：最小覆盖子串

##### 3.2.3.1 题目链接

[力扣76](https://leetcode.cn/problems/minimum-window-substring/)

##### 3.2.3.2 代码实现

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

### 3.3 左右指针算法

#### 3.3.1 例题（一）二分查找

##### 3.3.1.1 二分查找使用条件

1. 数组

2. 有序

##### 3.3.1.2 代码实现

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

#### 3.3.2 例题（二）两数之和

##### 3.3.2.1 题目链接

[力扣167](https://leetcode.cn/problems/two-sum-ii-input-array-is-sorted/)

##### 3.3.2.2 代码实现

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

#### 3.3.3 例题（三）反转字符串

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

## 4. 二叉树（纲领篇）

### 4.1 前言

#### 4.1.1二叉树基础思路

二叉树解题基本思路：

1. 是否可以通过一遍二叉树遍历得到结果

2. 是否可以通过子问题答案推到出原问题的答案

#### 4.1.2 二叉树生成的简单实现

为了便于后续测试二叉树题目中的用例

```javascript
class Node {
  constructor (val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  /**
   * 
   * @param {number[]} nums
   * @returns {Node}
   */
  static getTreeFromArray (nums) {
    const len = nums.length;
    nums.unshift(0)
    if (len === 0) return null

    const root = insertRoot(1)

    /**
     * 
     * @param {Node} node 
     * @param {number} idx 
     * @returns 
     */
    function insertRoot (idx) {
      while (idx > len) {
        return null
      }

      const node = new Node(nums[idx])
      node.left = insertRoot(2*idx)
      node.right = insertRoot(2 * idx+1)

      return node
    }

    return root
  }
}
```

#### 4.1.2 二叉树的遍历

##### 4.1.2.1 遍历顺序

- 先序遍历：父节点 => 左节点 =>右节点

- 中序遍历：左节点 =>  父节点 => 右节点

- 后序遍历：左节点 => 右节点 => 父节点

##### 4.1.2.2 代码实现

在代码实现中，就是在哪里将对应遍历到的根节点存进去位置不同

**先序遍历**

```javascript
function preorder (tree) {
    let res = []

    function traverse (root) {
        if (root === null) {
            return
        }

        res.push(root.val)
        traverse(root.left)
        traverse(root.right)
    }

    traverse(tree)

    return res
}
```

**中序遍历**

```javascript
function midorder (tree) {
    let res = [];

    /**
     * 
     * @param {BinarySearchTree} node 
     */
    function traverse(node) {
        if (node === null) {
            return
        }

        traverse(node.left)
        res.push(node.val)
        traverse(node.right)
    }

    traverse(tree)

    return res
}
```

**后序遍历**

```javascript
function postorder (tree) {
    let res = []

    /**
     * 
     * @param {BinarySearchTree} subtree 
     */
    function traverse (subtree) {
        if (subtree === null) {
            return;
        }

        traverse(subtree.left)
        traverse(subtree.right)
        res.push(subtree.val)
    }

    traverse(tree)

    return res
}
```

### 4.2 深入理解前中后序

【重要】上述算法中的`traverse`其实就是一个比递归遍历的方法，是二叉链表的遍历方式，要把<mark>前序中序后序分别理解成遍历时候的三个位置</mark>。

**前序遍历**：代表记录刚进入节点时候的位置，在traverse下一个节点之前

**后序遍历**：代表刚离开节点时候的位置，在traverse下一个节点之后

##### 4.2.1 如何从后往前输出一个链表

答案：使用后序遍历的方式

```javascript
function reverse(node) {
  const res = [];

  /**
   *
   * @param {ListNode} node
   */
  function traverse(node) {
    if (node === null) return;

    traverse(node.next);
    res.push(node.val)
  }

  traverse(node)

  return res
}
```

##### 4.2.2 二叉树解决问题的思路

二叉树解决问题的思路，就是在前中后序的位置注入巧妙的代码逻辑，达到我们想要的目的，其他的我们不用去管，交给二叉树的遍历框架去做

### 4.3 两种解题思路

#### 4.3.1 解题思路

二叉树对应的两种解题思路：

1. 遍历一遍二叉树得出答案（回溯）

2. 通过分解问题得出答案（动态规划）

#### 4.3.2 例题（一）二叉树的最大深度

##### 4.3.2.1 题目链接

[力扣104](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)

##### 4.3.2.2 代码实现

**使用回溯的方式**

```javascript
var maxDepth = function(root) {
    let max = 0, curr = 0
    if (root === null) {
        return 0
    }

    function traverse (node) {
        if (node === null) {
            return
        }

       curr++
       traverse(node.left)
       traverse(node.right)
       max = Math.max(curr, max)
       curr--
    }

    traverse(root)

    return max
};
```

**使用分解的方式**

```javascript
var maxDepth = function(root) {
    if (root === null) {
        return 0
    }

    function traverse (node, depth) {
        if (node === null) {
            return depth
        }

       return Math.max(traverse(node.left, depth + 1), traverse(node.right, depth + 1))
    }

    return traverse(root, 0)
};
```

#### 4.3.3 遇到二叉树问题的思考过程

1. 是否可以通过遍历一次二叉树得到答案

2. 是否可以定义一个递归函数，用子问题解决得出答案（一定要给traverse设置合理的定义和返回值，在后序位置写代码）

【重点】明白应该在前中后哪个阶段去写

#### 4.3.4 例题（二）二叉树的直径

##### 4.3.4.1 题目链接

[力扣543](https://leetcode.cn/problems/diameter-of-binary-tree/)

##### 4.3.4.2 代码实现

```javascript
  function traverse(node) {
    if (node === null) {
      return 0
    }

    const left = traverse(node.left)
    const right = traverse(node.right)

    // 目的是为了获取某个节点左右子树节点之和
    max = Math.max(max, left + right + 1)

    // 对于上一级子树来说，希望拿到这个分支最大的节点数
    return Math.max(left, right)
  }

  traverse(root);

  return max;
};;
};;

  return max;
};
```

#### 4.3.5 例题（三）层序遍历

层序遍历故名思意就是按层遍历树结构，也就是所说的BFS算法的基础

##### 4.3.5.1 代码实现

```javascript
function levelTraverse (node) {
    let res = [], stack = []

    /**
     * 
     * @param {Node} root 
     */
    function traverse (root) {
        if (root !== null) {
            res.push(root.val);
            stack.push(root.left)
            stack.push(root.right)
        }

        let node = stack.shift()
        if (node !== null) {
            traverse(node)
        }
    }

    traverse(node)

    return res
}
```

## 5. 动态规划题解套路框架

### 5.1 前言

#### 5.1.1 什么时候用动态规划

动态规划一般是求最值的问题，比如最长子序列，最短编辑距离等，一般具有几个特点：

1. 具备最优子结构

2. 具有重叠子问题

3. 能找到正确的状态转移方程

#### 5.1.2 动态规划的核心

动态规划的核心就是穷举

#### 5.1.3 找到状态转移方程的方式

1. 备忘录（缓存）

2. DP Table

#### 5.1.4 动态规划的格式

**自上而下分解子问题**

一般使用备忘录法记录可能重复计算的子问题

```javascript
let cache = {}
function dp(状态1, 状态2, ...) {
    if (cache[状态xx]) return cache[状态xxx]
    let result;
    for 选择 of 所有选择 {
        cache[状态xx] = result = 最值(result, dp(状态1, 状态2, ...))
    }
    return result
}
```

**自下而上解决问题**

一般多用DP Table推导对应的状态转移方程

```javascript
dp[0][0] = base

for 状态1 of 状态1取值:
    for 状态2 of 状态2取值:
        for ....
            dp[状态1][状态2][...] = 求最值(选择1, 选择2,...)
```

### 5.2 例题（一）斐波那契数列

#### 5.2.1 题目链接

[力扣509](https://leetcode.cn/problems/fibonacci-number/)

#### 5.2.2 自下而上解决

从最小的1，2，3步骤逐步向上枚举

```javascript
let dp = [0, 1]
var fib = function(n) {
    if (n <= 0) return dp[n]
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 2] + dp[i - 1]
    }

    return dp[n]
};
```

#### 5.2.3 自上而下解决

根据题目给的状态方程从上而下分解成子问题求解，并做好缓存

```javascript
var fib = function(n) {
    if (cache[n] !== undefined) return cache[n]
    cache[n] = fib(n - 2) + fib(n - 1)
    return cache[n]
};
```

### 5.3 例题（二）凑零钱问题

#### 5.3.1 题目链接

[力扣322](https://leetcode.cn/problems/coin-change/)

#### 5.3.2 代码实现

**题解**

1. 找到临界点的值：amount等于0和小于0时候的场景

2. 找到放弃子问题的边界，就是amount = 0

3. 找到状态转移方程
   
   ![](https://labuladong.github.io/algo/images/%e5%8a%a8%e6%80%81%e8%a7%84%e5%88%92%e8%af%a6%e8%a7%a3%e8%bf%9b%e9%98%b6/coin.png)

```javascript
var coinChange = function (coins, amount) {
  const dp = [];

  function t(coins, amount) {
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    if (dp[amount]) return dp[amount];

    let min = Number.MAX_SAFE_INTEGER;

    for (const coin of coins) {
      let count = t(coins, amount - coin);
      if (count === -1) continue
      min = Math.min(min, count + 1);
    }

    dp[amount] = min === Number.MAX_SAFE_INTEGER ? -1 : min;

    return dp[amount];
  }

  return t(coins, amount)
};
  return t(coins, amount)
};
```

## 6. BFS算法解体套路框架

### 6.1 BFS遍历算法框架

**题解**：

1. 使用队列的数据结构

2. 使用visited来判断如果是图结构是否节点重新走了

3. 每次遍历当前队列的节点数量代表是同层节点

4. 同层遍历完成后深度+1

```javascript
function bfs (root, target) {
    const queue = []
    const visited = new Set();

    queue.push(root);
    visited.add(root);
    let step = 0

    while (queue.length) {
        let len = queue.length;

        for (let i = 0; i < len; i++) {
            const curr = queue.shift()

            // 提前终止循环的条件
            // 比如找到目标节点
            if (curr === target) {
                return step
            }

            // 这里的adj指的是将该节点周围的所有节点都获取的方法，不一定都是adj
            // 插入其所有相邻节点
            for (const NODE of curr.adj()) {
                if (!visited.has(NODE)) {
                    queue.push(NODE)
                }
            }
        }

        // 到这里说明同层节点都遍历完成，所以深度+1
        step++
    }
}
```

### 6.2 例题（一）二叉树的最小高度

#### 6.2.1 题目链接

[力扣111](https://leetcode.cn/problems/minimum-depth-of-binary-tree/submissions/)

#### 6.2.2 代码实现

**题解**

1. 提前结束循环的条件：为叶子节点（其左右节点都为null）

2. 所有相邻节点的方法：`node.left`,`node.right`

**实现**

```javascript
var minDepth = function (root) {
    let queue = []
    let depth = 1

    if (root === null) {
        return 0
    }

    queue.push(root);

    while(queue.length) {
        const len = queue.length;

        for (let i = 0; i < len; i++) {
            const node = queue.shift();

            if (node.left === null && node.right === null) {
                // 节点为空说明这个时候 
                return depth
            }


            if (node.left !== null) {
                queue.push(node.left)
            }

            if (node.right !== null) {
                queue.push(node.right)
            }
        }

        depth++
    }
};
```

### 6.3 BFS的几个说明

#### 6.3.1 为什么BFS可以找到最短距离

因为BFS每次操作Depth，所有节点都向前走了一步，保证了每个节点齐头并进的，但如果是DFS，如果是最后一个子树的节点是最短高度，要遍历整颗树，DFS是线，而BFS是面

#### 6.3.2 DFS和BFS分别的优点

1. BFS空间复杂度较高，二叉树最小高度的复最坏复杂度O(n)

2. DFS时间复杂度较高，但是空间复杂度不高，以刚才的题目为例，复杂度为O(log n)

### 6.4 例题（二）解开密码锁的最小次数

#### 6.4.1 题目链接

[力扣752](https://leetcode.cn/problems/open-the-lock/)

#### 6.4.2 代码实现

**题解：**

1. 每个字母的上下变动就好像是可以认为是该节点的相邻节点

2. 因此可以通过BFS来遍历遍历对应的节点的内容

3. 一旦找到一定是最短的达到距离直接返回即可

4. 使用BFS解题模板即可

5. 关键的边界条件，如果是"0000"是deadcode，那就直接放弃了，因为都无法开始搜索任意相邻节点

```javascript
function openLock(deadends, target) {
  const queue = [];
  const visited = new Set([...deadends]);
  const start = "0000";
  let step = 0;
  let min = Number.MAX_SAFE_INTEGER;

  if (visited.has("0000")) return -1;

  queue.push(start);
  visited.add(start);

  while (queue.length) {
    const len = queue.length;

    for (let i = 0; i < len; i++) {
      const element = queue.shift();

      // 找到目标退出当前位置
      if (element === target) {
        return step;
      }

      for (let j = 0; j < element.length; j++) {
        const [prev, next] = getSiblings(element, j);

        if (!visited.has(prev) && !deadends.includes(prev)) {
          visited.add(prev);
          queue.push(prev);
        }

        if (!visited.has(next) && !deadends.includes(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }

    step++;
  }

  return min === Number.MAX_SAFE_INTEGER ? -1 : step;
}

/**
 *
 * @param {string} str
 * @param {number} idx
 * @return {string[]}
 */
function getSiblings(str, idx) {
  let prev = getSiblingValue(+str[idx] - 1);
  let next = getSiblingValue(+str[idx] + 1);

  return [replaceStrByIdx(str, idx, prev), replaceStrByIdx(str, idx, next)];
}

function getSiblingValue(value) {
  if (value < 0) return 9;
  if (value > 9) return 0;

  return value;
}

/**
 *
 * @param {string} str
 * @param {number} idx
 * @param {string} value
 * @return {string}
 */
function replaceStrByIdx(str, idx, value) {
  if (idx === 0) return `${value}${str.slice(1)}`;
  return `${str.slice(0, idx)}${value}${str.slice(idx + 1)}`;
}
```

### 6.5 双向BFS优化

#### 6.5.1 为何要双向奔赴

从算法复杂度来看，BFS需要遍历同层的所有节点，所以如果答案在最底部，需要遍历整棵树，但是如果双向BFS，只需要遍历半棵树，就能找到交集，所以空间复杂度会更低O(log n)，但时间复杂度都是O(n)

#### 6.5.2 解开密码锁的最小次数的双向BFS实现

略，因为双向BFS实现其实并不是都能使用的，必须直到终点，有场景限制，目前只要知道BFS的算法框架即可

## 7. 二分搜索

### 7.1 二分查找的坑

二分查找主要的坑在于：

1. mid找到后，搜索区间是mid+1还是mid-1

2. while循环中是用<= 还是用<

#### 7.2 二分查找框架

```javascript
function binarySearch(nums, target) {
  let left = 0,
    right = nums.length;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      // 找到目标做的操作
      ...
    } else if (nums[mid] < target) {
      // 左指针移动
      left = ...;
    } else if (nums[mid] > target) {
      // 右指针移动
      right = ...;
    }
  }

  return -1;
}
```

### 7.3 例题（一）寻找有序列表中的一个数

#### 7.3.1 题目链接

[力扣704](https://leetcode.cn/problems/binary-search/)

#### 7.3.2 代码实现

**题解**

1. 搜索区间为[left, right]这个闭区间所以right是`nums.length - 1`，避免越界

2. 

```javascript
function binarySearch(nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      // 找到目标做的操作
      return mid;
    } else if (nums[mid] < target) {
      // 左指针移动
      left = mid + 1;
    } else if (nums[mid] > target) {
      // 右指针移动
      right = mid - 1;
    }
  }

  return -1;
}
```

### 7.4 在排序数组中查找元素的第一个和最后一个位置

#### 7.4.1 题目链接

[力扣34](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/submissions/)

#### 7.4.2 方法（一）一次遍历找到后，左右扩展找节点

这种方式虽然能做出来，但是复杂度就不是`log(n)`

```javascript
var searchRange = function(nums, target) {
    if (!nums.length) return [-1, -1]
    const idx = binarySearch(nums, target)
    if (idx === -1) return [-1, -1];

    let start = idx, end = idx;

    while (start > 0) {
        if (nums[start - 1] === target) {
            start--
        } else {
            break;
        }
    }

    while (end < nums.length) {
        if (nums[end + 1] === target) {
            end++
        } else {
            break;
        }
    }

    return [start, end]
};

function binarySearch(nums, target) {
  let left = 0,
    right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
      // 找到目标做的操作
      return mid;
    } else if (nums[mid] < target) {
      // 左指针移动
      left = mid + 1;
    } else if (nums[mid] > target) {
      // 右指针移动
      right = mid - 1;
    }
  }

  return -1;
}
```

#### 7.4.3 使用边界二分搜索方法

**题解**：

1. 左边界的寻找，就是在mid的值和右值相同的时候，搜索右边界到`mid - 1`

2. 右边界的寻找，就是在mid和左值相同的时候，搜索左边界收缩到`mid + 1`

3. 之后返回的边界中`right + 1`就是左边界，`left - 1`就是右边界

```javascript
var searchRange = function(nums, target) {
    if (!nums.length) return [-1, -1]

    const left = searchBoundLeft(nums, target);
    const right = searchBoundRight(nums, target, false);

    return [left, right]
};

/**
 * @param {number[]} nums
 * @param {number} target
 * @param {boolean} isLeft
 * @return {number[]}
 */
function searchBoundLeft (nums, target) {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        if (nums[mid] === target) {
            right = mid - 1
        } else if (nums[mid] > target) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    return nums[right + 1] === target ? right + 1 : -1
}

/**
 * @param {number[]} nums
 * @param {number} target
 * @param {boolean} isLeft
 * @return {number[]}
 */
 function searchBoundRight (nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2)

        if (nums[mid] === target) {
            left = mid + 1
        } else if (nums[mid] > target) {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }

    return nums[left - 1] === target ? left - 1 : -1
 }
```

## 8. 滑动窗口纲领篇

### 8.1 算法框架

双指针的第三种技巧，**滑动窗口的代码模板如下：**

```javascript
function slideWindow (arr) {
    let left = 0, right = 0, window = []

    while (right < arr.length) {
        window.push(arr[right])
        // 扩展右边界
        right++;

        // 对是否满足题目条件进行判断

        while (conditionShrink) {
            // 收缩左边边界
            window.shift()
            left++
        }
    }
}
```

### 8.2 例题（一）最小覆盖子串

**题解**：

1. 初始化达到所需要达到的条件map，知道每个字母都需要出现几次

2. 右指针不停右移，直到找到符合条件的子串

3. 左指针当满足条件时右移，直到拿到符合条件的最小子串

```javascript
/**
* @param {string} s
* @param {string} t
* @return {string}
*/
var minWindow = function(s, t) {
    // build need
    let need = {}
    let curr = {}
    let maxStr = "";

    for (let i = 0; i < t.length; i++) {
        const key = t[i];
        if (!need[key]) {
            need[key] = 1
        } else {
            need[key] += 1
        }
    }

    let left = 0;

    for (let right = 0; right < s.length; right++) {
        const ch = s[right];
        need[ch] && (!curr[ch] ? (curr[ch] = 1) : (curr[ch]++));

        if (!need[ch]) {
            continue;
        }

        if (need[ch] && need[ch] > curr[ch]) {
            continue
        }

        if (isSame(need, curr)) {
            // 相同场景左指针收缩
            while (true) {
                if (!maxStr || right - left + 1 < maxStr.length) {
                    maxStr = s.slice(left, right+1)
                } 

                const leftChar = s[left];
                curr[leftChar]--;
                left++;

                if (need[leftChar] && curr[leftChar] < need[leftChar]) {
                    break
                }
            }
        }

    }

    return maxStr
}

/**
 * 
 * @param {object} need 
 * @param {object} win 
 * @return {boolean}
 */
function isSame (need, win) {
    const keys = Object.keys(need);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (!win[key] || need[key] > win[key]) {
            return false
        }
    }

    return true
}
```

### 8.2 例题（二）字符串排列

**题解**：

1. 如果窗口宽度等于匹配宽度就进行判断是否是排列组合

2. 如果不匹配，左指针向右收缩直到左指针字母在need内

3. 不满足1直接右指针不断向右

**代码实现**

```javascript
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function (s1, s2) {
  const need = buildNeed(s1);
  let curr = {};
  let left = 0;

  for (let right = 0; right < s2.length; right++) {
    const ch = s2[right];
    if (need[ch]) {
        curr[ch] ? (curr[ch]++)  : (curr[ch] = 1);
    }

    if (right - left + 1 === s1.length) {
      if (isSame(need, curr)) {
        return true
      }

      do {
        curr[s2[left]]--;
        left++;

        if (need[s2[left]]) {
          // 在其中说明后面的可能会是s2的排列组合
          break
        }
      } while (left < right);
    }
  }
  return false;
};

/**
 * 
 * @param {object} need 
 * @param {object} win 
 * @return {boolean}
 */
function isSame (need, win) {
    const keys = Object.keys(need);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        
        if (!win[key] || need[key] > win[key]) {
            return false
        }
    }

    return true
}

/**
 *
 * @param {string} s
 */
function buildNeed(s) {
  let need = {};

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    need[ch] ? need[ch]++ : (need[ch] = 1);
  }

  return need;
}

```

### 8.3 例题（三）找到所有字母异位词

**题解**

和上一题类似，不一样的是需要在遍历中存下符合条件的左指针



**代码实现**

```javascript
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function(s, p) {
    const need = buidMap(p)
    const curr = {}
    let left = 0;
    let len = p.length;
    let res = []

    for (let right = 0; right < s.length; right++) {
        const ch = s[right];

        if (curr[ch]) {
            curr[ch]++
        } else {
            curr[ch] = 1
        }
        
       if (right - left + 1 === len) {
            while(left <= right) {
                // 初次匹配
                if (right - left + 1 === len) {
                    if (isSame(need, curr)) {
                        res.push(left)
                    }
                } else {
                    // 开始收缩
                    // 如果收缩值仍在value中，指针右移
                    if (need[s[left]]) {
                        break
                    }
                }

                curr[s[left]]--
                left++
            }
        }
    }

    return res
};

/**
 * 
 * @param {object} need 
 * @param {object} win 
 * @return {boolean}
 */
function isSame (need, win) {
    const keys = Object.keys(need);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        
        if (!win[key] || need[key] > win[key]) {
            return false
        }
    }

    return true
}

/**
 * 
 * @param {string} s 
 * @returns {object}
 */
function buidMap (s) {
    const m = {};

    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (m[ch]) {
            m[ch]++
        } else {
            m[ch] = 1
        }
    }

    return m
}

```



### 8.4 例题（四）无重复字符的最长子串

**题解**

1. 每次只要是map中没有的参数就右指针后移

2. 当出现map中存在的元素，左指针收缩置和右指针相同的元素为止



**代码实现**

```javascript
var lengthOfLongestSubstring = function (s) {
  let left = 0;
  let max = 0, map = new Map();

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (!map.get(ch)) {
      map.set(ch, 1);
      if (right - left + 1 > max) {
        max = right - left + 1
      }
    } else {
      // 左边收缩
      while(left <= right) {
        if (ch === s[left]) {
          left++;
          break;
        } else {
          map.delete(s[left])
          left++;
        }
      }
    }
  }

  return max
};

```
