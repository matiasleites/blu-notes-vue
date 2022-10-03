<script setup lang="ts">
import HomeActions from "./HomeActions.vue";
</script>
<template>
  <header>
    <div class="logo">
      <div class="image">
        <img
          alt="Bluedemics logo"
          class="logo"
          src="@/assets/logo512.webp"
          width="125"
          height="125"
        />
      </div>
      <h2>BluTasks</h2>
    </div>
    <div class="wrapper">
      <HomeActions />
      <nav>
        <RouterLink to="/">Login</RouterLink>
        <RouterLink to="/register">Cadastro</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.wrapper {
  margin: auto;
}

.logo {
  margin: auto;
}
.logo h2 {
  text-align: center;
}

header {
  display: flex;
  flex-direction: column;
}

.image {
  text-align: center;
}

img {
  text-align: center;
  margin: auto;
}
nav {
  margin-top: 5px;
}
nav a {
  margin-right: 9px;
}
</style>
