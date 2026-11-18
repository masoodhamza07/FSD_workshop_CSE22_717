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
