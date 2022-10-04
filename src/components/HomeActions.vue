<script setup lang="ts"></script>

<template>
  <div class="greetings">
    <h3>Gerencie suas tarefas diarias com o sistema BluNotes.</h3>
    <h3>
      Blu Notes é um sistema de código aberto que serve para cadastrar tarefas
      no estilo post-it, criado como parte do portfolio de
      <a href="https://www.linkedin.com/in/matiasleites/">Matias Leites</a>.
    </h3>
    <h3>
      O código do proyeto está no
      <a href="https://github.com/matiasleites/blu-notes-vue">GitHub</a>
    </h3>
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
  font-weight: 100;
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
