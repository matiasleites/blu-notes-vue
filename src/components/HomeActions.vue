<script setup lang="ts"></script>

<template>
  <div class="greetings">
    <h3>Gerencie suas tarefas diarias com o sistema BluTasks.</h3>
    <h3>Teste gratis, faça login ou cadastre-se.</h3>
  </div>
</template>

<style scoped>
.greetings {
  margin: auto;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: justify;
}

@media (min-width: 750px) {
  .greetings h1,
  .greetings h3 {
    text-align: justify;
  }
}
</style>
