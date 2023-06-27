<template>
  <BasePage>
    <template #main>
      <div class="d-flex align-items-center py-4 border-bottom">
        <h3 class="mb-0 me-4">Dashboard</h3>
      </div>
      <div class="mt-2">
        <div class="row mt-4">
          <div class="col-6">
            <router-link
              :to="{ name: 'app_movies_list' }"
              class="d-block text-decoration-none text-black card-link"
            >
              <div class="card rounded-3">
                <div class="card-body d-flex align-items-center px-4 py-4">
                  <div class="">
                    <h4 class="mb-3 d-flex align-items-center">
                      <i class="bi bi-camera-reels me-2"></i> Manage movies
                    </h4>
                    <p class="text-secondary mb-0">
                      Current number of movies: {{ movieTotal }}
                    </p>
                  </div>
                  <div class="d-flex ms-auto">
                    <i class="bi bi-arrow-right-circle fs-3"></i>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
          <div class="col-6">
            <router-link
              :to="{ name: 'app_actors_list' }"
              class="d-block text-decoration-none text-black card-link"
            >
              <div class="card rounded-3">
                <div class="card-body d-flex align-items-center px-4 py-4">
                  <div class="">
                    <h4 class="mb-3 d-flex align-items-center">
                      <i class="bi bi-people me-2"></i> Manage actors
                    </h4>
                    <p class="text-secondary mb-0">
                      Current number of movies: {{ actorTotal }}
                    </p>
                  </div>
                  <div class="d-flex ms-auto">
                    <i class="bi bi-arrow-right-circle fs-3"></i>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <div class="row mt-4 border-top pt-4">
          <div class="col-12 d-flex flex-wrap">
            <!--                Movies -->
            <div class="p-3 w-50">
              <template v-if="isLoading.movies">
                <LoadingAnimation />
              </template>
              <template v-else-if="error.movies">
                <p>{{ error.movies }}</p>
              </template>
              <template v-else-if="!movieData">
                There are currently no actors in the system
              </template>
              <template v-else>
                <div class="mt-3">
                  <h5>Upcoming Movies</h5>
                </div>
                <table class="table table-hover mt-3">
                  <thead class="bg-transparent">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Title</th>
                      <th scope="col" class="text-center">Release Date</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody class="border table-light rounded-2 overflow-hidden">
                    <template v-for="movie in movieData">
                      <router-link
                        tag="tr"
                        :to="{
                          name: 'app_movies_view',
                          params: { id: movie.id },
                        }"
                        class="hoverable"
                        :key="movie.id"
                      >
                        <td class="align-middle">
                          <template v-if="movie.image">
                            <img
                              class="rounded"
                              style="
                                object-fit: cover;
                                width: 40px;
                                height: 60px;
                              "
                              :src="movie.image"
                              :alt="movie.title"
                            />
                          </template>
                          <template v-else>
                            <i class="bi bi-film fs-4 ms-2"></i>
                          </template>
                        </td>
                        <td class="align-middle">
                          <router-link
                            class="text-decoration-none text-black fw-bold"
                            :to="{
                              name: 'app_movies_view',
                              params: { id: movie.id },
                            }"
                            >{{ movie.title }}
                          </router-link>
                        </td>
                        <td class="text-center align-middle">
                          {{ movie.release_date }}
                        </td>
                        <td class="align-middle">
                          <router-link
                            :to="{
                              name: 'app_movies_view',
                              params: { id: movie.id },
                            }"
                            class="btn btn-sm btn-outline-secondary"
                            >View</router-link
                          >
                        </td>
                      </router-link>
                    </template>
                  </tbody>
                </table>
              </template>
            </div>
            <!--                Actors-->
            <div class="p-3 w-50">
              <template v-if="isLoading.actors">
                <LoadingAnimation />
              </template>
              <template v-else-if="error.actors">
                <p>{{ error.actors }}</p>
              </template>
              <template v-else-if="!actorData">
                There are currently no actors in the system
              </template>
              <template v-else>
                <div class="mt-3">
                  <h5>Most Cast Actors</h5>
                </div>
                <table class="table table-hover mt-3">
                  <thead class="bg-transparent">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Name</th>
                      <th scope="col" class="text-center">Castings</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody class="border table-light rounded-2 overflow-hidden">
                    <template v-for="actor in actorData">
                      <router-link
                        tag="tr"
                        :to="{
                          name: 'app_actors_view',
                          params: { id: actor.id },
                        }"
                        class="hoverable"
                        :key="actor.id"
                      >
                        <td class="align-middle">
                          <template v-if="actor.image">
                            <img
                              class="rounded-circle"
                              style="
                                object-fit: cover;
                                width: 40px;
                                height: 40px;
                              "
                              :src="actor.image"
                              :alt="actor.name"
                            />
                          </template>
                          <template v-else>
                            <i class="bi bi-person-circle fs-4 ms-2"></i>
                          </template>
                        </td>
                        <td class="align-middle">
                          <router-link
                            class="text-decoration-none text-black fw-bold"
                            :to="{
                              name: 'app_actors_view',
                              params: { id: actor.id },
                            }"
                            >{{ actor.name }}</router-link
                          >
                        </td>
                        <td class="text-center align-middle">
                          {{ actor.castings ? actor.castings.length : "-" }}
                        </td>
                        <td class="align-middle">
                          <router-link
                            :to="{
                              name: 'app_actors_view',
                              params: { id: actor.id },
                            }"
                            class="btn btn-sm btn-outline-secondary"
                            >View</router-link
                          >
                        </td>
                      </router-link>
                    </template>
                  </tbody>
                </table>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasePage>
</template>

<script>
import { BasePage } from "@/components";
import { LoadingAnimation } from "@/components/shared";
import { ApiService } from "@/api";

export default {
  name: "Dashboard",
  data() {
    return {
      movieData: null,
      movieTotal: null,
      actorData: null,
      actorTotal: null,
      isLoading: {
        actors: true,
        movies: true,
      },
      error: {
        actors: null,
        movies: null,
      },
      unauthorised: false,
    };
  },
  components: {
    BasePage,
    LoadingAnimation,
  },
  created() {
    this.loadActors();
    this.loadMovies();
  },
  watch: {
    authLoading(v) {
      if (!v) {
        this.loadMovies();
        this.loadActors();
      } else {
        this.$router.push({ name: "app_login" });
      }
    },
  },
  computed: {
    authLoading() {
      return this.$auth.loading;
    },
    permissions() {
      return this.$store.getters["getPermissions"];
    },
  },
  methods: {
    async loadActors() {
      this.isLoading.actors = true;
      if (this.permissions.includes("list:actors")) {
        const response = await ApiService.getInstance()
          .actors()
          .getAll(1, "by_castings");
        if (response.success) {
          this.actorData = response.data;
          this.actorTotal = response.total;
        } else {
          this.error.actors = "Failed to load actors";
        }
      } else {
        this.unauthorised = true;
      }
      this.isLoading.actors = false;
    },
    async loadMovies() {
      this.isLoading.movies = true;
      if (this.permissions.includes("list:movies")) {
        console.log("can fetch movies");
        const response = await ApiService.getInstance()
          .movies()
          .getAll(1, "by_date");
        if (response.success) {
          this.movieData = response.data;
          this.movieTotal = response.total;
        } else {
          this.error.movies = "Failed to load movies";
        }
      } else {
        this.unauthorised = true;
      }
      this.isLoading.movies = false;
    },
  },
};
</script>
