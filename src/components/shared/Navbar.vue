<template>
  <div>
    <header>
      <div class="px-3 bg-dark text-white">
        <div class="container">
          <div
            class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
          >
            <router-link
              :to="{ name: 'app_dashboard' }"
              class="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none"
            >
              <h4 class="fw-bolder">Thats-A-Wrap</h4>
            </router-link>

            <ul
              class="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small me-4"
            >
              <li>
                <router-link
                  :to="{ name: 'app_dashboard' }"
                  :class="{ active: $route.name.startsWith('app_dashboard') }"
                  class="nav-link text-white py-3"
                >
                  <i
                    class="bi bi-speedometer d-block mx-auto mb-1 text-center fs-4"
                    :class="{}"
                    style="line-height: 0.5"
                  ></i>
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'app_movies_list' }"
                  :class="{ active: $route.name.startsWith('app_movie') }"
                  class="nav-link text-white py-3"
                >
                  <i
                    class="bi d-block mx-auto mb-1 text-center fs-4"
                    :class="
                      $route.name.startsWith('app_movies')
                        ? 'bi-camera-reels-fill'
                        : 'bi-camera-reels'
                    "
                    style="line-height: 0.5"
                  ></i>
                  Movies
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'app_actors_list' }"
                  :class="{ active: $route.name.startsWith('app_actor') }"
                  class="nav-link text-white py-3"
                >
                  <i
                    class="bi d-block mx-auto mb-1 text-center fs-4"
                    :class="
                      $route.name.startsWith('app_actors')
                        ? 'bi-people-fill'
                        : 'bi-people'
                    "
                    style="line-height: 0.5"
                  ></i>
                  Actors
                </router-link>
              </li>
            </ul>
            <div class="flex-shrink-0 dropdown">
              <a
                ref="profileToggle"
                @click="dropDown.toggle()"
                class="d-block link-dark text-decoration-none dropdown-toggle text-white"
                id="dropdownUser2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  :src="
                    user.picture
                      ? user.picture
                      : 'https://via.placeholder.com/35x35'
                  "
                  alt="mdo"
                  width="32"
                  height="32"
                  class="rounded-circle"
                />
              </a>
              <ul
                class="dropdown-menu text-small shadow"
                aria-labelledby="dropdownUser2"
              >
                <li>
                  <router-link
                    :to="{ name: 'app_profile' }"
                    class="dropdown-item"
                    >Profile</router-link
                  >
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a class="dropdown-item hoverable" @click="logout"
                    >Sign out</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--    <div class="px-3 py-2 border-bottom mb-3">-->
      <!--      <div class="container d-flex flex-wrap justify-content-center">-->
      <!--        <form class="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto" role="search">-->
      <!--          <input-->
      <!--            type="search"-->
      <!--            class="form-control"-->
      <!--            placeholder="Search..."-->
      <!--            aria-label="Search"-->
      <!--          />-->
      <!--        </form>-->

      <!--        <div class="text-end">-->
      <!--          <button type="button" class="btn btn-light text-dark me-2">-->
      <!--            Login-->
      <!--          </button>-->
      <!--          <button type="button" class="btn btn-primary">Sign-up</button>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </div>-->
    </header>
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
  </div>
</template>

<script>
import { Dropdown } from "bootstrap";
// import { BDropdown, BDropdownItem } from "bootstrap-vue";

export default {
  name: "TheNavbar",
  data() {
    return {
      dropDown: null,
      isSigningOut: false,
    };
  },
  mounted() {
    if (this.$refs) {
      this.initialiseDropDown(this.$refs.profileToggle);
    }
  },
  computed: {
    user() {
      return this.$auth.user;
    },
  },
  methods: {
    initialiseDropDown(ref) {
      this.dropDown = new Dropdown(ref);
    },
    logout() {
      this.isSigningOut = true;
      this.$auth.logout({
        returnTo: window.location.origin,
      });
    },
  },
};
</script>
