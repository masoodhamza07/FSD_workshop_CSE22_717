/**
 * ==============================================================================
 * Experiment 3: Event Loop Visualization in Node.js
 * ==============================================================================
 * Course: Full Stack Development Workshop - I
 * Description:
 *   Demonstrates the internal phases of the Node.js Event Loop and the priority
 *   rules between synchronous execution, microtask queues (process.nextTick,
 *   Promises), and macrotask queues (setTimeout, setImmediate, I/O callbacks).
 *
 * ------------------------------------------------------------------------------
 * NODE.JS EVENT LOOP PHASES (Managed by libuv)
 * ------------------------------------------------------------------------------
 * 1. TIMERS Phase:
 *    Executes callbacks scheduled by setTimeout() and setInterval().
 * 2. PENDING CALLBACKS Phase:
 *    Executes deferred I/O callbacks (e.g., system errors like TCP ECONNREFUSED).
 * 3. IDLE, PREPARE Phase:
 *    Used internally by Node.js and libuv for housekeeping.
 * 4. POLL Phase:
 *    Retrieves new I/O events; executes I/O related callbacks (fs, net, http).
 *    Can block and wait for events if no other timers or tasks are pending.
 * 5. CHECK Phase:
 *    Executes callbacks scheduled specifically by setImmediate().
 * 6. CLOSE CALLBACKS Phase:
 *    Executes cleanup and close callbacks (e.g., socket.on('close', ...)).
 *
 * ------------------------------------------------------------------------------
 * MICROTASK QUEUES (Drain immediately after the call stack empties or after
 * each individual callback, BEFORE the event loop advances to the next task/phase)
 * ------------------------------------------------------------------------------
 *  A. process.nextTick Queue:
 *     Maintained by Node.js directly. Holds the highest microtask priority.
 *     All pending nextTick callbacks drain before Promise microtasks.
 *  B. Promise Microtask Queue:
 *     Maintained by the V8 engine for Promise callbacks (.then, .catch, .finally)
 *     and queueMicrotask(). Runs after the nextTick queue is empty.
 * ==============================================================================
 */
