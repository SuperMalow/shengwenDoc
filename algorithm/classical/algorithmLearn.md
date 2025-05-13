## Algorithm Learn Roadmap

### 基本数据结构的学习

#### 链表

1. 单链表

单链表主要操作有：在链表头插入一个数、将头节点进行删除、在第 k 个节点后插入一个数、删除第 k 个节点后的一个数。

```cpp
// 单链表模板
int head, e[N], ne[N], idx = 0;

// 初始化
void init()
{
    head = -1;
    idx = 0;
}

// 在链表头插入一个数
void insert(int x)
{
    e[idx] = x;
    ne[idx] = head;
    head = idx ++;
}

// 在第k个节点后插入一个数
void insert(int k, int x)
{
    e[idx] = x;
    ne[idx] = ne[k];
    ne[k] = idx ++;
}

// 将头节点删除
void remove()
{
    head = ne[head];
}

// 将第k个节点删除
void remove(int k)
{
    ne[k] = ne[ne[k]];
}

```

2. 双链表

双链表主要操作有：在链表头插入一个数、将头节点进行删除、在第 k 个节点后插入一个数、删除第 k 个节点后的一个数。

```cpp
int e[N], l[N], r[N], idx;

// 初始化
void init()
{
    r[0] = 1, l[1] = 0;
    idx = 2;
}

// 在节点a的右边插入一个数a
void insert(int a, int x)
{
    e[idx] = x;
    l[idx] = a;
    r[idx] = r[a];
    l[r[a]] = idx;
    r[a] = idx ++;
}

// 删除节点a
void remove(int a)
{
    l[r[a]] = l[a];
    r[l[a]] = r[a];
}
```

#### 哈希表原理及应用

1. 哈希表核心原理
2. 用链表加强哈希表
3. 用数组加强哈希表

#### 二叉树基础及遍历

1. 二叉树基础及常见类型
2. 二叉树的递归/层序遍历
3. 多叉树的递归/层序遍历
4. DFS 和 BFS 的应用
5. 二叉搜索树的应用

#### 二叉堆

1. 二叉堆的核心原理

#### 线段树

1. 线段树核心原理

#### 图结构

1. 图结构基础及实现
2. 图结构的 DFS/BFS

### 开始刷题

#### 链表

#### 数组

#### 队列/栈

#### 二叉树 & 递归思想

#### 二叉搜索树

#### 数据结构设计

#### 图算法

#### DFS 和回溯算法

#### BFS

#### 动态规划

#### 贪心算法

#### 分治算法

#### 数学专题

#### 经典面试题

#### 排序算法
