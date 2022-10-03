<script setup lang="ts">
import { RouterView } from "vue-router";
import { auth } from "@/services/firebase";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

auth.onAuthStateChanged((user) => {
  store.dispatch("fetchUser", user);
  if (user && user.uid.length > 5) router.push("/dashboard");
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
