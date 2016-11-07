'use strict';

var fs              =  require('fs');
var connectRoute    =  require('connect-route');
var jwt             =  require('jsonwebtoken');
var jwtExpress      =  require('express-jwt');

function router(api, hexo) {
  api.post('/login', (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    let user = hexo.config.admin;
    if (name === user.name && password === user.password) {
      let token = jwt.sign(user.password, user.secret, {
        expiresInMinutes: user.expire
      });
      res.json({
        token
      });
    } else {
      res.status(400).send('Error name or password');
    }
  });  
}

module.exports = function(app, hexo) {
    app.use('/api', jwtExpress({
        secret: 'hello world'
    }).unless({
        path: ['/api/login']
    }));

    app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            return res.status(401).send('Unauthorized');
        } else if (err) {
            return res.status(500).send('Error occured');
        }
        return next();
    });

    return connectRoute(api => {
        router(api, hexo);
    });
}