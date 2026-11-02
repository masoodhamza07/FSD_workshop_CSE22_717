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
