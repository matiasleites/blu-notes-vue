<template>
  <div class="dash">
    <div v-if="myUser.loggedIn" class="top-bar">
      <button class="new-note-btn" @click="addNote">Criar Nota</button>
      <button class="logout-btn" @click="signOut">Sair</button>
      <p>{{ myUser.data.displayName }}</p>
    </div>
    <div class="folders-bar">
      <button class="new-folder-btn" @click="createFolder">Criar Pasta</button>
      <button
        v-bind:class="{ 'green-btn': folder == '' }"
        @click="setFolder('')"
      >
        Sem pasta
      </button>
      <FolderInput
        type="text"
        v-for="(myFolder, index) in folders"
        @click="setFolder(myFolder.id)"
        :key="index"
        :folder="myFolder"
        :selected="folder"
      />
    </div>
    <div class="notes">
      <p v-if="loading">carregando ...</p>
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
import type { FolderType } from "@/services/folders";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import NoteDiv from "../components/NoteDiv.vue";
import FolderInput from "../components/FolderInput.vue";

const notes = ref<
  Array<{
    id: string;
    text: string;
    color: string;
    status: number;
    folder: string;
  }>
>([]);
const originalNotes = ref<
  Array<{
    id: string;
    text: string;
    color: string;
    status: number;
    folder: string;
  }>
>([]);
const folders = ref<
  Array<{
    id: string;
    name: string;
  }>
>([]);
const loading = ref(false);
const store = useStore();
const router = useRouter();
const folder = ref("");
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
    getFolders();
  }
});

function addNote() {
  const myDoc = {
    color: "yellow",
    id: "",
    text: "Nova nota",
    status: 1,
    folder: folder.value,
  };
  notes.value.push(myDoc);
}

async function createFolder() {
  const myFolder = { name: "nova pasta", id: "" } as FolderType;
  const myCollection = collection(
    firestore,
    `/notes/${myUser.value.data.uid}/folders/`
  );
  await addDoc(myCollection, myFolder);
  getFolders();
}

async function getFolders() {
  loading.value = true;
  const myCollection = collection(
    firestore,
    `/notes/${myUser.value.data.uid}/folders/`
  );
  const myQuery = query(myCollection, orderBy("name"));
  const myDocs = await getDocs(myQuery);
  const myFolders: {
    id: string;
    name: string;
  }[] = [];
  myDocs.forEach((doc) => {
    const myData = doc.data();
    const myDoc = {
      id: doc.id,
      name: myData.name,
    };
    myFolders.push(myDoc);
  });
  folders.value = myFolders;
  loading.value = false;
  return true;
}

async function getNotes(status: number) {
  loading.value = true;
  const myCollection = collection(
    firestore,
    `/notes/${myUser.value.data.uid}/notes/`
  );
  const myQuery = query(myCollection, where("status", "==", status));
  const myDocs = await getDocs(myQuery);
  const myNotes: {
    color: any;
    id: string;
    text: any;
    status: number;
    folder: string;
  }[] = [];
  myDocs.forEach((doc) => {
    const myData = doc.data();
    const myDoc = {
      color: myData.color,
      id: doc.id,
      text: myData.text,
      status: myData.status,
      folder: myData.folder ? myData.folder : "",
    };
    myNotes.push(myDoc);
  });
  notes.value = myNotes;
  originalNotes.value = myNotes;
  filterFolder();
  loading.value = false;
  return true;
}

function setFolder(newFolder: string) {
  folder.value = newFolder;
  getNotes(1);
}

function filterFolder() {
  let filterNotes: {
    color: any;
    id: string;
    text: any;
    status: number;
    folder: string;
  }[] = [];
  if (folder.value.length > 0) {
    filterNotes = originalNotes.value.filter((myNote) => {
      return myNote.folder == folder.value;
    });
  } else {
    filterNotes = originalNotes.value.filter((myNote) => {
      return myNote.folder == "";
    });
  }
  notes.value = filterNotes;
}
</script>

<style>
.logout-btn {
  background-color: var(--secondary);
  margin: auto;
  right: 5px;
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

.new-folder-btn {
  background-color: var(--primary);
}

.dash button {
  margin-left: 10px;
}

.top-bar {
  width: 100%;
  padding: 10px 5px;
  display: flex;
}

.top-bar p {
  margin-left: 15px;
  padding-top: 3px;
}

.folders-bar {
  width: 100%;
  padding: 0px 5px;
  display: inline-block;
}

.folders-bar button,
inputs {
  min-width: 199px;
  color: #000;
  background-color: darkkhaki;
}

.folders-bar button:hover {
  color: #000;
  background-color: khaki;
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

.notes p {
  margin-left: 15px;
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

  .folders-bar button,
  input {
    width: 96%;
    margin-top: 5px;
  }
}
</style>
