import Vue from 'vue';
import App from './app.vue';

Vue.config.productionTip = true;

new Vue(Vue.util.extend({
  el: '#root'
}, App));

