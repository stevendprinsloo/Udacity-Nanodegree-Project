<template>
  <div>
    <div>
      <router-link
        class="btn btn-sm btn-outline-secondary me-4"
        :to="{ name: 'app_actors_list' }"
      >
        <i class="bi-arrow-left"></i> Back to Actors
      </router-link>
    </div>
    <div class="d-flex align-items-center py-4 border-bottom">
      <h3 class="mb-0 me-4">{{ pageTitle }}</h3>
    </div>
    <div class="mt-2">
      <template v-if="isLoading">
        <LoadingAnimation />
      </template>
      <template v-else-if="error">
        <div class="alert alert-warning">
          {{ error }}
        </div>
      </template>
      <template v-else>
        <BForm>
          <div class="row">
            <div class="col col-auto">
              <label class="form-label">Full Name</label>
              <BFormInput v-model="actorData.name"></BFormInput>
            </div>
            <div class="col col-auto">
              <label class="form-label">Age</label>
              <BFormInput v-model="actorData.age" type="number"></BFormInput>
            </div>
            <div class="col col-auto">
              <label class="form-label">Select Gender</label>
              <BFormSelect
                class="form-select"
                v-model="actorData.gender"
                :options="genders"
              />
            </div>
            <div class="col col-auto">
              <label class="form-label">Profile Picture Link</label>
              <BFormInput
                v-model="actorData.image"
                placeholder="http://...."
                type="text"
              ></BFormInput>
            </div>
          </div>

          <button class="btn btn-primary mt-3" @click.prevent="saveActor">
            <span>Save Actor</span>
          </button>

          <button
            class="btn btn-outline-secondary mt-3 ms-3"
            @click.prevent="handleCancelClick"
          >
            Cancel
          </button>
        </BForm>
      </template>
    </div>
  </div>
</template>
<script>
import { genders } from "@/const";
import { BForm, BFormInput, BFormSelect } from "bootstrap-vue";
import { ApiService } from "@/api";
import { LoadingAnimation } from "@/components/shared";

export default {
  name: "ActorSingle",
  data() {
    return {
      actorData: null,
      genders: genders,
      isLoading: true,
      error: null,
    };
  },
  created() {
    if (this.$route.name.startsWith("app_actors_new")) {
      this.isLoading = false;
      this.actorData = {
        name: null,
        age: null,
        gender: null,
        image: null,
      };
    } else {
      this.loadActor();
    }
  },
  components: {
    BForm,
    BFormInput,
    BFormSelect,
    LoadingAnimation,
  },
  computed: {
    pageTitle() {
      if (this.isLoading) {
        return "";
      } else if (this.$route.params.id && !this.isLoading && this.actorData) {
        return "Edit " + this.actorData.name;
      } else {
        return "New Movie";
      }
    },
  },
  methods: {
    handleCancelClick() {
      if (history.length) {
        history.go(-1);
      } else if (this.$route.params.id) {
        this.$router.push({
          name: "app_actors_view",
          params: { id: this.actorData.id },
        });
      } else {
        this.$router.push({
          name: "app_actors_list",
        });
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
    async saveActor() {
      this.saving = true;

      let response;

      if (this.$route.params.id) {
        response = await ApiService.getInstance()
          .actors()
          .update(this.$route.params.id, this.actorData);
      } else {
        response = await ApiService.getInstance()
          .actors()
          .create(this.actorData);
      }

      if (response.success) {
        await this.$router.push({
          name: "app_actors_view",
          params: { id: response.id ? response.id : this.actorData.id },
        });
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
      }, 500);
    },
  },
};
</script>
