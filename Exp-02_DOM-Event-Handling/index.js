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
