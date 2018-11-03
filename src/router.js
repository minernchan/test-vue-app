import Vue from "vue";
import Router from "vue-router";
import firebase from 'firebase';
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import Career from "./views/Career.vue";
import TimeSeries from "./views/TimeSeries.vue";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        requiresAuth:true
      }
    },
    {
      path: "/career",
      name: "career",
      component: Career,
      meta: {
        requiresAuth:true
      }
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      //component: () =>
      //  import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/timeseries",
      name: "timeseries",
      component: TimeSeries,
      meta: {
        requiresAuth:true
      }
    },
  ]
});

export default router;
