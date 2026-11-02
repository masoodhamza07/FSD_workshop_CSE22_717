# Experiment 2: DOM-like Event Handling in Node.js

## Aim
To simulate browser Document Object Model (DOM) event handling inside a Node.js runtime by creating a custom `DOMElement` class extending `EventEmitter`, providing `addEventListener`, `removeEventListener`, and `dispatchEvent` methods, and demonstrating event bubbling, event propagation control (`stopPropagation`), and event cancellation (`preventDefault`).

---

## Theory

### DOM Event Model vs. Node.js EventEmitter
In client-side JavaScript (browser environment), the DOM event system governs user interactions like clicks, keyboard entries, and form submissions. While Node.js does not have a native DOM tree or window object, its core `EventEmitter` mechanism operates on a very similar observer pattern.

| Feature | Browser DOM Events (`EventTarget`) | Node.js `EventEmitter` | Simulated in this Lab (`DOMElement`) |
| :--- | :--- | :--- | :--- |
| **Registering Listener** | `target.addEventListener(type, fn)` | `emitter.on(event, fn)` | `element.addEventListener()` (wraps `.on`) |
| **Deregistering Listener** | `target.removeEventListener(type, fn)` | `emitter.removeListener(event, fn)` | `element.removeEventListener()` (wraps `.removeListener`) |
| **Triggering Event** | `target.dispatchEvent(eventObject)` | `emitter.emit(event, ...args)` | `element.dispatchEvent()` (wraps `.emit`) |
| **Hierarchy & Bubbling** | Tree-based bubbling (child $\rightarrow$ parent $\rightarrow$ window) | Flat, single-object emitter (no bubbling by default) | Modeled via `.parentElement` tree traversal |
| **Event Object** | Rich `Event` instance (`target`, `currentTarget`, `bubbles`, etc.) | Free-form arguments passed to `.emit()` | Modeled via custom `DOMEvent` class |

### Key Concepts Simulated
1. **Event Bubbling**:
   When an event occurs on an element, its handler runs first, followed by its parent's handler, and so on up the hierarchy chain.
2. **`target` vs. `currentTarget`**:
   - `target`: The original element where the event was initiated/dispatched.
   - `currentTarget`: The element currently handling the event as it bubbles up.
3. **`stopPropagation()`**:
   Stops the event from traveling up the DOM tree, preventing ancestor listeners from receiving the event.
4. **`preventDefault()`**:
   Signals that the default browser action should not be executed (e.g., stopping form submission or preventing page reload).

---
