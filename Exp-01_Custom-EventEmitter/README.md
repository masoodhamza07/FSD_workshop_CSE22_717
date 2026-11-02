# Experiment 1: Custom EventEmitter

## Aim
To create a custom `EventEmitter` class by extending Node.js's built-in `events.EventEmitter`, register event listeners for `'greet'` and `'exit'` events, dispatch events with custom data, and demonstrate the core methods: `.on()`, `.emit()`, `.once()`, and `.removeListener()`.

---

## Theory

### What is an EventEmitter in Node.js?
Node.js follows an **event-driven, non-blocking asynchronous architecture**. Much of the Node.js core API is built around an idiomatic event-driven pattern in which certain types of objects (called **emitters**) emit named events that cause `Function` objects (called **listeners**) to be called.

All objects that emit events in Node.js are instances of the `EventEmitter` class, exported by the built-in `events` module.

```javascript
const EventEmitter = require('events');
```

### Observer Design Pattern
The `EventEmitter` implements the **Publish-Subscribe (Pub/Sub) / Observer Pattern**:
- **Subject / Publisher**: Emits named events when a specific action happens.
- **Observers / Subscribers**: Functions registered as listeners that get notified whenever the event is emitted.

### Core Methods of EventEmitter

1. **`emitter.on(eventName, listener)`**:
   Appends the listener function to the end of the listeners array for the specified event. Every time the event is emitted, this listener is triggered.
2. **`emitter.emit(eventName, [...args])`**:
   Synchronously calls each of the listeners registered for the event named `eventName`, in the order they were registered, passing the supplied arguments to each.
3. **`emitter.once(eventName, listener)`**:
   Adds a **one-time** listener function for the event. The next time the event is triggered, this listener is invoked and then immediately removed.
4. **`emitter.removeListener(eventName, listener)`** (or alias `.off()`):
   Removes the specified listener from the listener array for the specified event. Note that a reference to the exact function must be passed.
5. **`emitter.listenerCount(eventName)`**:
   Returns the number of listeners currently listening to the event.
6. **`emitter.eventNames()`**:
   Returns an array listing the events for which the emitter has registered listeners.

---

## Code Explanation

In `index.js`, we demonstrate these concepts through the following steps:

1. **Inheritance**:
   We define a class `CustomEmitter` that extends `EventEmitter`. Inside the constructor, `super()` is called to set up internal EventEmitter state. We also attach domain-specific methods `triggerGreet(userName)` and `triggerExit(reason)` which encapsulate calling `this.emit()`.

2. **Registering Listeners**:
   - Two persistent listeners (`persistentGreetingListener`, `secondaryGreetingListener`) are attached to `'greet'` via `myEmitter.on()`.
   - One temporary listener (`oneTimeGreetingListener`) is attached to `'greet'` via `myEmitter.once()`.
   - One listener (`exitListener`) is attached to `'exit'` via `myEmitter.on()`.

3. **First Emission (`greet` for "Alice")**:
   All 3 listeners fire in order. Immediately after invocation, the `.once()` listener is automatically detached by Node.js.

4. **Second Emission (`greet` for "Bob")**:
   Only the 2 persistent listeners fire. The listener count decreases from 3 to 2.

5. **Removing a Listener (`.removeListener()`)**:
   We call `myEmitter.removeListener('greet', persistentGreetingListener)`. This leaves only `secondaryGreetingListener`.

6. **Third Emission (`greet` for "Charlie")**:
   Only `secondaryGreetingListener` responds, proving that the listener was successfully detached.

7. **Exit Emission**:
   `myEmitter.triggerExit(...)` triggers `'exit'`, executing `exitListener` with the exit reason passed as a parameter.

---

## How to Run

### Prerequisites
- Node.js installed (v14.x or higher recommended)

### Steps
1. Navigate to the experiment directory:
   ```bash
   cd Exp-01_Custom-EventEmitter
   ```
2. Run the script using Node.js:
   ```bash
   node index.js
   ```
   *Alternatively, run via npm:*
   ```bash
   npm start
   ```

---

## Expected Output

```text
========================================================
       EXPERIMENT 1: CUSTOM EVENTEMITTER DEMO          
========================================================

--- 1. Registering Event Listeners ---
Registered 2 persistent listeners for "greet" using .on()
Registered 1 one-time listener for "greet" using .once()
Registered 1 persistent listener for "exit" using .on()

Active events: [greet, exit]
Count of listeners for 'greet': 3
Count of listeners for 'exit': 1

--- 2. First Emission of "greet" (with sample data "Alice") ---

>>> [WorkshopNotifier] Dispatching 'greet' event for: Alice
  [Listener 1 (.on)]: Hello, Alice! Welcome to Node.js Event-Driven Architecture.
  [Listener 2 (.on)]: Greetings, Alice! Your session is active.
  [Listener 3 (.once)]: First-time welcome for Alice! This notification appears ONLY ONCE.

--- 3. Second Emission of "greet" (with sample data "Bob") ---
Notice: Listener count for 'greet' is now: 2 (oneTime listener removed automatically)

>>> [WorkshopNotifier] Dispatching 'greet' event for: Bob
  [Listener 1 (.on)]: Hello, Bob! Welcome to Node.js Event-Driven Architecture.
  [Listener 2 (.on)]: Greetings, Bob! Your session is active.

--- 4. Removing a Listener with .removeListener() ---
Removing "persistentGreetingListener" from "greet" event...
Listener count for 'greet' after removal: 1

--- 5. Third Emission of "greet" (with sample data "Charlie") ---

>>> [WorkshopNotifier] Dispatching 'greet' event for: Charlie
  [Listener 2 (.on)]: Greetings, Charlie! Your session is active.

--- 6. Emitting "exit" Event ---

>>> [WorkshopNotifier] Dispatching 'exit' event. Reason: User requested logout after completing the workshop lab
  [Listener (.on)]: Goodbye! Session terminated. Details: "User requested logout after completing the workshop lab".

========================================================
              EXPERIMENT 1 COMPLETED                    
========================================================
```

---

## Key Takeaways
- `EventEmitter` is synchronous by default; listeners run in the order registered within the current tick unless explicitly deferred.
- Named functions must be used if you intend to remove a listener with `.removeListener()`, because anonymous arrow functions have distinct references.
- `EventEmitter` forms the backbone of Node.js streams, HTTP servers, sockets, and custom application modules.
