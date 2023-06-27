<template>
  <div
    class="w-100 h-100 d-flex align-items-center justify-content-center bg-light"
    :class="{ 'position-fixed': overlay }"
    style="min-height: 200px; z-index: 9999; left: 0; top: 0"
  >
    <div>
      <span
        class="spinner-border me-4"
        style="width: 1.2rem; height: 1.2rem"
        role="status"
      ></span>
      <span>Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingAnimation",
  computed: {
    overlay() {
      return "overlay" in this.$attrs;
    },
  },
};
</script>
