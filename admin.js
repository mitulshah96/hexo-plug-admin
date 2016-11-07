'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Context = require('./context/index');
var chalk = require('chalk');
var ASSET_DIR = pathFn.join(__dirname, './client');

function entry(instance, app) {
    // instantiate chalk 
    chalk.enabled = true;
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

    fs.stat(ASSET_DIR).then(function(stat){
        if(stat) {
            // starting to create hexo api
            require('./api')(instance, app);
        }
    }).catch(function(err){
        console.log(chalk.red('Error!! No client folder exists.'));
        console.log(chalk.green('Please run < hexo serve clone > to bootstrap hexo admin'));
    });
    
 }

 module.exports = entry;