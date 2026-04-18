const dayjs = require('dayjs');

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

function getTimestamp() {
    return `[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`;
}

console.log = function (...args) {
    originalLog.apply(console, [getTimestamp(), ...args]);
};

console.error = function (...args) {
    originalError.apply(console, [getTimestamp(), ...args]);
};

console.warn = function (...args) {
    originalWarn.apply(console, [getTimestamp(), ...args]);
};