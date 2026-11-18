const EventEmitter = require('events');

class SchoolBell extends EventEmitter {
  constructor() {
    super();

    this.on('classStart', () => {
      console.log('EVENT: Class is starting. Students, please take your seats.');
    });

    this.on('classEnd', () => {
      console.log('EVENT: Class has ended. Students, please leave the classroom.');
    });
  }

  ringBell(source) {
    console.log(`RING BELL (${source})`);
  }
}

const bell = new SchoolBell();

console.log('1. Synchronous: School bell system initialized.');

bell.emit('classStart');

setTimeout(() => {
  bell.ringBell('setTimeout');
}, 0);

setImmediate(() => {
  bell.ringBell('setImmediate');
});

process.nextTick(() => {
  bell.ringBell('process.nextTick');
});

bell.emit('classEnd');

console.log('2. Synchronous: Main script finished. Event loop takes over.');
