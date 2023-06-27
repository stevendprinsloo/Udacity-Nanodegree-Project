<template>
  <BasePage>
    <template #main>
      <div class="d-flex align-items-center py-4 border-bottom">
        <h3 class="mb-0 me-4">Profile</h3>
        <button @click="logout()" class="btn btn-outline-secondary ms-auto">
          <span>Sign out</span>
          <i class="bi bi-box-arrow-right ms-2"></i>
        </button>
      </div>
      <div class="mt-2 px-2 py-3">
        <div class="row">
          <div class="col col-auto me-2">
            <img
              style="max-width: 150px"
              class="rounded-3"
              :src="user.picture"
            />
          </div>
          <div class="col col-4">
            <label class="form-label">Name</label>
            <BFormInput v-model="user.nickname" disabled></BFormInput>
          </div>
          <div class="col col-4">
            <label class="form-label">Email / Username</label>
            <BFormInput v-model="user.email" disabled></BFormInput>
          </div>
        </div>
        <div class="row mt-5">
          <div class="col-12">
            <div>
              <label class="form-label">JWT Token </label>
              <div class="w-100 p-3 bg-light border rounded-2">
                <code class="w-100" style="width: 100%; min-height: 300px">
                  {{ jwt.value }}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 border-top pt-4">
        <div class="row">
          <div class="col-12">
            <h4 class="mb-3">Permissions</h4>
            <ul style="list-style: none" class="p-0 m-0">
              <template v-for="(item, index) in permissions">
                <li class="badge bg-secondary me-1 fs-6 fw-normal" :key="index">
                  {{ item }}
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="isSigningOut"
      class="position-fixed bg-light w-100 h-100 d-flex align-items-center justify-content-center"
      style="z-index: 99999; top: 0; left: 0"
    >
      <div class="card p-4 shadow-sm">
        <div
          class="card-body d-flex align-items-center justify-content-center flex-column"
        >
          <div>
            <span
              class="spinner-border me-4"
              style="width: 1.2rem; height: 1.2rem"
              role="status"
            ></span>
            <span>Signing Out...</span>
          </div>
        </div>
      </div>
    </div>
  </BasePage>
</template>

<script>
import { BasePage } from "@/components";
// import { BFormInput } from "bootstrap-vue";

export default {
  name: "ActorWrapper",
  data() {
    return {
      isSigningOut: false,
    };
  },
  components: {
    BasePage,
    // BFormInput,
  },
  computed: {
    user() {
      return this.$auth.user;
    },
    jwt() {
      return JSON.parse(window.localStorage.getItem("jwt"));
    },
    permissions() {
      return this.$store.getters["getPermissions"];
    },
  },
  methods: {
    logout() {
      this.isSigningOut = true;
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
};
</script>
