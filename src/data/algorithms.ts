export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  tags: string[];
  stub: string;
  solution: string;
  hint?: string;
  testCases?: { input: any[]; expected: any }[];
}

export const algorithms: Algorithm[] = [
  {
    id: 'binary-search',
    name: 'Binary Search (Iterative)',
    category: 'Array / Search',
    difficulty: 'Easy',
    summary:
      'Find the index of a target value in a sorted array. Returns -1 if not found.\n\n**Example:**\nInput: `nums = [-1, 0, 3, 5, 9, 12]`, `target = 9`\nOutput: `4`',
    tags: ['array', 'search', 'logn'],
    stub: `function binarySearch(nums: number[], target: number): number {
  // Write your code here
  return -1;
}
`,
    hint: 'Initialize left and right pointers. While left <= right, calculate mid. If nums[mid] is target, return mid. If nums[mid] < target, move left to mid + 1. Otherwise, move right to mid - 1.',
    solution: `function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
`,
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
    ],
  },
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    category: 'Graph / Tree',
    difficulty: 'Medium',
    summary: 'Traverse a tree or graph by exploring as far as possible along each branch before backtracking.\n\n**Example:**\nInput: Tree `1 -> [2, 3]`\nOutput: `1, 2, 3` (Pre-order traversal)',
    tags: ['graph', 'tree', 'dfs'],
    stub: `// DFS.ts

type AdjList = number[][];

function dfsGraph(node: number, graph: AdjList, visited: boolean[]): void {
  // Write your code here
}

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function dfsTree(root: TreeNode | null): void {
  // Write your code here
}
`,
    hint: `Graph DFS:
- Check if node is visited. If so, return.
- Mark node as visited.
- Process node.
- Recursively call dfsGraph for each unvisited neighbor.

Tree DFS:
- Base case: if root is null, return.
- Perform pre-order work (process node).
- Recursively call dfsTree on left child.
- Recursively call dfsTree on right child.`,
    solution: `type AdjList = number[][];

function dfsGraph(node: number, graph: AdjList, visited: boolean[]): void {
  if (visited[node]) return;
  visited[node] = true;
  // process node here

  for (const nei of graph[node]) {
    if (!visited[nei]) {
      dfsGraph(nei, graph, visited);
    }
  }
}

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function dfsTree(root: TreeNode | null): void {
  if (!root) return;
  // pre-order
  // console.log(root.val);
  dfsTree(root.left);
  dfsTree(root.right);
}
`,
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    category: 'Graph / Tree',
    difficulty: 'Medium',
    summary: 'Traverse a tree or graph level by level using a queue.\n\n**Example:**\nInput: Tree `1 -> [2, 3]`\nOutput: `1, 2, 3` (Level-order traversal)',
    tags: ['graph', 'tree', 'bfs', 'queue'],
    stub: `// BFS.ts

type AdjList = number[][];

function bfs(start: number, graph: AdjList): void {
  // Write your code here
}
`,
    hint: `- Initialize a visited array and a queue.
- Mark start node as visited and push to queue.
- While queue is not empty:
  - Dequeue a node.
  - Process the node.
  - For each unvisited neighbor, mark as visited and enqueue.`,
    solution: `type AdjList = number[][];

function bfs(start: number, graph: AdjList): void {
  const n = graph.length;
  const visited = new Array<boolean>(n).fill(false);
  const queue: number[] = [];

  queue.push(start);
  visited[start] = true;

  while (queue.length > 0) {
    const node = queue.shift()!;
    // process node here

    for (const nei of graph[node]) {
      if (!visited[nei]) {
        visited[nei] = true;
        queue.push(nei);
      }
    }
  }
}
`,
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window (Fixed & Variable)',
    category: 'Array / String',
    difficulty: 'Medium',
    summary: 'Find the maximum sum of a contiguous subarray of size `k`.\n\n**Example:**\nInput: `nums = [2, 1, 5, 1, 3, 2]`, `k = 3`\nOutput: `9` (Subarray `[5, 1, 3]`)',
    tags: ['array', 'string', 'sliding-window'],
    stub: `// SlidingWindow.ts

// Fixed-size window: maximum sum of any subarray of length k
function maxSumFixed(nums: number[], k: number): number {
  // Write your code here
  return 0;
}

// Variable-size window: longest substring without repeating characters
function longestUniqueSubstring(s: string): number {
  // Write your code here
  return 0;
}
`,
    hint: `Fixed-size window:
- Initialize current sum and max sum.
- Iterate through the array. Add the current element to sum.
- If window size exceeds k (i >= k), subtract the element leaving the window (nums[i-k]).
- If window size reached k (i >= k-1), update max sum.

Variable-size window:
- Use a map to store the last seen index of each character.
- Initialize left pointer and max length.
- Iterate right pointer through the string.
- If s[right] is in map and its index >= left, move left to lastSeen[s[right]] + 1.
- Update lastSeen for s[right] and update max length.`,
    solution: `function maxSumFixed(nums: number[], k: number): number {
  let sum = 0;
  let max = Number.MIN_SAFE_INTEGER;

  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    if (i >= k) {
      sum -= nums[i - k];
    }
    if (i >= k - 1) {
      max = Math.max(max, sum);
    }
  }
  return max;
}

function longestUniqueSubstring(s: string): number {
  let left = 0;
  let maxLen = 0;
  const lastSeen = new Map<string, number>();

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (lastSeen.has(c) && lastSeen.get(c)! >= left) {
      left = lastSeen.get(c)! + 1;
    }
    lastSeen.set(c, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
`,
  },
  {
    id: 'two-sum-sorted',
    name: 'Two Sum II (Sorted Array)',
    category: 'Array',
    difficulty: 'Easy',
    summary: 'Find two numbers in a sorted array that add up to a specific target number.\n\n**Example:**\nInput: `nums = [2, 7, 11, 15]`, `target = 9`\nOutput: `[0, 1]` (Indices of 2 and 7)',
    tags: ['array', 'two-pointers'],
    stub: `// TwoSumSorted.ts

// Two-sum in sorted array (returns indices)
function twoSumSorted(nums: number[], target: number): number[] {
  // Write your code here
  return [-1, -1];
}
`,
    hint: `- Initialize left pointer at 0 and right pointer at n-1.
- Loop while left < right:
  - Calculate sum = nums[left] + nums[right].
  - If sum equals target, return [left, right].
  - If sum < target, increment left to increase sum.
  - If sum > target, decrement right to decrease sum.`,
    solution: `function twoSumSorted(nums: number[], target: number): number[] {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [-1, -1];
}
`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[2, 3, 4], 6], expected: [0, 2] },
      { input: [[-1, 0], -1], expected: [0, 1] },
      { input: [[1, 2], 9], expected: [-1, -1] },
    ],
  },
  {
    id: 'reverse-array',
    name: 'Reverse Array',
    category: 'Array',
    difficulty: 'Easy',
    summary: 'Reverse the elements of an array in-place using two pointers.\n\n**Example:**\nInput: `[1, 2, 3, 4, 5]`\nOutput: `[5, 4, 3, 2, 1]`',
    tags: ['array', 'two-pointers'],
    stub: `// ReverseArray.ts

// Reverse an array in-place
function reverse(nums: number[]): void {
  // Write your code here
}
`,
    hint: `- Initialize left pointer at start and right pointer at end.
- While left < right:
  - Swap nums[left] and nums[right].
  - Increment left, decrement right.`,
    solution: `function reverse(nums: number[]): void {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const tmp = nums[left];
    nums[left] = nums[right];
    nums[right] = tmp;
    left++;
    right--;
  }
}
`,
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { input: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'] },
      { input: [[1]], expected: [1] },
      { input: [[]], expected: [] },
    ],
  },
  {
    id: 'prefix-sum',
    name: 'Prefix Sum',
    category: 'Array',
    difficulty: 'Easy',
    summary: 'Calculate the sum of elements in a range `[L, R]` in O(1) time using precomputed sums.\n\n**Example:**\nInput: `nums = [1, 2, 3, 4, 5]`, Range `[1, 3]` (indices)\nOutput: `9` (2 + 3 + 4)',
    tags: ['array', 'prefix-sum'],
    stub: `// PrefixSum.ts

function prefixSum(nums: number[]): number[] {
  // Write your code here
  return [];
}

function rangeSum(pre: number[], l: number, r: number): number {
  // Write your code here
  return 0;
}
`,
    hint: `Prefix Sum Construction:
- Create an array of size n+1.
- Set pre[0] = 0.
- Iterate through nums, setting pre[i+1] = pre[i] + nums[i].

Range Sum Query:
- Return pre[r+1] - pre[l].`,
    solution: `function prefixSum(nums: number[]): number[] {
  const n = nums.length;
  const pre = new Array(n + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    pre[i + 1] = pre[i] + nums[i];
  }
  return pre;
}

function rangeSum(pre: number[], l: number, r: number): number {
  return pre[r + 1] - pre[l];
}
`,
  },
  {
    id: 'hashmaps',
    name: 'HashMaps & Frequency Counting',
    category: 'Array / String',
    difficulty: 'Easy',
    summary: 'Determine if two strings are anagrams of each other (contain same characters with same frequencies).\n\n**Example:**\nInput: `s = "anagram"`, `t = "nagaram"`\nOutput: `true`',
    tags: ['hashmap', 'string'],
    stub: `// HashMaps.ts

function buildFreqMap(s: string): Map<string, number> {
  // Write your code here
  return new Map();
}

function isAnagram(s: string, t: string): boolean {
  // Write your code here
  return false;
}
`,
    hint: `Build Frequency Map:
- Iterate through string s.
- Update count for each character in the map.

Is Anagram:
- Check if lengths are equal.
- Build frequency map for s.
- Iterate through t, decrementing counts in the map.
- If any count becomes negative or if map isn't empty (conceptually), return false.
- Alternatively, use an array of size 26 for lowercase English letters.`,
    solution: `function buildFreqMap(s: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const c of s) {
    freq.set(c, (freq.get(c) || 0) + 1);
  }
  return freq;
}

function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  
  // Using array for lowercase English letters
  const count = new Array(26).fill(0);
  const base = 'a'.charCodeAt(0);
  
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - base]++;
  }
  for (let i = 0; i < t.length; i++) {
    count[t.charCodeAt(i) - base]--;
  }
  
  return count.every(val => val === 0);
}
`,
  },
  {
    id: 'sorting-comparators',
    name: 'Sorting with Comparators',
    category: 'Sorting',
    difficulty: 'Medium',
    summary: 'Sort a list of intervals based on their start times using a custom comparator.\n\n**Example:**\nInput: `[[2, 6], [1, 3], [8, 10]]`\nOutput: `[[1, 3], [2, 6], [8, 10]]`',
    tags: ['sorting', 'comparator'],
    stub: `// Sorting.ts

// Sort 2D intervals by start time
function sortIntervals(intervals: number[][]): void {
  // Write your code here
}

interface Person {
  name: string;
  age: number;
}

// Sort by name, then age
function sortPeople(people: Person[]): void {
  // Write your code here
}
`,
    hint: `Sort Intervals:
- Use array.sort((a, b) => a[0] - b[0]) to sort by start time.

Sort People:
- Use array.sort with a custom comparator.
- First compare names using a.name.localeCompare(b.name).
- If names are equal, compare ages (a.age - b.age).`,
    solution: `function sortIntervals(intervals: number[][]): void {
  intervals.sort((a, b) => a[0] - b[0]);
}

interface Person {
  name: string;
  age: number;
}

function sortPeople(people: Person[]): void {
  people.sort((a, b) => {
    const nameCmp = a.name.localeCompare(b.name);
    if (nameCmp !== 0) return nameCmp;
    return a.age - b.age;
  });
}
`,
  },
  {
    id: 'heaps',
    name: 'PriorityQueue / Heaps',
    category: 'Heap',
    difficulty: 'Hard',
    summary: 'Find the `k`-th largest element in an unsorted array.\n\n**Example:**\nInput: `[3, 2, 1, 5, 6, 4]`, `k = 2`\nOutput: `5`',
    tags: ['heap', 'priority-queue'],
    stub: `// Heaps.ts

// Note: JS/TS has no built-in PriorityQueue.
// For interviews, you might assume a MinHeap class exists
// or implement a simple one using an array.

function kthLargest(nums: number[], k: number): number {
  // Write your code here
  return 0;
}
`,
    hint: `- Maintain a Min-Heap of size k.
- Iterate through nums.
- Push each number into the heap.
- If heap size exceeds k, pop the smallest element (root).
- After iterating, the root of the heap is the k-th largest element.`,
    solution: `// Simple MinHeap Implementation for reference
class MinHeap {
  private heap: number[] = [];

  push(val: number) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const bottom = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this.bubbleDown(0);
    }
    return top;
  }

  peek(): number | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  private bubbleUp(idx: number) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent] <= this.heap[idx]) break;
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }

  private bubbleDown(idx: number) {
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let smallest = idx;

      if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      if (smallest === idx) break;
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}

function kthLargest(nums: number[], k: number): number {
  const pq = new MinHeap();
  for (const n of nums) {
    pq.push(n);
    if (pq.size() > k) {
      pq.pop();
    }
  }
  return pq.peek()!;
}
`,
  },
  {
    id: 'union-find',
    name: 'Union-Find (DSU)',
    category: 'Graph',
    difficulty: 'Hard',
    summary: 'Determine if two elements belong to the same set and merge sets efficiently.\n\n**Example:**\nInput: Union(1, 2), Union(2, 3), Find(1, 3)\nOutput: `true` (1 and 3 are connected)',
    tags: ['graph', 'dsu', 'union-find'],
    stub: `// UnionFind.ts

class DSU {
  parent: number[];
  size: number[];

  constructor(n: number) {
    // Write your code here
    this.parent = [];
    this.size = [];
  }

  find(x: number): number {
    // Write your code here
    return 0;
  }

  union(a: number, b: number): void {
    // Write your code here
  }
}
`,
    hint: `Constructor:
- Initialize parent array where parent[i] = i.
- Initialize size array with 1s.

Find:
- If parent[x] != x, recursively set parent[x] = find(parent[x]) (Path Compression).
- Return parent[x].

Union:
- Find roots of a and b.
- If roots are different, attach the smaller tree to the larger tree (Union by Size).
- Update size of the new root.`,
    solution: `class DSU {
  parent: number[];
  size: number[];

  constructor(n: number) {
    this.parent = new Array(n).fill(0).map((_, i) => i);
    this.size = new Array(n).fill(1);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  union(a: number, b: number): void {
    const pa = this.find(a);
    const pb = this.find(b);
    if (pa === pb) return;

    // union by size
    if (this.size[pa] < this.size[pb]) {
      this.parent[pa] = pb;
      this.size[pb] += this.size[pa];
    } else {
      this.parent[pb] = pa;
      this.size[pa] += this.size[pb];
    }
  }
}
`,
  },
  {
    id: 'backtracking',
    name: 'Backtracking (Subsets)',
    category: 'Recursion',
    difficulty: 'Medium',
    summary: 'Generate all possible subsets (the power set) of a set of distinct integers.\n\n**Example:**\nInput: `[1, 2, 3]`\nOutput: `[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]`',
    tags: ['recursion', 'backtracking'],
    stub: `// Backtracking.ts

function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  // Write your code here
  return res;
}

function backtrack(start: number, curr: number[], nums: number[], res: number[][]): void {
  // Write your code here
}
`,
    hint: `- Base case: Add a copy of current subset (curr) to results.
- Iterate from start index to end of nums.
- Include nums[i] in curr.
- Recurse with start = i + 1.
- Backtrack: Remove last element from curr.`,
    solution: `function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  backtrack(0, [], nums, res);
  return res;
}

function backtrack(start: number, curr: number[], nums: number[], res: number[][]): void {
  res.push([...curr]);
  
  for (let i = start; i < nums.length; i++) {
    curr.push(nums[i]);
    backtrack(i + 1, curr, nums, res);
    curr.pop();
  }
}
`,
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    category: 'DP',
    difficulty: 'Hard',
    summary: 'Calculate the `n`-th Fibonacci number using dynamic programming (bottom-up).\n\n**Example:**\nInput: `n = 5`\nOutput: `5` (Sequence: 0, 1, 1, 2, 3, 5)',
    tags: ['dp', 'recursion'],
    stub: `// DP.ts

// Fibonacci bottom-up
function fib(n: number): number {
  // Write your code here
  return 0;
}

// Longest Common Subsequence
function lcs(a: string, b: string): number {
  // Write your code here
  return 0;
}
`,
    hint: `Fibonacci:
- Handle base cases (n < 2).
- Use two variables to store prev1 and prev2.
- Iterate from 2 to n, updating variables.

LCS:
- Create a 2D DP array of size (m+1) x (n+1).
- Iterate i from 1 to m, j from 1 to n.
- If a[i-1] == b[j-1], dp[i][j] = 1 + dp[i-1][j-1].
- Else, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).`,
    solution: `function fib(n: number): number {
  if (n < 2) return n;
  let prev2 = 0, prev1 = 1;
  
  for (let i = 2; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

function lcs(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  // dp[m+1][n+1]
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}
`,
  },
  {
    id: 'tree-inorder',
    name: 'Tree Traversal (Iterative)',
    category: 'Tree',
    difficulty: 'Medium',
    summary: 'Perform an inorder traversal of a binary tree without using recursion (using a stack).\n\n**Example:**\nInput: `[1, null, 2, 3]` (Root 1, Right 2, Left-of-2 3)\nOutput: `[1, 3, 2]`',
    tags: ['tree', 'stack'],
    stub: `// TreeTraversal.ts

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function inorderTraversal(root: TreeNode | null): number[] {
  const res: number[] = [];
  const stack: TreeNode[] = [];
  // Write your code here
  return res;
}
`,
    hint: `- Initialize stack and current node (root).
- While current is not null or stack is not empty:
  - Push current and all left children to stack.
  - Pop from stack, process node (add to result).
  - Move current to right child.`,
    solution: `interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function inorderTraversal(root: TreeNode | null): number[] {
  const res: number[] = [];
  const stack: TreeNode[] = [];
  let cur = root;

  while (cur !== null || stack.length > 0) {
    while (cur !== null) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop()!;
    res.push(cur.val);
    cur = cur.right;
  }
  return res;
}
`,
  },
  {
    id: 'topo-sort',
    name: 'Topological Sort (Kahn)',
    category: 'Graph',
    difficulty: 'Hard',
    summary: 'Find a linear ordering of vertices in a directed graph such that for every edge u->v, u comes before v.\n\n**Example:**\nInput: `n = 2`, `edges = [[1, 0]]`\nOutput: `[1, 0]`',
    tags: ['graph', 'topo-sort'],
    stub: `// TopoSort.ts

function topoSort(n: number, edges: number[][]): number[] {
  // Write your code here
  return [];
}
`,
    hint: `- Build adjacency list and indegree array.
- Push all nodes with indegree 0 to a queue.
- While queue is not empty:
  - Dequeue node, add to order.
  - Decrement indegree of neighbors.
  - If neighbor's indegree becomes 0, enqueue it.`,
    solution: `function topoSort(n: number, edges: number[][]): number[] {
  const graph: number[][] = Array.from({ length: n }, () => []);
  const indegree = new Array(n).fill(0);

  for (const [from, to] of edges) {
    graph[from].push(to);
    indegree[to]++;
  }

  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (indegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    for (const nei of graph[node]) {
      indegree[nei]--;
      if (indegree[nei] === 0) {
        queue.push(nei);
      }
    }
  }

  return order.length === n ? order : []; // cycle check
}
`,
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra Shortest Path',
    category: 'Graph',
    difficulty: 'Hard',
    summary: 'Find the shortest paths from a source node to all other nodes in a weighted graph.\n\n**Example:**\nInput: `0 -[1]-> 1`, Source `0`\nOutput: `[0, 1]` (Distance to 0 is 0, to 1 is 1)',
    tags: ['graph', 'shortest-path', 'dijkstra'],
    stub: `// Dijkstra.ts

// graph[u] = [[v, weight], ...]
function dijkstra(n: number, graph: number[][][], src: number): number[] {
  // Write your code here
  return [];
}
`,
    hint: `- Initialize distances to Infinity, dist[src] = 0.
- Use a Priority Queue (Min-Heap) storing [node, distance].
- While PQ is not empty:
  - Pop node with smallest distance.
  - If current distance > dist[node], continue.
  - For each neighbor, if new path is shorter, update dist and push to PQ.`,
    solution: `// Requires MinHeap class (see Heaps algorithm for implementation)
// For this reference, we'll assume a simple PriorityQueue implementation exists 
// or use a naive array sort for brevity, but real Dijkstra needs a Heap.

function dijkstra(n: number, graph: number[][][], src: number): number[] {
  const dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  
  // Naive PQ for demonstration (O(V^2) total with array shift)
  // In production, use a Binary Heap for O(E log V)
  const pq: [number, number][] = [[src, 0]]; // [node, distance]

  while (pq.length > 0) {
    // Sort to simulate min-heap pop
    pq.sort((a, b) => a[1] - b[1]);
    const [node, d] = pq.shift()!;

    if (d > dist[node]) continue;

    for (const [nei, weight] of graph[node]) {
      const newDist = dist[node] + weight;
      if (newDist < dist[nei]) {
        dist[nei] = newDist;
        pq.push([nei, newDist]);
      }
    }
  }
  return dist;
}
`,
  },
];

export function getAlgorithmById(id: string): Algorithm | undefined {
  return algorithms.find((a) => a.id === id);
}
