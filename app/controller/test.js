'use strict';

module.exports = app => {
  class TestController extends app.Controller {
    * getUser() {
      this.ctx.body = {
        data: {
          userId: '123',
          userName: 'test',
        },
      };
    }
  }
  return TestController;
};
