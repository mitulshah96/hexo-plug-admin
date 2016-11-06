'use strict';

var ConsoleExtend = require('../extend/console');

function Context(base, args) {
    base = base || process.cwd();
    args = args || {};

    this.extend = {
        console: new ConsoleExtend()
    };
}

Context.prototype.call = function(name, args, callback) {
    if (!callback && typeof args === 'function') {
        callback = args;
        args = {};
    }

    var self = this;
    return new Promise(function(resolve, reject) {
        var c = self.extend.console.get(name);
        if (c) {
            c.call(self, args).then(resolve, reject);
        } else {
            reject(new Error('Console `' + name + '` has not been registered yet!'));
        }
    })

}

module.exports = Context;