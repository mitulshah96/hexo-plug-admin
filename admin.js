'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Context = require('./context/index');

function entry(hexo, app) {
    // get current working directory
    var cwd = process.cwd();
    // process arguments from terminal
    var args = process.argv.slice(3);
    // create new context for hexo admin
    var hexo = new Context(cwd, args);

    require('./console')(hexo);
    var cmd = '';
    cmd = args.shift();
    if(!!cmd && hexo.extend.console.get(cmd)) {
        hexo.call(cmd, args)
    }
 }

 module.exports = entry;