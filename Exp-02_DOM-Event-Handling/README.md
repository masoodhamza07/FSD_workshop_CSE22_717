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

## Code Explanation

1. **`DOMEvent` Class**:
   Represents the event object. Stores metadata including `type`, `detail`, `target`, `currentTarget`, `bubbles`, and state flags `propagationStopped` and `defaultPrevented`. Provides `stopPropagation()` and `preventDefault()` methods.

2. **`DOMElement` Class**:
   Extends `EventEmitter` to simulate a DOM element:
   - Holds attributes: `tagName`, `id`, `parentElement`, `children`, and `value`.
   - `appendChild(child)`: Sets up parent-child pointer relationships.
   - `addEventListener(event, listener)`: Wraps `this.on()`.
   - `removeEventListener(event, listener)`: Wraps `this.removeListener()`.
   - `dispatchEvent(event)`:
     - Sets `event.target` (if not already set).
     - Sets `event.currentTarget` to `this`.
     - Calls `this.emit(event.type, event)` to run local listeners.
     - Checks `if (event.bubbles && !event.propagationStopped && this.parentElement)`: If true, delegates to `this.parentElement.dispatchEvent(event)`, triggering recursive upward bubbling.

3. **Simulated Scenarios**:
   - **DOM Hierarchy**: A `<FORM id="login-form">` containing `<INPUT id="username-input">` and `<BUTTON id="submit-btn">`.
   - **Input Event**: Typing into the input field triggers the input's listener, and bubbles up to the form listener.
   - **Click Event & Bubbling**: Clicking the button triggers the button's listener (`currentTarget = BUTTON`), then bubbles to the form (`currentTarget = FORM`).
   - **Halting Bubbling**: A listener calls `e.stopPropagation()`; the form does not receive the event.
   - **Removing Listener**: Using `removeEventListener` detaches the stopping listener; subsequent clicks bubble to the form again.
   - **Submit & preventDefault**: Submitting invalid form data triggers `e.preventDefault()`, which returns `false` to the caller.

---

## How to Run

### Prerequisites
- Node.js installed (v14.x or higher)

### Steps
1. Navigate to the experiment directory:
   ```bash
   cd Exp-02_DOM-Event-Handling
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
