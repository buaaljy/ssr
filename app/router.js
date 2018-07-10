'use strict';

module.exports = app => {
  app.get('/', 'home.index');
  app.get('/test/getUser', 'test.getUser');
};
