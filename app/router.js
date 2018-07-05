'use strict';

module.exports = app => {
  app.get('/', 'home.index');
  app.get('/test/getUser', 'test.getUser');
  app.get('/products/multipage/pages/hello/index.html', 'products.hello');
  app.get('/products/multipage/pages/hello/client.bundle.js', 'products.hellojs');
};
