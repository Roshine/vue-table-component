import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Test from './Test.vue'
import ClientDemo from './ClientDemo.vue'
import ServerDemo from './ServerDemo.vue'
Vue.use(VueRouter);

const router = new VueRouter({
  routes:[
    {
      path:'/',
      component:ServerDemo
    },
    {
      path:'/test',
      component:Test
    },
    {
      path:'/client-demo',
      component:ClientDemo
    },
    {
      path:'server-demo',
      component:ServerDemo
    }
  ]
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<router-view/>',
  router
});
