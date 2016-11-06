'use strict';
var fs = require('hexo-fs');
var pathFn = require('path');
var spawn = require('hexo-util/lib/spawn');
var Promise = require('bluebird');

var ASSET_DIR = pathFn.join(__dirname, '../client');
var GIT_REPO_URL = 'https://github.com/GoogleChrome/voice-memos.git';

function initConsole(args) {
    fs.stat(ASSET_DIR).then(function(stat){
        if(!!stat) {
            console.log('Removing old copy of destination.');
            deleteFolderRecursive(ASSET_DIR);
            console.log('Removed old copy of destination.')
            cloneFolderRecursive().then(function() {
               console.log('Open http://localhost:4000/admin/')
            });
        }
    }).catch(function(err) {
        cloneFolderRecursive().then(function() {
            console.info('Open http://localhost:4000/admin/')
        });
    });
}

function cloneFolderRecursive() {
    var promise;
    promise = spawn('git', ['clone', '--recursive', GIT_REPO_URL, ASSET_DIR], {
        stdio: 'inherit'
    });

    return promise.catch(function(err) {
        console.log('Git clone failed. Please try again..!');
    }).then(function() {
        return Promise.all([
            removeGitDir(ASSET_DIR),
            removeGitModules(ASSET_DIR)
        ]);
    })
}

function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
        var curPath = path + "/" + file;
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
        } else { // delete file
            fs.unlinkSync(curPath);
        }
        });
        fs.rmdirSync(path);
    }
};

function removeGitDir(target) {
  var gitDir = pathFn.join(target, '.git');
  return fs.stat(gitDir).catch(function(err) {
    if (err.cause && err.cause.code === 'ENOENT') return;
    throw err;
  }).then(function(stats) {
    if (stats) {
      if (stats.isDirectory()) return fs.rmdir(gitDir);
      return fs.unlink(gitDir);
    }
  }).then(function() {
    return fs.readdir(target);
  }).map(function(path) {
    return pathFn.join(target, path);
  }).filter(function(path) {
    return fs.stat(path).then(function(stats) {
      return stats.isDirectory();
    });
  }).each(removeGitDir);
}

function removeGitModules(target) {
  return fs.unlink(pathFn.join(target, '.gitmodules')).catch(function(err) {
    if (err.cause && err.cause.code === 'ENOENT') return;
    throw err;
  });
}

module.exports = initConsole;