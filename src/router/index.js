import Vue from "vue";
import VueRouter from "vue-router";
import { Dashboard } from "@/components";
import { Profile } from "@/components/profile";
import { Login } from "@/components/security";
import { store } from "@/store";

import {
  MovieList,
  MovieSingle,
  MovieWrapper,
  MovieView,
} from "@/components/movies";
import {
  ActorList,
  ActorSingle,
  ActorWrapper,
  ActorView,
} from "@/components/actors";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "app_login",
    component: Login,
    meta: {
      pageTitle: "Dashboard",
    },
  },
  {
    path: "/login-results",
    name: "app_login_results",
    component: Login,
    meta: {
      pageTitle: "Dashboard",
    },
  },
  {
    path: "/dashboard",
    name: "app_dashboard",
    component: Dashboard,
    meta: {
      pageTitle: "Dashboard",
    },
  },
  {
    path: "/movies",
    name: "app_movies",
    component: MovieWrapper,
    children: [
      {
        path: "",
        name: "app_movies_list",
        component: MovieList,
      },
      {
        path: ":id/view",
        name: "app_movies_view",
        component: MovieView,
      },
      {
        path: "new",
        name: "app_movies_new",
        component: MovieSingle,
      },
      {
        path: ":id/edit",
        name: "app_movies_edit",
        component: MovieSingle,
      },
    ],
  },
  {
    path: "/actors",
    name: "app_actors",
    component: ActorWrapper,
    children: [
      {
        path: "",
        name: "app_actors_list",
        component: ActorList,
      },
      {
        path: ":id/view",
        name: "app_actors_view",
        component: ActorView,
      },
      {
        path: "new",
        name: "app_actors_new",
        component: ActorSingle,
      },
      {
        path: ":id/edit",
        name: "app_actors_edit",
        component: ActorSingle,
      },
    ],
  },
  {
    path: "/profile",
    name: "app_profile",
    component: Profile,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach(async (to, from, next) => {
  // console.log("to route", to);
  // console.log("to route", to.name);
  console.log("getIsReloaded?", !store.getters["getIsReloaded"]);
  if (!store.getters["getIsReloaded"] && !store.getters["getAccessToken"]) {
    console.log("redirect to app login router-link");
    await store.dispatch("setReloadedPath", to.path);
    await store.dispatch("setIsReloaded", true);
    next({ name: "app_login" });
  }
  next();
});

export default router;
