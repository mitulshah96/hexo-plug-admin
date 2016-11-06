'use strict';

module.exports = function(ctx) {
    var consl = ctx.extend.console;

    consl.register('clone', 'Clone git repository and push it into plugin.', {
        desc: 'Create a new client folder at the specified path or the current directory.'
    }, require('./clone'));
  
}