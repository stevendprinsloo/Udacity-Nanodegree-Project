<template>
  <div>
    <template v-if="isLoading">
      <LoadingAnimation />
    </template>
    <template v-else-if="error">
      <div class="alert alert-warning">
        {{ error }}
      </div>
    </template>
    <template v-else>
      <div>
        <router-link
          class="btn btn-sm btn-outline-secondary me-4"
          :to="{ name: 'app_movies_list' }"
        >
          <i class="bi-arrow-left"></i> Back to Movies
        </router-link>
      </div>
      <div class="d-flex align-items-center py-4 border-bottom">
        <h3 class="mb-0 me-4">{{ pageTitle }}</h3>
      </div>
      <div class="mt-2">
        <BForm>
          <div class="row">
            <div class="col col-4">
              <label class="form-label">Movie Title</label>
              <BFormInput v-model="movieData.title"></BFormInput>
            </div>
            <div class="col col-3">
              <label class="form-label">Movie Release Date</label>
              <BFormDatepicker
                class="form-control"
                v-model="movieData.release_date"
              ></BFormDatepicker>
            </div>
          </div>
          <div class="row mt-3 mb-4">
            <div class="col col-4">
              <label class="form-label">Movie Cast</label>
              <Multiselect
                style="min-width: 350px"
                v-model="selectedActors"
                placeholder="Select cast members"
                :options="actors"
                :multiple="true"
                :searchable="true"
                @select="addActor"
                @remove="removeActor"
                track-by="id"
                label="name"
              />
            </div>
            <div class="col col-4">
              <label class="form-label">Movie Poster Link</label>
              <BFormInput
                v-model="movieData.image"
                placeholder="http://..."
              ></BFormInput>
            </div>
          </div>

          <button class="btn btn-primary mt-3" @click.prevent="saveMovie">
            <span>{{ submitText }}</span>
          </button>

          <button
            class="btn btn-outline-secondary mt-3 ms-3"
            @click.prevent="handleCancelClick"
          >
            Cancel
          </button>
        </BForm>
      </div>
    </template>
  </div>
</template>
<script>
import { BForm, BFormDatepicker, BFormInput } from "bootstrap-vue";
import { ApiService } from "@/api";
import Multiselect from "vue-multiselect";
import { LoadingAnimation } from "@/components/shared";

export default {
  name: "MovieSingle",
  data() {
    return {
      movieData: null,
      actors: [],
      isLoading: true,
      error: null,
      selectedActors: [],
    };
  },
  created() {
    if (this.$route.name.startsWith("app_movies_new")) {
      this.isLoading = false;
      this.movieData = {
        title: null,
        release_date: null,
        image: null,
        actors: [],
      };
    }

    this.initialiseMovieForm();
  },
  components: {
    BForm,
    BFormInput,
    BFormDatepicker,
    Multiselect,
    LoadingAnimation,
  },
  computed: {
    pageTitle() {
      if (this.isLoading) {
        return "";
      } else if (this.$route.params.id && !this.isLoading && this.movieData) {
        return "Edit " + this.movieData.title;
      } else {
        return "New Movie";
      }
    },
    submitText() {
      let buttonText;
      switch (this.$route.name) {
        case "app_movies_new":
          this.saving
            ? (buttonText = "Adding Movie")
            : (buttonText = "Save Movie");
          break;
        case "app_movies_edit":
          this.saving
            ? (buttonText = "Updating Movie")
            : (buttonText = "Update Movie");
          break;
      }
      return buttonText;
    },
  },
  methods: {
    handleCancelClick() {
      if (history.length) {
        history.go(-1);
      } else if (this.$route.params.id) {
        this.$router.push({
          name: "app_movies_view",
          params: { id: this.movieData.id },
        });
      } else {
        this.$router.push({
          name: "app_movies_list",
        });
      }
    },
    initialiseMovieForm() {
      this.isLoading = true;
      if (this.$route.name.startsWith("app_movies_edit")) {
        this.loadMovie();
      }
      this.loadActors();
      this.isLoading = false;
    },
    async loadActors() {
      const response = await ApiService.getInstance().actors().getAll(-1);
      if (response.success) {
        this.actors = response.data;
      } else {
        this.error = "Failed to load actors";
      }
    },
    async loadMovie() {
      console.log("fetching movie");
      const response = await ApiService.getInstance()
        .movies()
        .get(this.$route.params.id);
      if (response.success) {
        const movieData = response.data;
        this.selectedActors = movieData.cast;
        movieData.actors = [];
        movieData.cast.forEach((v) => {
          movieData.actors.push(v.id);
        });
        movieData.cast = [];
        // movieData.cast.remove();
        this.movieData = movieData;
      } else {
        this.error = "Failed to load movie";
      }
    },
    async saveMovie() {
      this.saving = true;

      let response;

      if (this.$route.params.id) {
        response = await ApiService.getInstance()
          .movies()
          .update(this.$route.params.id, this.movieData);
      } else {
        response = await ApiService.getInstance()
          .movies()
          .create(this.movieData);
      }

      if (response.success) {
        await this.$router.push({ name: "app_movies_list" });
        this.error = null;
      } else {
        if (this.$route.params.id) {
          this.error = "Error when updating actor";
        } else {
          this.error = "Error when saving actor";
        }
      }

      setTimeout(() => {
        this.saving = false;
      }, 2000);
    },
    addActor(e) {
      console.log("selection", e.id);
      this.movieData.actors.push(e.id);
    },
    removeActor(e) {
      console.log("remove", e.id);
      this.movieData.actors = this.movieData.actors.filter((v) => v !== e.id);
    },
  },
};
</script>
