/* eslint no-console:0 */

const color = require('colorette');
const { inspect } = require('util');
const { isFunction, isNil, isString } = require('lodash');

class Logger {
  constructor(config) {
    const {
      log: { debug, warn, error, deprecate, inspectionDepth } = {},
    } = config;
    this._inspectionDepth = inspectionDepth || 5;
    this._debug = debug;
    this._warn = warn;
    this._error = error;
    this._deprecate = deprecate;
  }

  _log(message, userFn, colorFn) {
    if (!isNil(userFn) && !isFunction(userFn)) {
      throw new TypeError('Extensions to knex logger must be functions!');
    }

    if (isFunction(userFn)) {
      userFn(message);
      return;
    }

    if (!isString(message)) {
      message = inspect(message, { depth: this._inspectionDepth });
    }

    console.log(colorFn ? colorFn(message) : message);
  }

  debug(message) {
    this._log(message, this._debug);
  }

  warn(message) {
    this._log(message, this._warn, color.yellow);
  }

  error(message) {
    this._log(message, this._error, color.red);
  }

  deprecate(method, alternative) {
    const message = `${method} is deprecated, please use ${alternative}`;

    this._log(message, this._deprecate, color.yellow);
  }
}

module.exports = Logger;
