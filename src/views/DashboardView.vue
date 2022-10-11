<template>
  <div class="dash">
    <div v-if="myUser.loggedIn" class="top-bar">
      <p>{{ myUser.data.displayName }}</p>
      <button class="logout-btn" @click="signOut">Sair</button>
      <button class="new-note-btn" @click="addNote">+ Nova Nota</button>
    </div>
    <div class="notes">
      <NoteDiv
        v-for="(note, index) in notes"
        :key="index"
        :id-note="note.id"
        :note="note"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { firestore } from "@/services/firebase";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import NoteDiv from "../components/NoteDiv.vue";

const notes = ref<Array<{ id: string; text: string; color: string }>>([]);
const store = useStore();
const router = useRouter();
const myUser = ref({
  loggedIn: false,
  data: { displayName: "", uid: "", email: "" },
});

const signOut = async () => {
  await store.dispatch("logOut");
  router.push("/");
};

onMounted(() => {
  myUser.value = store.getters.user;
  if (!myUser.value || !myUser.value.loggedIn) {
    router.push("/");
  } else {
    getNotes(1);
  }
});

function addNote() {
  const myDoc = { color: "yellow", id: "", text: "Nova nota", status: 1 };
  notes.value.push(myDoc);
  console.error(notes.value);
}

async function getNotes(status: number) {
  const myCollection = collection(
    firestore,
    `/notes/${myUser.value.data.uid}/notes/`
  );
  const myQuery = query(myCollection, where("status", "==", status));
  const myDocs = await getDocs(myQuery);
  const myNotes: { color: any; id: string; text: any; status: number }[] = [];
  myDocs.forEach((doc) => {
    const myData = doc.data();
    const myDoc = {
      color: myData.color,
      id: doc.id,
      text: myData.text,
      status: myData.status,
    };
    myNotes.push(myDoc);
  });
  notes.value = myNotes;
}
</script>

<style>
.logout-btn {
  background-color: var(--secondary);
}

.logout-btn:hover {
  background-color: var(--primary);
  color: white;
}

.new-note-btn {
  background-color: rgb(91, 150, 91);
  color: black;
}

.new-note-btn:hover {
  background-color: lightgreen;
  color: black;
}

.dash button {
  margin-left: 10px;
}

.top-bar {
  width: 100%;
  padding: 10px 15px;
  display: flex;
}

.top-bar p {
  margin-left: 15px;
  padding-top: 3px;
}

.dash {
  width: 100vw;
  padding-left: 20px;
  padding-top: 20px;
  padding-right: 20px;
  padding-bottom: 50px;
  left: 0px;
  top: 0px;
  position: fixed;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.notes {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: auto;
}

@media (max-width: 3000px) {
  .notes {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
  }
}

@media (max-width: 2500px) {
  .notes {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 1600px) {
  .notes {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1300px) {
  .notes {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1000px) {
  .notes {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {
  .notes {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
