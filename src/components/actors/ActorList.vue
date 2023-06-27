<template>
  <div class="">
    <div class="d-flex align-items-center py-4 border-bottom">
      <h3 class="mb-0 me-4">Actors</h3>
      <router-link
        v-if="permissions.includes('add:actor')"
        tag="button"
        :to="{ name: 'app_actors_new' }"
        class="btn btn-primary ms-auto"
      >
        <i class="bi bi-plus-circle me-1"></i>
        <span>Add Actor</span>
      </router-link>
    </div>

    <div class="mt-2">
      <template v-if="isLoading">
        <LoadingAnimation />
      </template>
      <template v-else-if="error">
        <p>{{ error }}</p>
      </template>
      <template v-else-if="!actorData">
        There are currently no actors in the system
      </template>
      <template v-else-if="!actorData.length">
        <p>Could not find any actors.</p>
      </template>
      <template v-else>
        <!--        <pre>-->
        <!--          {{ actorData }}-->
        <!--        </pre>-->
        <table class="table table-hover mt-5">
          <thead class="bg-transparent">
            <tr>
              <th scope="col"></th>
              <th scope="col">Name</th>
              <th scope="col">Age</th>
              <th scope="col">Gender</th>
              <th scope="col" class="text-center">Castings</th>
              <th scope="col"><i class="bi bi-sliders"></i></th>
            </tr>
          </thead>
          <tbody class="border table-light rounded-2 overflow-hidden">
            <template v-for="actor in actorData">
              <router-link
                tag="tr"
                :to="{ name: 'app_actors_view', params: { id: actor.id } }"
                class="hoverable"
                :key="actor.id"
              >
                <td class="align-middle">
                  <template v-if="actor.image">
                    <img
                      class="rounded-circle"
                      style="object-fit: cover; width: 40px; height: 40px"
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
                    :to="{ name: 'app_actors_view', params: { id: actor.id } }"
                    >{{ actor.name }}</router-link
                  >
                </td>
                <td class="align-middle">{{ actor.age }}</td>
                <td class="align-middle">
                  <span class="badge bg-lighter-grey text-grey">{{
                    actor.gender.split("")[0].toUpperCase()
                  }}</span>
                </td>
                <td class="text-center align-middle">
                  {{ actor.castings ? actor.castings.length : "-" }}
                </td>
                <td class="align-middle">
                  <router-link
                    :to="{ name: 'app_actors_view', params: { id: actor.id } }"
                    class="btn btn-sm btn-outline-secondary me-2"
                    >View</router-link
                  >
                  <router-link
                    v-if="permissions.includes('edit:actor')"
                    :to="{ name: 'app_actors_edit', params: { id: actor.id } }"
                    class="btn btn-sm btn-outline-secondary"
                    >Edit</router-link
                  >
                </td>
              </router-link>
            </template>
          </tbody>
        </table>
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
      actorData: null,
      isLoading: true,
      error: null,
      pages: null,
      saving: false,
      page: 1,
    };
  },
  components: {
    LoadingAnimation,
  },
  created() {
    this.loadActors();
  },
  watch: {
    authLoading(v) {
      if (!v) {
        this.loadActors();
      } else {
        this.$router.push({ name: "app_login" });
      }
    },
    page() {
      console.log("page changed, load movies");
      this.loadActors();
    },
  },
  computed: {
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
    permissions() {
      return this.$store.getters["getPermissions"];
    },
  },
  methods: {
    setPage(page) {
      this.page = page;
      console.log("page", page);
    },
    async loadActors() {
      this.isLoading = true;
      const response = await ApiService.getInstance()
        .actors()
        .getAll(this.page);
      if (response.success) {
        this.actorData = response.data;
        this.pages = response.pages;
      } else {
        this.error = "Failed to load actors";
      }
      this.isLoading = false;
    },
  },
};
</script>
