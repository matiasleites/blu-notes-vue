<script setup lang="ts">
import { firestore } from "@/services/firebase";
import type { FolderType } from "@/services/folders";
import { doc, updateDoc } from "@firebase/firestore";
import { ref, defineProps, onMounted, onUpdated } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps({
  folder: Object,
  selected: String,
});

const customColor = ref("");
const loading = ref(false);
const selected = ref("");
const myText = ref("folder");
const myFolder = ref({} as FolderType);
const myUser = ref({
  loggedIn: false,
  data: { displayName: "", uid: "", email: "", folder: "" },
});

onUpdated(() => {
  updateValues();
});

onMounted(() => {
  updateValues();
});

function updateValues() {
  myUser.value = store.getters.user;
  myFolder.value = props.folder as FolderType;
  if (myFolder.value && myFolder.value.name) myText.value = myFolder.value.name;
  if (props.selected) selected.value = props.selected;
  if (props.selected == props.folder?.id) {
    customColor.value = "green-btn";
  } else {
    customColor.value = "";
  }
}

let timer: null | number | ReturnType<typeof setTimeout> = null;

async function manageUpdate(info: string) {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    updateFolder(info);
  }, 1000);
}

async function updateFolder(info: string) {
  if (!myUser.value.loggedIn) {
    return false;
  }

  const myDoc = doc(
    firestore,
    `/notes/${myUser.value.data.uid}/folders/${myFolder.value.id}`
  );

  await updateDoc(myDoc, {
    id: myFolder.value.id,
    name: info,
  }).then(() => {
    return true;
  });
  myText.value = info;
  return true;
}
</script>
<template>
  <input
    class="input-folder"
    v-bind:class="customColor"
    :value="myText"
    @input="
          (event) => {
            if (event.target && !loading) manageUpdate((event.target as HTMLInputElement).value);
          }
        "
  />
</template>
<style>
.input-folder {
  margin-top: 5px;
  margin-left: 10px;
  min-width: 100px;
  border-radius: 20px;
  background-color: darkkhaki;
  padding: 8px 15px;
  color: black;
  cursor: pointer;
  transition: 1s;
  border: 0px solid;
  text-decoration: none;
}

.input-folder:hover {
  background-color: khaki;
  color: var(--alternative);
}
</style>
