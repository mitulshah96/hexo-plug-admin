'use strict';

var serveStatic = require('serve-static');
var pathFn = require('path');
var bodyParser = require('body-parser');
var api = require('./api');

module.exports = function(hexo, app) {
    // middleware for serving static files
    app.use(hexo.config.root + 'admin/', serveStatic(pathFn.join(__dirname, '../client')));

    // middleware for parsing body 
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({
        limit: '10mb'
    }));

    app.use((req, res, next) => {
        res.status = function(code) {
            res.statusCode = code;
            return res;
        };
        res.send = function(data) {
            res.end(data);
        };
        res.json = function(data) {
            res.setHeader('Content-type', 'application/json');
            res.end(JSON.stringify(data));
        };
        next();
    });

    app.use('/api', api(app, hexo));
}