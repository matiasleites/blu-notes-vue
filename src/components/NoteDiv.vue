<script setup lang="ts">
import { firestore } from "@/services/firebase";
import { addDoc, collection, doc, updateDoc } from "@firebase/firestore";
import { ref, defineProps, onMounted, onUpdated } from "vue";
import { useStore } from "vuex";
import IconTrash from "./icons/IconTrash.vue";

const store = useStore();

type NoteType = {
  id: string;
  text: string;
  color: string;
  status: number;
  folder: string;
};

const props = defineProps({
  note: Object,
  idNote: String,
});

const loading = ref(false);
const customColor = ref("yellow");
const customDelete = ref("");
const myStatus = ref(1);
const myText = ref("Example Text");
const myFolder = ref("");
const myUser = ref({
  loggedIn: false,
  data: { displayName: "", uid: "", email: "", folder: "" },
});

const myId = ref(props.idNote);

onMounted(() => {
  myUser.value = store.getters.user;
  const myNote = props.note as NoteType;
  if (myNote && myNote.color) customColor.value = myNote.color;
  if (myNote && myNote.text) myText.value = myNote.text;
  if (myNote && myNote.status) myStatus.value = myNote.status;
  if (myNote && myNote.folder) myFolder.value = myNote.folder;
  if (!myId.value || myId.value.length < 1) {
    loading.value = true;
    updateNote(myText.value).then(() => {
      loading.value = false;
    });
  }
});

onUpdated(() => {
  const myNote = props.note as NoteType;
  if (myNote && myNote.folder) myFolder.value = myNote.folder;
});

function clickDelete() {
  if (customDelete.value == "") {
    customDelete.value = "red";
  } else {
    closeNote();
  }
}

async function closeNote() {
  let newStatus = 0;
  if (myStatus.value == 0) {
    newStatus == 1;
  }

  const myDoc = doc(
    firestore,
    `/notes/${myUser.value.data.uid}/notes/${myId.value}`
  );

  if (myId.value) {
    await updateDoc(myDoc, { status: newStatus }).then(() => {
      return true;
    });
    myStatus.value = 0;
    return true;
  }
}

let timer: null | number | ReturnType<typeof setTimeout> = null;

async function manageUpdate(info: string) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    myText.value = info;
    updateNote(info);
  }, 1000);
}

async function updateNote(info: string) {
  if (!myUser.value.loggedIn) {
    return false;
  }
  if (myId.value) {
    const myDoc = doc(
      firestore,
      `/notes/${myUser.value.data.uid}/notes/${myId.value}`
    );

    await updateDoc(myDoc, {
      text: info,
      color: customColor.value,
      folder: myFolder.value,
    }).then(() => {
      return true;
    });
    myText.value = info;
    return true;
  } else {
    const myCollection = collection(
      firestore,
      `/notes/${myUser.value.data.uid}/notes`
    );

    try {
      await addDoc(myCollection, {
        text: info,
        color: customColor.value,
        status: 1,
      })
        .then((doc) => {
          myId.value = doc.id;
          myText.value = info;
          return true;
        })
        .catch((e) => {
          console.error(e);
          return false;
        });
      return true;
    } catch (fg) {
      console.error(fg);
      return false;
    }
  }
}

function changeColor(type: number) {
  if (type == 1) customColor.value = "yellow";
  if (type == 2) customColor.value = "salmon";
  if (type == 3) customColor.value = "deepsky";
  if (type == 4) customColor.value = "green";
  if (myId.value) {
    updateNote(myText.value);
  }
}
</script>
<template>
  <div class="note" v-bind:class="customColor">
    <div class="note-text">
      <textarea
        :readonly="myStatus == 0"
        :value="myText"
        @input="
          (event) => {
            if (event.target && !loading) manageUpdate((event.target as HTMLInputElement).value);
          }
        "
      ></textarea>
    </div>
    <div v-if="myStatus == 1" class="color-toolbar">
      <button class="icon" v-bind:class="customDelete" @click="clickDelete">
        <IconTrash />
      </button>
      <button class="color-button yellow" @click="changeColor(1)"></button>
      <button class="color-button salmon" @click="changeColor(2)"></button>
      <button class="color-button deepsky" @click="changeColor(3)"></button>
      <button class="color-button green" @click="changeColor(4)"></button>
    </div>
  </div>
</template>
<style>
.red {
  color: brown !important;
}
.note {
  border-radius: 3px;
  margin: 10px 15px;
  padding: 5px;
  width: 300px;
  min-width: 280px;
  max-width: 350px;
  min-height: 250px;
  background-color: khaki;
  position: relative;
  transition: 1s;
}

.note-text {
  padding: 3px 10px;
}

.note-text textarea {
  color: inherit;
  width: 100%;
  max-width: 270px;
  min-width: 250px;
  background-color: transparent;
  border: none;
  min-height: 220px;
  resize: vertical;
  outline: none;
  overflow: overlay;
  scroll-behavior: smooth;
}

.note-text textarea:active {
  border: none;
  outline: none;
}

.color-toolbar button {
  height: 20px !important;
  padding: 0px;
}

.icon {
  background-color: transparent;
  flex: 1;
  margin: 2px 2px;
  border-radius: 2px;
  color: black;
}

.icon:hover {
  background-color: rgba(0, 0, 0, 0.2);
  color: black;
}

.icon svg {
  width: 13px !important;
}

.color-button {
  flex: 1;
  margin: 2px 2px;
  border-radius: 2px;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.color-toolbar {
  display: grid;
  grid-auto-flow: column;
}

.yellow {
  background-color: rgb(214, 205, 124);
  color: black !important;
}

.yellow:hover {
  background-color: rgb(214, 205, 124);
}

.salmon {
  background-color: rgb(233, 119, 107);
  color: white !important;
}

.salmon:hover {
  background-color: rgb(233, 119, 107);
}

.deepsky {
  background-color: rgb(2, 165, 219);
  color: white !important;
}
.deepsky:hover {
  background-color: rgb(2, 165, 219);
}

.green {
  background-color: rgb(131, 184, 52);
  color: black !important;
}

.green:hover {
  background-color: rgb(131, 184, 52);
}
</style>
