var fs = require('hexo-fs');

hexo.extend.filter.register('server_middleware', function(app) {
  console.log(app);
});