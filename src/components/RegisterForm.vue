<template>
  <div class="login-form">
    <div class="image"></div>
    <h2 class="login-title">Cadastro</h2>
    <form action="#" @submit.prevent="tryRegister">
      <div class="login-inputs">
        <div class="login-lines">
          <div class="input-group">
            <label for="name">Nome</label>
            <input v-model="name" placeholder="nome" id="name" />
          </div>
          <div class="input-group">
            <label for="email">Email</label>
            <input
              v-model="email"
              placeholder="email"
              id="email"
              type="email"
            />
          </div>
        </div>
        <div class="login-pass">
          <div class="input-group">
            <label for="pass">Senha</label>
            <input
              v-model="pass"
              placeholder="senha"
              id="pass"
              type="password"
            />
          </div>
          <div class="input-group">
            <label for="pass2">Repeta a senha</label>
            <input
              v-model="pass2"
              placeholder="senha"
              id="pass2"
              type="password"
            />
          </div>
        </div>
      </div>
      <div>
        <p class="error" v-if="!validate">{{ myError }}</p>
      </div>
      <div class="actions">
        <button type="submit" :disabled="loading">
          <p v-if="loading">Carregando</p>
          <p v-else>Cadastro</p>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import store from "@/store/store";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const name = ref("");
const email = ref("");
const pass = ref("");
const pass2 = ref("");
const validate = ref(true);
const myError = ref("error");
const loading = ref(false);

async function tryRegister() {
  if (
    name.value.length < 1 ||
    email.value.length < 4 ||
    pass.value.length < 6
  ) {
    validate.value = false;
    myError.value =
      "Nome, email ou senha muito curtos, a senha precisa ter pelo menos 6 caracteres";
  } else {
    if (pass.value != pass2.value) {
      validate.value = false;
      myError.value = "As duas senhas não batem";
    } else {
      loading.value = true;
      try {
        await store.dispatch("register", {
          email: email.value,
          password: pass.value,
          name: name.value,
        });
        validate.value = true;
        router.push("/");
      } catch (error: any) {
        validate.value = false;
        myError.value = error.message.replace("Firebase", "");
      }
      loading.value = false;
    }
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
  text-align: justify;
  max-width: 405px;
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
  flex-direction: column;
}

.login-lines {
  display: flex;
  flex-direction: column;
}

.login-pass {
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

@media (max-width: 650px) {
  .login-form {
    padding: 5px 0px;
  }

  .login-inputs {
    flex-direction: column;
  }

  .login-form input {
    margin-bottom: 2px;
  }

  .login-pass {
    flex-direction: column;
  }
}
</style>
