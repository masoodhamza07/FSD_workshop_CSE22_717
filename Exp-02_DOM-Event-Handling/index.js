/**
 * ==============================================================================
 * Experiment 2: Simulate DOM-like Event Handling in Node.js
 * ==============================================================================
 * Course: Full Stack Development Workshop - I
 * Description:
 *   Simulates browser DOM event handling architecture in a Node.js environment.
 *   Extends Node.js `events.EventEmitter` to build a `DOMElement` class supporting:
 *     - addEventListener() (mapped to .on())
 *     - removeEventListener() (mapped to .removeListener())
 *     - dispatchEvent() (mapped to .emit() with bubbling support)
 *     - Event Bubbling (child -> parent delegation)
 *     - Event propagation control (stopPropagation, preventDefault)
 *     - Event object modeling (target, currentTarget, type, detail)
 * ==============================================================================
 */

const EventEmitter = require('events');

/**
 * DOMEvent represents a synthetic DOM Event object.
 * Contains metadata about the event and control flags for bubbling/default behavior.
 */
class DOMEvent {
  constructor(type, detail = {}, bubbles = true) {
    this.type = type;                      // e.g., 'click', 'input', 'submit'
    this.detail = detail;                  // Custom payload/data attached to event
    this.bubbles = bubbles;                // Whether the event propagates to parent
    this.target = null;                    // The initial element where event was dispatched
    this.currentTarget = null;             // The element whose event listener is currently executing
    this.timeStamp = Date.now();           // Creation timestamp
    this.propagationStopped = false;       // Flag set by stopPropagation()
    this.defaultPrevented = false;         // Flag set by preventDefault()
  }

  /**
   * Prevents further propagation of the current event in the bubbling phase.
   */
  stopPropagation() {
    this.propagationStopped = true;
    console.log(`    [Event] stopPropagation() called on <${this.currentTarget.tagName}#${this.currentTarget.id}>.`);
  }

  /**
   * Cancels the event if it is cancelable.
   */
  preventDefault() {
    this.defaultPrevented = true;
    console.log(`    [Event] preventDefault() called on <${this.currentTarget.tagName}#${this.currentTarget.id}>.`);
  }
}

/**
 * DOMElement simulates a DOM node with parent-child hierarchy and event capabilities.
 */
class DOMElement extends EventEmitter {
  constructor(tagName, id = '') {
    super();
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.parentElement = null;             // Reference to parent node for bubbling
    this.children = [];
    this.value = '';                       // Simulated attribute for input elements
  }

  /**
   * Appends a child element and establishes parent-child linkage.
   * @param {DOMElement} child
   */
  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
  }

  /**
   * DOM-like alias for EventEmitter's .on()
   * @param {string} eventType - e.g. 'click', 'input', 'submit'
   * @param {Function} listener - Callback function
   */
  addEventListener(eventType, listener) {
    this.on(eventType, listener);
  }

  /**
   * DOM-like alias for EventEmitter's .removeListener()
   * @param {string} eventType - e.g. 'click', 'input', 'submit'
   * @param {Function} listener - Callback function reference to remove
   */
  removeEventListener(eventType, listener) {
    this.removeListener(eventType, listener);
  }

  /**
   * Dispatches an event to this element, triggering listeners, and
   * recursively bubbles up to parent elements if bubbling is enabled.
   * @param {DOMEvent|string} event
   * @returns {boolean} False if event was cancelled with preventDefault(), true otherwise.
   */
  dispatchEvent(event) {
    // If a simple string was passed, wrap it into a DOMEvent
    if (typeof event === 'string') {
      event = new DOMEvent(event);
    }

    // Set the initial event target
    if (!event.target) {
      event.target = this;
    }

    // Update current target to the element currently handling the event
    event.currentTarget = this;

    // Trigger local listeners registered on this element
    this.emit(event.type, event);

    // Event Bubbling Phase:
    // If bubbling is allowed, propagation hasn't been stopped, and a parent exists:
    if (event.bubbles && !event.propagationStopped && this.parentElement) {
      this.parentElement.dispatchEvent(event);
    }

    return !event.defaultPrevented;
  }

  /**
   * Returns string representation of the DOM element
   */
  toString() {
    return `<${this.tagName}${this.id ? ` id="${this.id}"` : ''}>`;
  }
}

// ==============================================================================
// Driver Code / Demonstration
// ==============================================================================

console.log('==================================================================');
console.log('        EXPERIMENT 2: SIMULATE DOM-LIKE EVENT HANDLING            ');
console.log('==================================================================');

// Step 1: Create simulated DOM hierarchy:
// <FORM id="login-form">
//    ├── <INPUT id="username-input" />
//    └── <BUTTON id="submit-btn" />
console.log('\n--- 1. Building Simulated DOM Tree ---');
const form = new DOMElement('form', 'login-form');
const input = new DOMElement('input', 'username-input');
const button = new DOMElement('button', 'submit-btn');

form.appendChild(input);
form.appendChild(button);

console.log(`Created elements:`);
console.log(`  Parent:  ${form}`);
console.log(`  Child 1: ${input} (child of ${form})`);
console.log(`  Child 2: ${button} (child of ${form})`);

// Step 2: Register Event Listeners
console.log('\n--- 2. Registering Event Listeners (addEventListener) ---');

// Listener for input on <input>
input.addEventListener('input', (e) => {
  console.log(`  [Listener on ${e.currentTarget}]: Text input received -> "${e.detail.value}"`);
  console.log(`    Target: ${e.target}, CurrentTarget: ${e.currentTarget}`);
});

// Listener for input bubbled up to <form>
form.addEventListener('input', (e) => {
  console.log(`  [Bubbled to ${e.currentTarget}]: Form observed child input change from ${e.target}`);
});

// Click listener on <button>
const buttonClickListener = (e) => {
  console.log(`  [Listener on ${e.currentTarget}]: Button was clicked!`);
  console.log(`    Target: ${e.target}, CurrentTarget: ${e.currentTarget}`);
};
button.addEventListener('click', buttonClickListener);

// Click listener on <form> (observes bubbled clicks)
const formClickListener = (e) => {
  console.log(`  [Bubbled to ${e.currentTarget}]: Form intercepted click from child ${e.target}!`);
};
form.addEventListener('click', formClickListener);

// Submit listener on <form>
form.addEventListener('submit', (e) => {
  console.log(`  [Listener on ${e.currentTarget}]: Form submission triggered with payload:`, e.detail);
  if (!e.detail.isValid) {
    console.log('  [Validation]: Form data is invalid! Calling preventDefault()...');
    e.preventDefault();
  } else {
    console.log('  [Validation]: Form data valid. Processing submission...');
  }
});

console.log('All event listeners successfully registered.');

// Step 3: Simulate 'input' Event
console.log('\n--- 3. Simulating "input" Event on <input#username-input> ---');
input.value = 'john_doe';
const inputEvent = new DOMEvent('input', { value: input.value }, true);
console.log(`Dispatching 'input' event from ${input}...`);
input.dispatchEvent(inputEvent);
