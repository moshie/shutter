const chalk = require('chalk');
const log = console.log;

module.exports = {

    success(message, prefix = 'Success') {
        log(!prefix ? message : chalk.green(`${prefix}: `) + message);
    },

    error(message, prefix = 'Error') {
        log(!prefix ? message : chalk.red(`${prefix}: `) + message);
    },

    info(message, prefix = '') {
        log(!prefix ? message : chalk.blue(`${prefix}: `) + message);
    },

    warning(message, prefix = '') {
        log(!prefix ? message : chalk.yellow(`${prefix}: `) + message);
    }
};