# 手刷链表算法

## 1. 双指针秒杀七道链表题目

### 例题一、合并两个有序链表

#### 原题

[力扣21](https://leetcode.cn/problems/merge-two-sorted-lists/)

#### 题解

+ 两个指针分别从两个链表头向右
+ 判断取较小的节点塞进新的链表
+ 只要其中一个链表遍历完成，剩下的链表直接接在新链表之后即可

#### 代码实现

```javascript
var mergeTwoLists = function(list1, list2) {
    const newList = new ListNode();
    let curr = newList

    while (list1 !== null && list2 !== null) {
        if (list1.val < list2.val) {
            curr.next = list1
            list1 = list1.next;
        } else {
            curr.next = list2;
            list2 = list2.next;
        }

        curr = curr.next
    }

    if (list1 !== null) {
        curr.next = list1
    }

    if (list2 !== null) {
        curr.next = list2
    }

    return newList.next
}
```

### 例题二、单链表分解

#### 原题链接

[力扣86](https://leetcode.cn/problems/partition-list/)

#### 题解
1. 创建两个链表，分别存储小于和大于目标值的节点
2. 遍历一次后将两个链表相连

#### 代码实现

```javascript
var partition = function (head, x) {
    let l1 = new ListNode();
    let l2 = new ListNode();
    let curr = head

    let dummy1 = l1;
    let dummy2 = l2

    while (curr !== null) {
        if (curr.val >= x) {
            dummy2.next = curr;
            dummy2 = dummy2.next
        } else {
            dummy1.next = curr
            dummy1 = dummy1.next;
        }

        curr = curr.next
    }

    dummy2.next = null;
    dummy1.next = l2.next

    return l1.next
}
```

### 例题三、合并K个有序链表

#### 原题链接

[力扣23](https://leetcode.cn/problems/merge-k-sorted-lists/)

#### 题解

1. 递归 + 归并
2. 两两分别合成，将k个问题分解成合并两个有序链表的子问题

#### 代码实现

```javascript
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
    const len = lists.length;
    const mid = Math.floor(len / 2)

    switch (len) {
        case 0:
            return null
        case 1:
            return lists[0]
        case 2:
            return mergeTwoList(lists[0], lists[1])

        default:
            return mergeTwoList(
                mergeKLists(lists.slice(0, mid)),
                mergeKLists(lists.slice(mid))
            )
    }
}

/**
 * @param {ListNode} list
 * @param {ListNode} list
 * @return {ListNode}
 */
function mergeTwoList(l1, l2) {
    const head = new ListNode();
    let curr = head
    let dummy1 = l1, dummy2 = l2;

    while (dummy1 !== null && dummy2 !== null) {
        if (dummy1.val < dummy2.val) {
            curr.next = dummy1;
            dummy1 = dummy1.next;
        } else {
            curr.next = dummy2;
            dummy2 = dummy2.next;
        }

        curr = curr.next;
    }

    if (dummy1 !== null) {
        curr.next = dummy1
    }

    if (dummy2 !== null) {
        curr.next = dummy2
    }

    return head.next
}
```

### 例题四、单链表的第k个节点

#### 原题链接

力扣无，作者单独出的

#### 题解

1. 使用快慢指针，快指针先向右k个位置，慢指针启动
2. 当快指针到链表末尾，慢指针所在位置即倒数第k个节点

#### 代码实现

```javascript
function findFromEnd(head, k) {
    let dummy1 = head, dummy2 = head;
    let i = 0;

    while (i < k) {
        dummy1 = dummy1.next;
        i++;
    }

    while (dummy1 !== null) {
        dummy1 = dummy1.next;
        dummy2 = dummy2.next
    }

    return dummy2
}
```

### 例题五、删除链表的第N个节点

#### 题解

1. 使用上述的方法找到第N个节点，并记住前一个节点
2. 断开该节点即可

#### 代码实现

```javascript
var removeNthFromEnd = function (head, n) {
    let dummy1 = head, dummy2 = head, prev = null
    let i = 0;

    while (dummy1 !== null) {
        dummy1 = dummy1.next;

        if (i < n) {
            i++;
        } else {
            prev = dummy2
            dummy2 = dummy2.next;
        }
    }

    if (prev === null) {
        head = head.next
    } else {
        prev.next = prev.next === null ? null : prev.next.next;
    }

    return head
}
```

### 例题六、单链表的中点

#### 原题链接

[力扣876](https://leetcode.cn/problems/middle-of-the-linked-list/)

#### 题解

1. 快慢指针，快指针走两次，慢指针走一次
2. 快指针到底，慢指针在一半的位置

#### 代码实现

```javascript
var middleNode = function(head) {
    let fast = head, slow = head;
    let count = 0;
    while(fast !== null) {
        fast = fast.next;
        count++;

        if (!(count % 2)) {
            slow = slow.next;
        }
    }

    return slow;
};
```

### 例题七、判断链表是否有环

#### 题解

1. 快慢指针，快指针
2. 快指针走2次，慢指针走一次
3. 快慢指针如果能会合就是有环，否则则没有

#### 代码实现

```javascript
function hasCycle (head) {
    let slow = head, fast = head;

    while (fast !== null || fast.next !== null) {
        fast = fast.next.next;
        slow = slow.next

        if (fast === slow) {
            return false
        }
    }

    return false
}
```


## 2. 反转链表算法

### 例题一、反转链表

#### 原题链接

[力扣206](https://leetcode.cn/problems/reverse-linked-list/)

#### 题解

更换前后两个节点的链接关系

#### 解法一、常规方法

```javascript
var reverseList = function(head) {
    if (head === null || head.next === null) {
        return head;
    }

    let _head = head;
    let _next = head.next;

    while (_next !== null) {
        if (_head === head) {
            _head.next = null
        }

        let nextNode = _next.next;
        _next.next = _head
        _head = _next;
        _next = nextNode
    }

    return _head
}
```

#### 解法二、递归方法

```javascript
var reverseList = function(head) {
    if (head == null || head.next == null) {
        return head;
    }

    const reverse = reverseList(head.next);

    head.next.next = head
    head.next = null

    return reverse
}
```

### 例题二、反转链表Ⅱ

#### 原题链接

[力扣92](https://leetcode.cn/problems/reverse-linked-list-ii/)

#### 解法一、常规方法

```javascript
var reverseBetween = function(head, left, right) {
    let start = head;
    let prev = null;
    let i = 1;

    if (head === null || head.next === null) {
        return head
    }

    while (i < left) {
        prev = start;
        start = start.next;
        i++;
    }

    let _curr = start;
    let _next = _curr.next;

    while (i < right) {
        // p1 => p2 => p3 => p4
        let next = _next;
        _next = _next.next
        next.next = _curr;
        _curr = next
        i++
    }

    if (prev === null) {
        head.next = null;
        start.next = _next
        return _curr
    } else {
        prev.next = _curr;
        start.next = _next;
    }

    return head
};
```

#### 解法二、递归解法

```javascript
var reverseBetween = function(head, left, right) {
    let i = 0;
    let start = head, prev = head;
    while(i < left - 1) {
        prev = start;
        start = start.next;
        i++;
    }

    let end = start;
    while (i < right - 1) {
        end = end.next;
        i++
    }

    const next = end.next;
    end.next = null;

    const re = reverse(start);

    if (left === 1) {
        start.next = next
        return re
    }

    prev.next = re
    start.next = next;

    return head
}

/**
 * @param {ListNode} head
 */
function reverse (head) {
    if (head === null || head.next === null) {
        return head
    }

    const re = reverse(head.next);
    head.next.next = head;
    head.next = null

    return re
}
```
