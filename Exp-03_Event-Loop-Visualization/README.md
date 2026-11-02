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
