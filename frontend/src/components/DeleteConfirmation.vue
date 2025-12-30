<script setup>
import { ref } from "vue";
const showDelete = ref(false);
const props = defineProps(["gift"]);
const emit = defineEmits(["giftDeleted"]);

const deleteGift = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/api/gift/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return;
    }
    const result = await response.json();
    await emit("giftDeleted");
    showDelete.value = false;
    return result;
  } catch (error) {
    console.error("Could not delete gift: ", error);
  }
};
</script>

<template>
  <button
    class="text-red-500 px-3 py-1 rounded-lg hover:cursor-pointer"
    @click="showDelete = !showDelete"
  >
    Delete
  </button>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    v-if="showDelete"
  >
    <div
      class="bg-white max-w-90 min-h-70 rounded-lg flex flex-col justify-evenly items-center text-center border-t-3 border-red-500"
    >
      <p class="p-5">
        Are you sure you want to delete
        <span class="font-bold">{{ gift.name }}</span> to
        <span class="font-bold">{{ gift.to }}</span
        >?
      </p>
      <div class="flex justify-between w-3/5">
        <button
          class="px-5 py-3 rounded-lg bg-red-500 hover:bg-red-400 text-white hover:cursor-pointer"
          @click="deleteGift(gift.id)"
        >
          Yes
        </button>
        <button
          class="px-5 py-3 rounded-lg bg-gray-500 hover:bg-gray-400 text-white hover:cursor-pointer"
          @click="showDelete = !showDelete"
        >
          No
        </button>
      </div>
    </div>
  </div>
</template>
