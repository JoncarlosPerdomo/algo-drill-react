export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  difficulty: Difficulty;
  summary: string;
  tags: string[];
  stub: string;
  reference: string;
  testCases?: { input: any[]; expected: any }[];
}

export const algorithms: Algorithm[] = [
  {
    id: 'binary-search',
    name: 'Binary Search (Iterative)',
    category: 'Array / Search',
    difficulty: 'Easy',
    summary:
      'Classic binary search on a sorted array. O(log n) time, O(1) space.',
    tags: ['array', 'search', 'logn'],
    stub: `function binarySearch(nums: number[], target: number): number {
  // TODO: write code below
  return -1;
}
`,
    reference: `function binarySearch(nums: number[], target: number): number {
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
    summary: 'Recursive DFS for tree and graph traversal.',
    tags: ['graph', 'tree', 'dfs'],
    stub: `// DFS.ts

type AdjList = number[][];

function dfsGraph(node: number, graph: AdjList, visited: boolean[]): void {
  // TODO:
  // - base: if visited[node] return
  // - mark visited
  // - process node
  // - recurse on neighbors
}

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function dfsTree(root: TreeNode | null): void {
  // TODO:
  // - base: if !root return
  // - pre-order work
  // - dfsTree(root.left)
  // - dfsTree(root.right)
}
`,
    reference: `type AdjList = number[][];

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
    summary: 'Level-order traversal for graphs or trees using a queue.',
    tags: ['graph', 'tree', 'bfs', 'queue'],
    stub: `// BFS.ts

type AdjList = number[][];

function bfs(start: number, graph: AdjList): void {
  // TODO:
  // - create visited[]
  // - push start into queue
  // - while queue not empty:
  //   - pop front
  //   - process
  //   - push unvisited neighbors
}
`,
    reference: `type AdjList = number[][];

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
    summary: 'Contiguous subarray/substring problems (sums, constraints).',
    tags: ['array', 'string', 'sliding-window'],
    stub: `// SlidingWindow.ts

// Fixed-size window: maximum sum of any subarray of length k
function maxSumFixed(nums: number[], k: number): number {
  // TODO:
  // - init sum = 0, max = -Infinity
  // - iterate i from 0 to n-1
  // - add nums[i]
  // - if i >= k, subtract nums[i-k]
  // - if i >= k-1, update max
  return 0;
}

// Variable-size window: longest substring without repeating characters
function longestUniqueSubstring(s: string): number {
  // TODO:
  // - init left = 0, maxLen = 0
  // - use Map or object for lastSeen
  // - iterate right from 0 to s.length-1
  // - if char seen and index >= left, update left
  // - update lastSeen
  // - update maxLen
  return 0;
}
`,
    reference: `function maxSumFixed(nums: number[], k: number): number {
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
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'Array',
    difficulty: 'Easy',
    summary: 'Sorted arrays, partitioning, reversing, pair-sum.',
    tags: ['array', 'two-pointers'],
    stub: `// TwoPointers.ts

// Two-sum in sorted array (returns indices)
function twoSumSorted(nums: number[], target: number): number[] {
  // TODO:
  // - left = 0, right = n-1
  // - while left < right:
  //   - sum = nums[left] + nums[right]
  //   - if match return [left, right]
  //   - if sum < target, left++
  //   - else right--
  return [-1, -1];
}

// Reverse an array in-place
function reverse(nums: number[]): void {
  // TODO:
  // - left = 0, right = n-1
  // - swap and move pointers
}
`,
    reference: `function twoSumSorted(nums: number[], target: number): number[] {
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

function reverse(nums: number[]): void {
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
  },
  {
    id: 'prefix-sum',
    name: 'Prefix Sum',
    category: 'Array',
    difficulty: 'Easy',
    summary: 'Precompute cumulative sums for O(1) range queries.',
    tags: ['array', 'prefix-sum'],
    stub: `// PrefixSum.ts

function prefixSum(nums: number[]): number[] {
  // TODO:
  // - create array size n+1
  // - pre[0] = 0
  // - loop and add cumulative sum
  return [];
}

function rangeSum(pre: number[], l: number, r: number): number {
  // TODO: return pre[r+1] - pre[l]
  return 0;
}
`,
    reference: `function prefixSum(nums: number[]): number[] {
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
    summary: 'Anagrams, frequency counts, membership checks.',
    tags: ['hashmap', 'string'],
    stub: `// HashMaps.ts

function buildFreqMap(s: string): Map<string, number> {
  // TODO: count char frequencies
  return new Map();
}

function isAnagram(s: string, t: string): boolean {
  // TODO:
  // - check lengths
  // - count chars in s
  // - decrement for t
  // - check all zero
  return false;
}
`,
    reference: `function buildFreqMap(s: string): Map<string, number> {
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
    summary: 'Custom sort logic using lambdas/comparators.',
    tags: ['sorting', 'comparator'],
    stub: `// Sorting.ts

// Sort 2D intervals by start time
function sortIntervals(intervals: number[][]): void {
  // TODO: sort by intervals[i][0]
}

interface Person {
  name: string;
  age: number;
}

// Sort by name, then age
function sortPeople(people: Person[]): void {
  // TODO: custom comparator
}
`,
    reference: `function sortIntervals(intervals: number[][]): void {
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
    summary: 'Min-heaps for k-smallest, Max-heaps for k-largest.',
    tags: ['heap', 'priority-queue'],
    stub: `// Heaps.ts

// Note: JS/TS has no built-in PriorityQueue.
// For interviews, you might assume a MinHeap class exists
// or implement a simple one using an array.

function kthLargest(nums: number[], k: number): number {
  // TODO:
  // - push elements to min-heap
  // - if size > k, pop
  // - return peek
  return 0;
}
`,
    reference: `// Simple MinHeap Implementation for reference
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
    summary: 'Track connected components, path compression, union by rank.',
    tags: ['graph', 'dsu', 'union-find'],
    stub: `// UnionFind.ts

class DSU {
  parent: number[];
  size: number[];

  constructor(n: number) {
    // TODO: init parent[i]=i, size[i]=1
    this.parent = [];
    this.size = [];
  }

  find(x: number): number {
    // TODO: path compression
    return 0;
  }

  union(a: number, b: number): void {
    // TODO: union by size/rank
  }
}
`,
    reference: `class DSU {
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
    summary: 'Generate subsets, combinations, permutations.',
    tags: ['recursion', 'backtracking'],
    stub: `// Backtracking.ts

function subsets(nums: number[]): number[][] {
  const res: number[][] = [];
  // TODO: call backtrack
  return res;
}

function backtrack(start: number, curr: number[], nums: number[], res: number[][]): void {
  // TODO:
  // - add copy of curr to res
  // - loop i from start to n
  // - push nums[i]
  // - recurse
  // - pop
}
`,
    reference: `function subsets(nums: number[]): number[][] {
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
    summary: 'Overlapping subproblems + optimal substructure.',
    tags: ['dp', 'recursion'],
    stub: `// DP.ts

// Fibonacci bottom-up
function fib(n: number): number {
  // TODO: iterative O(n)
  return 0;
}

// Longest Common Subsequence
function lcs(a: string, b: string): number {
  // TODO: 2D DP array
  return 0;
}
`,
    reference: `function fib(n: number): number {
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
    summary: 'Iterative inorder traversal using explicit stack.',
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
  // TODO:
  // - while cur or stack not empty
  // - push left children
  // - pop and process
  // - move right
  return res;
}
`,
    reference: `interface TreeNode {
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
    summary: 'Ordering tasks with dependencies in DAG.',
    tags: ['graph', 'topo-sort'],
    stub: `// TopoSort.ts

function topoSort(n: number, edges: number[][]): number[] {
  // TODO:
  // - build graph and indegree
  // - queue for indegree 0
  // - process queue
  return [];
}
`,
    reference: `function topoSort(n: number, edges: number[][]): number[] {
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
    summary: 'Shortest paths from source with non-negative weights.',
    tags: ['graph', 'shortest-path', 'dijkstra'],
    stub: `// Dijkstra.ts

// graph[u] = [[v, weight], ...]
function dijkstra(n: number, graph: number[][][], src: number): number[] {
  // TODO:
  // - dist array init to Infinity
  // - priority queue (min-heap)
  // - while pq not empty
  // - relax edges
  return [];
}
`,
    reference: `// Requires MinHeap class (see Heaps algorithm for implementation)
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
