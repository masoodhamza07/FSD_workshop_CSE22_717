# Q1 - School Bell System (EventEmitter & Event Loop)

## Aim
Demonstrate Node.js `EventEmitter` with custom `classStart` and `classEnd` events, and compare the execution order of `process.nextTick`, `setTimeout` and `setImmediate` in the event loop.

## How to Run

```bash
cd Q1_School-Bell-System
node index.js
```

No external packages are required.

## Code Overview

- `SchoolBell` extends `EventEmitter` and registers listeners for `classStart` and `classEnd` in its constructor.
- Calling `bell.emit(...)` runs the matching listener and prints the class message.
- `process.nextTick` runs after the synchronous code but before the event loop phases.
- `setTimeout(..., 0)` runs in the timers phase and `setImmediate` in the check phase.

## Sample Output

```text
1. Synchronous: School bell system initialized.
EVENT: Class is starting. Students, please take your seats.
EVENT: Class has ended. Students, please leave the classroom.
2. Synchronous: Main script finished. Event loop takes over.
RING BELL (process.nextTick)
RING BELL (setTimeout)
RING BELL (setImmediate)
```

`process.nextTick` always runs first; `setTimeout` and `setImmediate` may swap at top level.
