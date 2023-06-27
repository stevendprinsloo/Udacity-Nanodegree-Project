<template>
  <section
    class="h-100 w-100 position-absolute bg-light py-5"
    style="left: 0; top: 0; overflow: auto"
  >
    <div
      class="w-100 d-flex justify-content-center align-items-center"
      style="min-height: 100%"
    >
      <div class="card p-4 shadow-sm">
        <div
          class="card-body d-flex align-items-center justify-content-center flex-column"
        >
          <h2 class="fs-3" v-if="!$auth.loading">Casting Agency Login</h2>
          <div v-if="!$auth.loading">
            <p
              v-if="!$auth.isAuthenticated"
              class="text-secondary text-center"
              style="font-size: 13px"
            >
              Please click the button below to login
            </p>
            <p
              v-if="$auth.isAuthenticated"
              class="text-secondary text-center"
              style="font-size: 13px"
            >
              You are logged in! <br />
              Click the button below to logout.
            </p>
          </div>
          <div>
            <!-- show login when not authenticated -->
            <div class="w-100 d-flex justify-content-center">
              <button
                class="btn btn-lg btn-primary mt-4"
                v-if="!$auth.isAuthenticated && !$auth.loading"
                @click="login"
                :disabled="$auth.loading"
              >
                <span>Log in</span>
              </button>
              <span v-if="$auth.loading">
                Loading
                <span
                  class="spinner-border ms-2"
                  style="width: 1.2rem; height: 1.2rem"
                  role="status"
                ></span>
              </span>
              <!-- show logout when authenticated -->
              <button
                class="btn btn-lg btn-primary mt-4"
                v-if="$auth.isAuthenticated"
                @click="logout"
              >
                Log out
              </button>
            </div>

            <div
              class="mt-5 text-center"
              v-if="!$auth.isAuthenticated && !$auth.loading"
            >
              <div class="pb-3 border-bottom">
                <button
                  class="btn btn-secondary btn-sm"
                  @click="isShowCreds = !isShowCreds"
                >
                  <span v-if="!isShowCreds">Show Credentials</span
                  ><span v-if="isShowCreds">Hide Credentials</span>
                </button>
              </div>
              <div class="p-2" v-if="isShowCreds">
                <h4 class="mt-3 mb-3 pb-3">Login Credentials:</h4>
                <div class="border-bottom">
                  <h5>Casting Assistant:</h5>
                  <span
                    class="badge d-inline-block text-dark bg-light border mt-2 mb-2"
                    style="font-size: 14px; transform: translateY(-3px)"
                    v-b-popover.hover.top="
                      'list:movies, list:actors, view:movies, view:actors'
                    "
                    title="Permissions"
                    >See Permissions +</span
                  >
                  <p>
                    Username: manager@gmail.com<br />
                    Password: manager@123
                  </p>
                </div>
                <div class="border-bottom pt-3 pb-3">
                  <h5>Casting Director:</h5>
                  <span
                    class="badge d-inline-block text-dark bg-light border mt-2 mb-2"
                    style="font-size: 14px; transform: translateY(-3px)"
                    v-b-popover.hover.top="
                      'list:movies, list:actors, view:movies, view:actors, edit:actors, edit:movies, add:actors, delete:actors'
                    "
                    title="Permissions"
                    >See Permissions +</span
                  >
                  <p>
                    Username: director@gmail.com<br />
                    Password: director@123
                  </p>
                </div>
                <div class="pb-3 pt-3 pb-3">
                  <h5>Executive Producer:</h5>
                  <span
                    class="badge d-inline-block text-dark bg-light border mt-2 mb-2"
                    style="font-size: 14px; transform: translateY(-3px)"
                    v-b-popover.hover.top="
                      'list:movies, list:actors, view:movies, view:actors, edit:actors, edit:movies, add:actors, add:movies, delete:actors, delete:movies'
                    "
                    title="Permissions"
                    >See Permissions +</span
                  >
                  <p>
                    Username: executive@gmail.com<br />
                    Password: executive@123
                  </p>
                </div>
              </div>
            </div>

            <div
              v-if="$auth.isAuthenticated"
              class="w-100 d-flex justify-content-center"
            >
              <button
                class="btn btn-sm btn-outline-secondary mt-4"
                @click="getToken"
                :disabled="accessToken"
              >
                <span v-if="accessToken">Token Saved!</span>
                <span v-else>Get Token</span>
              </button>
              <router-link
                v-if="accessToken"
                class="btn-primary btn mt-2"
                :to="{ name: 'app_dashboard' }"
                >App Dashboard
              </router-link>
            </div>
          </div>
          <div v-if="$auth.error">
            {{ $auth.error }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import bootstrap from "bootstrap";

const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]'
);
[...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);

export default {
  name: "Login",
  data() {
    return {
      accessToken: null,
      isShowCreds: true,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$auth.isAuthenticated;
    },
    error() {
      return this.$auth.error;
    },
  },
  watch: {
    isAuthenticated: {
      async handler(val) {
        if (val) {
          await this.handleRefresh();
        }
      },
    },
    error: {
      async handler(val) {
        if (val) {
          await this.$auth.logout();
        }
      },
      immediate: true,
    },
  },
  async created() {
    // if (localStorage.getItem("jwt") && localStorage.getItem("permissions")) {
    //   const token = localStorage.getItem("jwt");
    //   const permissions = localStorage.getItem("permissions");
    //   await this.$store.dispatch("setAccessToken", token);
    //   await this.$store.dispatch("setAuthPermissions", permissions);
    //   await this.$router.push({ name: "app_dashboard" });
    // }
  },
  methods: {
    // Log the user in
    async handleRefresh() {
      await this.getToken();
      await this.handleRedirect();
    },
    async handleRedirect() {
      const reloadedPath = this.$store.getters["getReloadedPath"];
      if (reloadedPath && reloadedPath !== "/") {
        await this.$router.push({ path: reloadedPath });
      } else {
        await this.$router.push({ name: "app_dashboard" });
      }
      await this.$store.dispatch("setIsReloaded", false);
      await this.$store.dispatch("setReloadedPath", null);
    },
    async login() {
      await this.$auth.loginWithRedirect();
      await this.getToken();
      await this.handleRedirect();
    },
    async getToken() {
      let token;
      if (localStorage.getItem("jwt") && localStorage.getItem("permissions")) {
        token = localStorage.getItem("jwt");
      } else {
        token = await this.$auth.getTokenSilently();
        const jwt = {
          value: token,
          expiry: Date.now + 86400000,
        };
        localStorage.setItem("jwt", JSON.stringify(jwt));
      }
      const permissions = this.$jwtDec.decode(token).permissions;
      await this.$store.dispatch("setAccessToken", token);
      await this.$store.dispatch("setAuthPermissions", permissions);
      this.accessToken = token;
      await this.$router.push({ name: "app_dashboard" });
    },
    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
};
</script>
