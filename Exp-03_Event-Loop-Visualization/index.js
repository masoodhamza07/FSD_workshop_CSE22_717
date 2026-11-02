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

const fs = require('fs');

/**
 * Helper to ensure an isolated macrotask context for clean execution
 * of each demonstration scenario.
 */
function runInFreshTick(callback) {
  return new Promise((resolve) => {
    setImmediate(() => {
      callback();
      // Allow queues in the scenario to settle before resolving
      setTimeout(resolve, 80);
    });
  });
}

// ==============================================================================
// EXAMPLE (A): Basic Ordering
// Demonstrates: Synchronous -> nextTick -> Promise -> Timers (setTimeout) / Check (setImmediate)
// ==============================================================================
function runExampleA() {
  return runInFreshTick(() => {
    console.log('\n==================================================================');
    console.log('  EXAMPLE (A): BASIC EXECUTION ORDER                             ');
    console.log('  (Call Stack -> nextTickQueue -> PromiseQueue -> Event Loop)     ');
    console.log('==================================================================');

    console.log('  [A-1: Synchronous] Main execution begins (Call Stack)');

    // 1. Schedule Timer (Timers Phase)
    setTimeout(() => {
      console.log('  [A-5: Timers Phase] setTimeout(0ms) callback executed');
    }, 0);

    // 2. Schedule Immediate (Check Phase)
    setImmediate(() => {
      console.log('  [A-6: Check Phase] setImmediate callback executed');
    });

    // 3. Schedule Promise Microtask (Promise Microtask Queue)
    Promise.resolve().then(() => {
      console.log('  [A-4: Promise Microtask] Promise.then callback executed');
    });

    // 4. Schedule nextTick Microtask (nextTick Queue)
    process.nextTick(() => {
      console.log('  [A-3: nextTick Microtask] process.nextTick callback executed (Priority 1)');
    });

    console.log('  [A-2: Synchronous] Main execution ends (Call Stack empty)');
  });
}

// ==============================================================================
// EXAMPLE (B): Nested Callbacks & I/O Phase Progression
// Demonstrates:
// 1. Inside an async callback, nested microtasks drain IMMEDIATELY when the
//    callback finishes, before moving to the next macrotask.
// 2. Within an I/O callback (Poll Phase), setImmediate (Check Phase) ALWAYS
//    executes before setTimeout (Timers Phase of the next loop iteration).
// ==============================================================================
function runExampleB() {
  return runInFreshTick(() => {
    console.log('\n==================================================================');
    console.log('  EXAMPLE (B): NESTED CALLBACKS & I/O PROGRESSION                ');
    console.log('  (Poll Phase -> Nested Microtasks -> Check Phase -> Timers)     ');
    console.log('==================================================================');

    // Read current file to ensure we enter the Poll Phase
    fs.readFile(__filename, () => {
      console.log('  [B-1: Poll Phase] fs.readFile I/O callback starts executing');

      // Schedule Timers Macrotask (will execute in Timers phase of next loop)
      setTimeout(() => {
        console.log('  [B-6: Next Loop - Timers] setTimeout(0ms) executed (Loop iteration +1)');
      }, 0);

      // Schedule Check Macrotask (executes immediately in Check phase right after Poll)
      setImmediate(() => {
        console.log('  [B-5: Check Phase] setImmediate executed (Poll -> Check transition)');
      });

      // Schedule Nested Microtasks inside the I/O callback
      process.nextTick(() => {
        console.log('  [B-3: Nested Microtask] nextTick inside I/O callback drains first');
      });

      Promise.resolve().then(() => {
        console.log('  [B-4: Nested Microtask] Promise.then inside I/O callback drains next');
      });

      console.log('  [B-2: Poll Phase] fs.readFile callback finished; draining microtasks...');
    });
  });
}

// ==============================================================================
// EXAMPLE (C): nextTick vs Promise Microtasks Deep Dive
// Demonstrates:
// 1. nextTickQueue is completely exhausted before the Promise queue starts.
// 2. A Promise scheduling a nextTick will cause that nextTick to run before the
//    event loop moves to macrotasks.
// 3. A nextTick scheduling a Promise will append to the Promise queue for that turn.
// ==============================================================================
function runExampleC() {
  return runInFreshTick(() => {
    console.log('\n==================================================================');
    console.log('  EXAMPLE (C): nextTick vs PROMISE MICROTASKS DEEP DIVE          ');
    console.log('  (Priority: nextTickQueue -> promiseMicrotaskQueue)             ');
    console.log('==================================================================');

    console.log('  [C-1: Synchronous] Registering multiple microtasks...');

    // Promise 1
    Promise.resolve().then(() => {
      console.log('  [C-4: Promise Queue] Promise 1 executed');

      // Nested nextTick inside Promise 1
      process.nextTick(() => {
        console.log('  [C-7: nextTick Queue] Nested nextTick inside Promise 1 executed');
      });
    });

    // Promise 2
    Promise.resolve().then(() => {
      console.log('  [C-5: Promise Queue] Promise 2 executed');
    });

    // nextTick 1
    process.nextTick(() => {
      console.log('  [C-2: nextTick Queue] nextTick 1 executed');

      // Nested Promise inside nextTick 1
      Promise.resolve().then(() => {
        console.log('  [C-6: Promise Queue] Nested Promise inside nextTick 1 executed');
      });
    });

    // nextTick 2
    process.nextTick(() => {
      console.log('  [C-3: nextTick Queue] nextTick 2 executed');
    });

    console.log('  [C-1: Synchronous] All microtasks queued. Call stack clearing now...');
  });
}

// ==============================================================================
// Master Orchestration: Runs each section in sequence for pedagogical clarity
// ==============================================================================
async function main() {
  console.log('******************************************************************');
  console.log('*           EXPERIMENT 3: EVENT LOOP VISUALIZATION               *');
  console.log('******************************************************************');

  await runExampleA();
  await runExampleB();
  await runExampleC();

  console.log('\n******************************************************************');
  console.log('*                   EXPERIMENT 3 COMPLETED                       *');
  console.log('******************************************************************\n');
}

// Start visualization
main();
