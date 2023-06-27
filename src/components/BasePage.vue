<template>
  <div class="page-wrapper">
    <Navbar />
    <section class="main-content">
      <div class="container py-3">
        <slot name="main" />
      </div>
    </section>
  </div>
</template>
<script>
import { Navbar } from "@/components/shared";

export default {
  name: "BasePage",
  components: {
    Navbar,
  },
  computed: {
    pageTitle() {
      return this.$route.meta.pageTitle;
    },
  },
};
</script>
