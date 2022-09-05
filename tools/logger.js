const chalk = require('chalk');
const moment = require('moment');

exports.log = (content, type = 'log') => {
    const timestamp = `[${moment().format('MM/DD HH:mm')}]`;
    switch (type) {
        case 'log': {
        return console.log(`${timestamp} ${chalk.blueBright(type.toUpperCase())} ${content} `);
        }
        case 'warn': {
        return console.log(`${timestamp} ${chalk.yellowBright(type.toUpperCase())} ${content} `);
        }
        case 'error': {
        return console.log(`${timestamp} ${chalk.redBright(type.toUpperCase())} ${content} `);
        }
        case 'cmd': {
        return console.log(`${timestamp} ${chalk.blackBright(type.toUpperCase())} ${content}`);
        }
        case 'ready': {
        return console.log(`${timestamp} ${chalk.greenBright(type.toUpperCase())} ${content}`);
        }
        case 'load': {
        return console.log(`${timestamp} ${chalk.magentaBright(type.toUpperCase())} ${content} `);
        }
        case 'event': {
        return console.log(`${timestamp} ${chalk.cyanBright(type.toUpperCase())} ${content} `);
        }
        default: throw new TypeError('Wrong type of logger kid!');
    }
};

exports.error = (...args) => this.log(...args, 'error');
exports.warn = (...args) => this.log(...args, 'warn');
exports.cmd = (...args) => this.log(...args, 'cmd');
exports.ready = (...args) => this.log(...args, 'ready');
exports.load = (...args) => this.log(...args, 'load');
exports.event = (...args) => this.log(...args, 'event');