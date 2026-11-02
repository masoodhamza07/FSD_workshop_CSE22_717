# Experiment 3: Event Loop Visualization

## Aim
To visualize and understand the execution order and phase transitions of the Node.js Event Loop using `setTimeout`, `setImmediate`, `process.nextTick`, and `Promise` microtasks, demonstrating basic ordering, nested callbacks in I/O cycles, and the priority hierarchy between microtask queues.

---

## Theory

### What is the Node.js Event Loop?
Node.js is a single-threaded runtime environment built on Chrome's V8 JavaScript engine and the **libuv** C library. The **Event Loop** is the mechanism that allows Node.js to perform non-blocking asynchronous I/O operations despite JavaScript being single-threaded. It offloads operations to the system kernel whenever possible.

```
   ┌───────────────────────────┐
┌─>│          timers           │  setTimeout(), setInterval()
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  Deferred I/O callbacks (TCP errors, etc.)
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  Internal libuv operations
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  Retrieve new I/O events; run I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  socket.on('close', ...), cleanups
   └───────────────────────────┘
```

### Event Loop Phases (libuv)

1. **Timers Phase**:
   Executes callbacks scheduled by `setTimeout()` and `setInterval()` whose threshold has elapsed.
2. **Pending Callbacks Phase**:
   Executes I/O callbacks deferred from the previous loop iteration (such as specific system-level errors like `ECONNREFUSED`).
3. **Idle, Prepare Phase**:
   Used exclusively by libuv for internal housekeeping between phases.
4. **Poll Phase**:
   - Calculates how long it should block and wait for I/O events.
   - Processes events in the poll queue (incoming network packets, file reads, new connections).
   - If timers are ready or `setImmediate` is scheduled, the poll phase wraps up and advances.
5. **Check Phase**:
   Dedicated entirely to executing callbacks scheduled via `setImmediate()`.
6. **Close Callbacks Phase**:
   Executes cleanup and teardown events, such as `socket.on('close', ...)`.

---

### Microtask Queues vs. Macrotask Queues

In Node.js, asynchronous operations are divided into **Macrotasks** (event loop phase tasks) and **Microtasks** (immediate priority tasks).

Microtasks are **not** managed by libuv; they are processed by Node.js and V8:
1. **`process.nextTick` Queue** (Node.js internal queue):
   - Highest priority among asynchronous tasks.
   - Executes immediately after the currently running JavaScript operation finishes on the Call Stack, before any other microtasks or macrotasks.
2. **Promise Microtask Queue** (V8 Microtask Queue):
   - Holds callbacks from resolved/rejected Promises (`.then`, `.catch`, `.finally`) and `queueMicrotask()`.
   - Drained immediately after the `nextTick` queue becomes completely empty.

> **Crucial Rule**:
> Microtask queues drain:
> - Immediately after synchronous script execution empties the Call Stack.
> - Immediately after each individual callback completes, before the Event Loop transitions to the next callback or phase.

---

## Code Explanation

The experiment code in `index.js` illustrates three distinct scenarios:

### 1. Example (A): Basic Execution Order
- **Synchronous Statements**: Execute immediately on the V8 Call Stack (`A-1`, `A-2`).
- **`process.nextTick`**: Drains as soon as the Call Stack empties (`A-3`).
- **`Promise.resolve().then()`**: Drains right after `nextTick` finishes (`A-4`).
- **Macrotasks**: The event loop checks the Timers and Check phases (`A-5`, `A-6`).

### 2. Example (B): Nested Callbacks & I/O Phase Progression
- An asynchronous file read (`fs.readFile`) places callback execution squarely within the **Poll Phase** (`B-1`).
- Inside the Poll Phase:
  - Nested microtasks (`nextTick` and `Promise.then`) drain immediately upon completion of the synchronous callback body (`B-3`, `B-4`).
  - Next, the Event Loop naturally steps forward into the **Check Phase**, running `setImmediate` (`B-5`).
  - Finally, `setTimeout(..., 0)` runs in the **Timers Phase of the *next* loop iteration** (`B-6`).
  - *Takeaway*: Inside any I/O callback, `setImmediate` will **always** execute before `setTimeout(..., 0)`.

### 3. Example (C): `nextTick` vs Promise Microtasks Deep Dive
- Illustrates interleaving and nesting of microtasks:
  - `process.nextTick` callbacks (`C-2`, `C-3`) are drained completely first.
  - Then the Promise queue executes (`C-4`, `C-5`).
  - A Promise scheduling a `nextTick` (`C-7`) and a `nextTick` scheduling a Promise (`C-6`) demonstrate that Node returns to drain `nextTick` before proceeding to macrotasks.

---

## How to Run

### Prerequisites
- Node.js installed (v14.x or higher)

### Steps
1. Navigate to the experiment directory:
   ```bash
   cd Exp-03_Event-Loop-Visualization
   ```
2. Run the script:
   ```bash
   node index.js
   ```
   *Or via npm:*
   ```bash
   npm start
   ```

---
