<template>
  <div class="login-form">
    <div class="image"></div>
    <h2 class="login-title">Login</h2>
    <form action="#" @submit.prevent="tryLoggin">
      <div class="login-inputs">
        <div class="input-group">
          <label for="email">Email</label>
          <input v-model="email" placeholder="email" id="email" type="email" />
        </div>
        <div class="input-group">
          <label for="pass">Senha</label>
          <input v-model="pass" placeholder="senha" id="pass" type="password" />
        </div>
      </div>
      <div>
        <p class="error" v-if="!validate">{{ myError }}</p>
      </div>
      <div class="actions">
        <button type="submit" :disabled="loading">
          <p v-if="loading">Carregando</p>
          <p v-else>Login</p>
        </button>
        <a href="/register">Cadastro</a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const email = ref("");
const pass = ref("");
const myError = ref("Error");
const validate = ref(true);
const loading = ref(false);
const store = useStore();
const router = useRouter();

async function tryLoggin() {
  if (email.value.length < 4 || pass.value.length < 6) {
    validate.value = false;
    myError.value = "Por favor preencher o usuário e a senha para fazer login";
  } else {
    try {
      loading.value = true;
      await store.dispatch("logIn", {
        email: email.value,
        password: pass.value,
      });

      const myUser = store.getters.user;

      if (myUser && myUser.loggedIn) {
        validate.value = true;
        router.push("/dashboard");
      } else {
        console.log("error?");
      }
    } catch (err: any) {
      validate.value = false;
      myError.value = err.message.replace("Firebase:", "");
    }
    loading.value = false;
  }
}
</script>

<style>
.login-form {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
}

.login-form .image {
  border-radius: 5px 5px 0px 0px;
  min-height: 150px;
  background-position: center;
  background-size: cover;
  background-image: url(@/assets/home.webp);
}

.error {
  max-width: 450px;
  text-align: justify;
  padding: 5px;
  color: var(--error);
}
.login-title {
  padding: 3px;
}

.login-form label {
  line-height: 1.8;
  margin-left: 0px;
}

.login-form input {
  border-radius: 15px;
  margin-bottom: 0px;
  padding: 8px 10px;
  border: 0px solid;
}

.login-inputs {
  display: flex;
  flex-direction: row;
}

.input-group {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 5px;
}

.actions {
  margin-top: 2px;
  padding-left: 2px;
}

.actions button {
  margin-top: 10px;
}

.actions a {
  margin-left: 20px;
}

@media (max-width: 500px) {
  .login-form {
    padding: 5px 0px;
  }

  .login-inputs {
    flex-direction: column;
  }

  .login-form input {
    margin-bottom: 2px;
  }
}
</style>
