<template>
  <BasePage>
    <template #main>
      <router-view />
    </template>
  </BasePage>
</template>

<script>
import { BasePage } from "@/components";

export default {
  name: "MovieWrapper",
  components: {
    BasePage,
  },
};
</script>
