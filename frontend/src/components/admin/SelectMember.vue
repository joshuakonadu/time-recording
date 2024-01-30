<script setup>
import { computed } from "vue";
import { useUserStore } from "src/stores";

const userStore = useUserStore();

const emit = defineEmits(["onSelect"]);

const workspaceMemberOptions = computed(() => {
  return userStore.activeWorkspace.members.map((member) => {
    return {
      label: `${member.firstname} ${member.lastname}`,
      value: member.userId,
    };
  });
});

const memberSelected = computed({
  get() {
    return {
      label: `${userStore.selectedWorkspaceMember?.firstname} ${userStore.selectedWorkspaceMember?.lastname}`,
      value: userStore.selectedWorkspaceMember?.userId,
    };
  },
  set(obj) {
    emit("onSelect", obj.value);
  },
});
</script>

<template>
  <q-select
    v-model="memberSelected"
    :options="workspaceMemberOptions"
    label="Ausgewähltes Mitglied"
    label-color="primary"
  />
</template>
