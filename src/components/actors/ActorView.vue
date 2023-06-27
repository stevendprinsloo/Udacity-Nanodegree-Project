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
          :to="{ name: 'app_actors_list' }"
          ><i class="bi-arrow-left"></i> Back
        </router-link>
      </div>
      <div class="d-flex align-items-center py-4 border-bottom">
        <h3 class="mb-0 me-4">{{ actorData.name }}</h3>
        <router-link
          class="btn btn-secondary ms-auto me-2"
          v-if="permissions.includes('edit:actor')"
          :to="{ name: 'app_actors_edit', params: { id: actorData.id } }"
          >Edit Actor</router-link
        >
        <button
          v-if="permissions.includes('delete:actor')"
          class="btn btn-outline-danger"
          @click="handleDeleteClick"
        >
          Delete
        </button>
      </div>
      <div class="mt-4">
        <div class="row">
          <div class="col-auto col-auto">
            <template v-if="actorData.image">
              <img
                :src="actorData.image"
                class="rounded shadow-sm"
                style="max-width: 250px"
                alt=""
              />
            </template>
            <template v-else>
              <img
                src="https://via.placeholder.com/150x150"
                class="rounded shadow-sm"
                alt=""
              />
            </template>
          </div>
          <div class="col-auto p-2">
            <p class="fw-bold mb-1">Age:</p>
            <p>{{ actorData.age }}</p>
            <p class="fw-bold mb-1">Gender:</p>
            <p>{{ actorData.gender }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col col-12">
            <h5 class="mt-5 mb-3">Actor movie castings</h5>
            <template v-if="actorData.castings && actorData.castings.length">
              <table class="table">
                <thead>
                  <tr class="text-secondary">
                    <th>#</th>
                    <th>Movie</th>
                    <th>Release Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="border-1 table-light">
                  <template v-for="casting in actorData.castings">
                    <tr :key="casting.id" class="">
                      <td class="align-middle"><i class="bi-film"></i></td>
                      <td class="align-middle">{{ casting.title }}</td>
                      <td class="align-middle">{{ casting.release_date }}</td>
                      <td class="align-middle">
                        <router-link
                          class="btn btn-sm btn-outline-secondary"
                          :to="{
                            name: 'app_movies_view',
                            params: { id: casting.id },
                          }"
                        >
                          View Movie
                        </router-link>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </template>
            <template v-else>
              <p class="text-secondary">
                This actor is currently not cast in any movies.
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
import { LoadingAnimation } from "@/components/shared";

export default {
  name: "ActorSingle",
  data() {
    return {
      actorData: null,
      isLoading: true,
      error: null,
    };
  },
  components: {
    LoadingAnimation,
  },
  created() {
    if (this.$route.name.startsWith("app_actors_new")) {
      this.isLoading = false;
      this.actorData = {
        name: null,
        age: null,
        gender: null,
      };
    } else {
      this.loadActor();
    }
  },
  computed: {
    firstName() {
      const names = this.actorData.name.split(" ");
      return names[0];
    },
    permissions() {
      return this.$store.getters["getPermissions"];
    },
  },
  methods: {
    async handleDeleteClick() {
      const response = await ApiService.getInstance()
        .actors()
        .delete(this.$route.params.id);
      if (response.success) {
        await this.$router.push({ name: "app_actors_list" });
      } else {
        this.error = "Failed to delete actor";
      }
    },
    async loadActor() {
      this.isLoading = true;
      const response = await ApiService.getInstance()
        .actors()
        .get(this.$route.params.id);
      if (response.success) {
        this.actorData = response.data;
      } else {
        this.error = "Failed to load actor";
      }
      this.isLoading = false;
    },
  },
};
</script>
