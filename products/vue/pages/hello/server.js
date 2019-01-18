const Vue = require('vue');
const renderer = require('vue-server-renderer').createRenderer();
import App from './app.vue';

import { testModule } from '../../service';

export const prefetch = function() {
  return [ testModule.getUser ];
};

export const render = function(serverSideData) {
  App.el = '#root';
  console.log('test');
  const serverApp = new Vue(App);
  console.log(serverApp);
  return renderer.renderToString(serverApp);
}
