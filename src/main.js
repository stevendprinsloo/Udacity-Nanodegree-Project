import "bootstrap/dist/js/bootstrap.min";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { store } from "./store";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import VueJwtDecode from "vue-jwt-decode";
require("dotenv").config();
// Import the Auth0 configuration
import { domain, clientId, audience } from "@/../auth_config.json";
import { Auth0Plugin } from "./auth";

Vue.use(VueJwtDecode);

const redirectUri = process.env.REDIRECT_URI;

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  redirectUri,
  onRedirectCallback: (appState) => {
    router.push(
      appState && appState.targetPath
        ? appState.targetPath
        : window.location.pathname
    );
  },
});

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

// Vue.use(
//   createAuth0({
//     domain: "dev-ciko6qxd.us.auth0.com",
//     client_id: "NHLb3O0L2oJgq1uBsdZAbDgPZjsRem67",
//     redirect_uri: "https://127.0.0.1:5000/login-results",
//     audience: "casting_agency",
//   })
// );

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
