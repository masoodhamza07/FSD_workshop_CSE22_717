/**
 * ==============================================================================
 * Experiment 1: Custom EventEmitter
 * ==============================================================================
 * Course: Full Stack Development Workshop - I
 * Description:
 *   Demonstrates the creation and usage of a custom EventEmitter class by
 *   extending Node.js's built-in `events.EventEmitter`.
 *   Showcases:
 *     - Class inheritance with EventEmitter
 *     - Registering listeners with .on()
 *     - One-time listeners with .once()
 *     - Emitting events with parameters using .emit()
 *     - Removing listeners with .removeListener()
 *     - Inspecting active listeners using .listenerCount() and .eventNames()
 * ==============================================================================
 */

// Import the built-in events module using CommonJS syntax
const EventEmitter = require('events');

/**
 * CustomEmitter class extending EventEmitter
 * Encapsulates custom event logic and provides helper methods.
 */
class CustomEmitter extends EventEmitter {
  constructor(emitterName = 'UserEventEmitter') {
    // Must call super() to initialize EventEmitter internal state
    super();
    this.emitterName = emitterName;
  }

  /**
   * Helper method to trigger the 'greet' event
   * @param {string} userName - The name of the person being greeted
   */
  triggerGreet(userName) {
    console.log(`\n>>> [${this.emitterName}] Dispatching 'greet' event for: ${userName}`);
    this.emit('greet', userName);
  }

  /**
   * Helper method to trigger the 'exit' event
   * @param {string} reason - The reason for exiting
   */
  triggerExit(reason) {
    console.log(`\n>>> [${this.emitterName}] Dispatching 'exit' event. Reason: ${reason}`);
    this.emit('exit', reason);
  }
}

// ==============================================================================
// Driver Code / Demonstration
// ==============================================================================

console.log('========================================================');
console.log('       EXPERIMENT 1: CUSTOM EVENTEMITTER DEMO          ');
console.log('========================================================');

// Step 1: Create an instance of CustomEmitter
const myEmitter = new CustomEmitter('WorkshopNotifier');

// Define named listener functions (named functions are required for removeListener)
const persistentGreetingListener = (name) => {
  console.log(`  [Listener 1 (.on)]: Hello, ${name}! Welcome to Node.js Event-Driven Architecture.`);
};

const secondaryGreetingListener = (name) => {
  console.log(`  [Listener 2 (.on)]: Greetings, ${name}! Your session is active.`);
};

const oneTimeGreetingListener = (name) => {
  console.log(`  [Listener 3 (.once)]: First-time welcome for ${name}! This notification appears ONLY ONCE.`);
};

const exitListener = (reason) => {
  console.log(`  [Listener (.on)]: Goodbye! Session terminated. Details: "${reason}".`);
};

// Step 2: Register event listeners
console.log('\n--- 1. Registering Event Listeners ---');

// Register persistent listeners using .on()
myEmitter.on('greet', persistentGreetingListener);
myEmitter.on('greet', secondaryGreetingListener);
console.log('Registered 2 persistent listeners for "greet" using .on()');

// Register a one-time listener using .once()
myEmitter.once('greet', oneTimeGreetingListener);
console.log('Registered 1 one-time listener for "greet" using .once()');

// Register a listener for 'exit'
myEmitter.on('exit', exitListener);
console.log('Registered 1 persistent listener for "exit" using .on()');

// Inspect current listeners
console.log(`\nActive events: [${myEmitter.eventNames().join(', ')}]`);
console.log(`Count of listeners for 'greet': ${myEmitter.listenerCount('greet')}`);
console.log(`Count of listeners for 'exit': ${myEmitter.listenerCount('exit')}`);

// Step 3: First emission of 'greet'
console.log('\n--- 2. First Emission of "greet" (with sample data "Alice") ---');
myEmitter.triggerGreet('Alice');

// Step 4: Second emission of 'greet' (shows that .once listener has automatically detached)
console.log('\n--- 3. Second Emission of "greet" (with sample data "Bob") ---');
console.log(`Notice: Listener count for 'greet' is now: ${myEmitter.listenerCount('greet')} (oneTime listener removed automatically)`);
myEmitter.triggerGreet('Bob');

// Step 5: Removing a specific listener using .removeListener()
console.log('\n--- 4. Removing a Listener with .removeListener() ---');
console.log('Removing "persistentGreetingListener" from "greet" event...');
myEmitter.removeListener('greet', persistentGreetingListener);

console.log(`Listener count for 'greet' after removal: ${myEmitter.listenerCount('greet')}`);

// Step 6: Third emission of 'greet' (shows only remaining listener executes)
console.log('\n--- 5. Third Emission of "greet" (with sample data "Charlie") ---');
myEmitter.triggerGreet('Charlie');

// Step 7: Emitting the 'exit' event
console.log('\n--- 6. Emitting "exit" Event ---');
myEmitter.triggerExit('User requested logout after completing the workshop lab');

console.log('\n========================================================');
console.log('              EXPERIMENT 1 COMPLETED                    ');
console.log('========================================================\n');
