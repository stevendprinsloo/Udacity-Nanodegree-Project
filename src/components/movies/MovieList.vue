<template>
  <div class="">
    <div class="d-flex align-items-center py-4 border-bottom">
      <h3 class="mb-0 me-4">Movies</h3>
      <router-link
        v-if="permissions.includes('add:movie')"
        tag="button"
        :to="{ name: 'app_movies_new' }"
        class="btn btn-primary ms-auto"
      >
        <i class="bi bi-plus-circle me-1"></i>
        <span>Add Movie</span>
      </router-link>
    </div>

    <div class="mt-2">
      <template v-if="isLoading">
        <LoadingAnimation />
      </template>
      <template v-else-if="unauthorised">
        <p>You do not have permission to view Movies</p>
      </template>
      <template v-else-if="error">
        <p>{{ error }}</p>
      </template>
      <template v-else-if="!movieData.length">
        <p>Could not find any movies.</p>
      </template>
      <template v-else>
        <div class="row d-flex px-2 py-3 movie-row align-items-stretch">
          <template v-for="movie in movieData">
            <router-link
              class="movie-card text-decoration-none text-black p-0"
              :key="movie.id"
              :to="{ name: 'app_movies_view', params: { id: movie.id } }"
            >
              <div class="card shadow-sm p-0">
                <div
                  class="card-body movie-card-picture"
                  :style="{
                    background: movie.image
                      ? `url(${movie.image})`
                      : `url('https://via.placeholder.com/300x250')`,
                  }"
                >
                  <span class="movie-card-link">
                    <router-link
                      v-if="permissions.includes('edit:movie')"
                      class="btn-secondary btn btn-sm py-1 px-3"
                      :key="movie.id"
                      :to="{
                        name: 'app_movies_edit',
                        params: { id: movie.id },
                      }"
                    >
                      Edit
                    </router-link>
                  </span>
                  <span class="movie-card-link center">
                    <button class="btn btn-light">View</button>
                  </span>
                </div>
                <div class="card-footer">
                  <div class="d-flex">
                    <h4
                      class="fw-bold movie-title fs-5 text-black text-decoration-none"
                    >
                      {{ movie.title }}
                    </h4>
                    <p class="ms-auto text-secondary">
                      <i class="bi bi-people-fill"></i>
                      {{ movie.cast ? movie.cast.length : 0 }}
                    </p>
                  </div>
                  <div>
                    <span class="text-secondary fst-italic">
                      Releasing:
                      <span>{{ movie.release_date }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </template>
        </div>
        <div>
          <nav aria-label="Page Navigation" class="mt-4">
            <ul class="pagination">
              <li class="page-item">
                <a
                  class="page-link"
                  @click="setPage(page - 1)"
                  :class="{ disabled: page <= 1 }"
                  href="#"
                  aria-label="Previous"
                >
                  <span aria-hidden="true">
                    <i class="bi bi-arrow-left"></i>
                  </span>
                </a>
              </li>
              <template v-for="(pageNumber, index) in pageNumbers">
                <li :key="index" class="page-item">
                  <a
                    @click="setPage(pageNumber)"
                    class="page-link"
                    :class="{ active: page === pageNumber }"
                    href="#"
                  >
                    {{ pageNumber }}
                  </a>
                </li>
              </template>
              <li class="page-item">
                <a
                  class="page-link"
                  @click="setPage(page + 1)"
                  :class="{ disabled: page >= pages }"
                  href="#"
                  aria-label="Next"
                >
                  <span aria-hidden="true">
                    <i class="bi bi-arrow-right"></i>
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { ApiService } from "@/api";
import { LoadingAnimation } from "@/components/shared";
export default {
  name: "MovieList",
  data() {
    return {
      movieData: null,
      isLoading: true,
      error: null,
      unauthorised: false,
      pages: null,
      page: 1,
      movieTotal: null,
    };
  },
  components: {
    LoadingAnimation,
  },
  watch: {
    authLoading(v) {
      if (!v) {
        this.loadMovies();
      } else {
        this.$router.push({ name: "app_login" });
      }
    },
    page() {
      console.log("page changed, load movies");
      this.loadMovies();
    },
  },
  computed: {
    authLoading() {
      return this.$auth.loading;
    },
    permissions() {
      return this.$store.getters["getPermissions"];
    },
    pageNumbers() {
      const pages = [];
      let page = 0;
      for (let i = 0; i < this.pages; i++) {
        page++;
        pages.push(page);
        console.log(pages);
      }
      return pages;
    },
  },
  created() {
    if (!this.authLoading) {
      console.log("user", this.user);
      this.loadMovies();
    }
  },
  methods: {
    setPage(page) {
      this.page = page;
      console.log("page", page);
    },
    async loadMovies() {
      this.isLoading = true;
      if (this.permissions.includes("list:movies")) {
        const response = await ApiService.getInstance()
          .movies()
          .getAll(this.page);
        if (response.success) {
          this.movieData = response.data;
          this.pages = response.pages;
        } else {
          this.error = "Failed to load actors";
        }
      } else {
        this.unauthorised = true;
      }
      this.isLoading = false;
    },
  },
};
</script>
