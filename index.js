'use strict';

hexo.extend.filter.register('server_middleware', function (app) {
  require('./admin')(hexo, app);
});