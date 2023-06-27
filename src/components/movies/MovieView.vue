<template>
  <div>
    <template v-if="isLoading">
      <LoadingAnimation />
    </template>
    <template v-else-if="error">
      <div class="alert alert-warning" v-if="error">
        {{ error }}
      </div>
    </template>
    <template v-else>
      <div>
        <router-link
          class="btn btn-sm btn-outline-secondary me-4"
          :to="{ name: 'app_movies_list' }"
          ><i class="bi-arrow-left"></i> Back
        </router-link>
      </div>
      <div class="d-flex align-items-center py-4 border-bottom">
        <h3 class="mb-0 me-4">{{ movieData.title }}</h3>
        <router-link
          class="btn btn-secondary ms-auto me-2"
          v-if="permissions.includes('edit:movie')"
          :to="{ name: 'app_movies_edit', params: { id: movieData.id } }"
          >Edit movie</router-link
        >
        <button
          v-if="permissions.includes('delete:movie')"
          class="btn btn-outline-danger"
          @click="handleDeleteClick"
        >
          Delete
        </button>
      </div>
      <div class="mt-2">
        <div class="row">
          <div class="col-auto col-auto">
            <img
              style="max-width: 250px; width: 100%"
              :src="
                movieData.image
                  ? movieData.image
                  : `https://via.placeholder.com/180x220`
              "
              class="rounded shadow-sm"
              alt=""
            />
          </div>
          <div class="col-auto p-2">
            <p class="fw-bold mb-1">Cast Size:</p>
            <p>{{ movieData.cast.length }}</p>
            <p class="fw-bold mb-1">Release Date:</p>
            <p>{{ movieData.release_date }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col col-12">
            <h5 class="mt-5 mb-3">Movie Castings</h5>
            <template v-if="movieData.cast && movieData.cast.length">
              <table class="table">
                <thead>
                  <tr class="text-secondary">
                    <th>#</th>
                    <th>Actor</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="border-1 table-light">
                  <template v-for="casting in movieData.cast">
                    <tr :key="casting.id" class="">
                      <td class="align-middle">
                        <template v-if="casting.image">
                          <img
                            class="rounded-circle"
                            style="object-fit: cover; width: 40px; height: 40px"
                            :src="casting.image"
                            :alt="casting.name"
                          />
                        </template>
                        <template v-else>
                          <i class="bi bi-person-circle fs-4 ms-2"></i>
                        </template>
                      </td>
                      <td class="align-middle">{{ casting.name }}</td>
                      <td class="align-middle">{{ casting.age }}</td>
                      <td class="align-middle">
                        <span class="badge bg-lighter-grey text-grey">
                          {{ casting.gender.split("")[0].toUpperCase() }}
                        </span>
                      </td>
                      <td class="align-middle">
                        <router-link
                          class="btn btn-sm btn-outline-secondary"
                          :to="{
                            name: 'app_actors_view',
                            params: { id: casting.id },
                          }"
                        >
                          View Actor
                        </router-link>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </template>
            <template v-else>
              <p class="text-secondary">
                This movie currently has no actors cast for it.
              </p>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { ApiService } from "@/api";
import LoadingAnimation from "@/components/shared/LoadingAnimation";

export default {
  name: "MovieSingle",
  components: { LoadingAnimation },
  data() {
    return {
      movieData: null,
      isLoading: true,
      error: null,
    };
  },
  created() {
    this.loadMovie();
  },
  computed: {
    permissions() {
      return this.$store.getters["getPermissions"];
    },
  },
  methods: {
    async handleDeleteClick() {
      const response = await ApiService.getInstance()
        .movies()
        .delete(this.$route.params.id);
      if (response.success) {
        await this.$router.push({ name: "app_movies_list" });
      } else {
        this.error = "Failed to delete movie";
      }
    },
    async loadMovie() {
      this.isLoading = true;
      const response = await ApiService.getInstance()
        .movies()
        .get(this.$route.params.id);
      if (response.success) {
        this.movieData = response.data;
      } else {
        this.error = "Failed to load movie";
      }
      this.isLoading = false;
    },
  },
};
</script>
