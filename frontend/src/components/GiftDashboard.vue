<script setup>
import { computed, ref } from "vue";
import GiftForm from "./GiftForm.vue";
import DeleteConfirmation from "./DeleteConfirmation.vue";

const gifts = ref([]);
const loading = ref(true);
const showForm = ref(false);
const selectedFilter = ref("All");
const errorPrompt = ref(null);

const purchasedStates = ["All", "Purchased", "Not purchased"];

const fetchGifts = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/gifts");
    const result = await response.json();
    gifts.value = result;
  } catch (error) {
    console.error("Could not fetch: ", error);
    errorPrompt.value = error;
  } finally {
    loading.value = false;
  }
};

const filteredGifts = computed(() => {
  if (selectedFilter.value === "All") {
    return gifts.value;
  } else if (selectedFilter.value === "Purchased") {
    return gifts.value.filter((g) => g.purchased === true);
  } else if (selectedFilter.value === "Not purchased") {
    return gifts.value.filter((g) => g.purchased === false);
  }
  return gifts.value;
});

const updatePurchasedState = async (gift) => {
  try {
    const response = await fetch(`http://localhost:3001/api/gift/${gift.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        purchased: gift.purchased,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      errorPrompt.value = error.message;
      return;
    }
  } catch (error) {
    console.error(error.message);
  }
};

fetchGifts();
</script>

<template>
  <p v-if="loading">Loading gifts...</p>
  <p v-else-if="errorPrompt != null">
    {{ errorPrompt }}. Try reloading the server.
  </p>
  <div v-else class="flex flex-col justify-center">
    <div class="flex items-center gap-3 border-b border-gray-300 p-2">
      <p class="text-lg font-bold">Show:</p>
      <p
        v-for="state in purchasedStates"
        :class="[
          'border px-2 rounded-lg hover:bg-green-400 hover:cursor-pointer',
          selectedFilter === state
            ? ' bg-green-300 text-black'
            : 'bg-green-500 text-white',
        ]"
        @click="selectedFilter = state"
      >
        {{ state }}
      </p>
    </div>
    <div
      class="w-full grid grid-cols-2 justify-items-center pt-4 gap-5 min-h-[50vh]"
    >
      <div
        v-for="gift in filteredGifts"
        :key="gift.id"
        class="shadow flex flex-col justify-between w-4/5 h-50 rounded-lg border-t-4 border-green-500"
      >
        <span class="flex justify-between p-3" v-if="!gift.purchased">
          <p class="text-xl font-bold">{{ gift.name }}</p>
          <p class="italic">${{ gift.price }}</p>
        </span>
        <span class="flex justify-between p-3 line-through" v-else>
          <p class="text-xl font-bold">{{ gift.name }}</p>
          <p class="italic">${{ gift.price }}</p>
        </span>
        <span>
          <p class="text-gray-500 px-3">To: {{ gift.to }}</p>
        </span>
        <div
          class="flex justify-between p-3 bg-red-100 border-t border-gray-300"
        >
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              class="w-5 h-5 accent-red-500 hover:cursor-pointer"
              v-model="gift.purchased"
              @change="updatePurchasedState(gift)"
            />
            <label class="text-lg italic">Purchased</label>
          </div>
          <DeleteConfirmation :gift="gift" @giftDeleted="fetchGifts" />
        </div>
      </div>
      <div
        class="shadow flex justify-center items-center w-4/5 h-50 rounded-lg italic hover:bg-gray-300 text-gray-500 hover:cursor-pointer border border-dashed"
        @click="showForm = true"
      >
        <p class="text-3xl">+ Add item</p>
      </div>
    </div>
    <GiftForm v-if="showForm" v-model="showForm" @giftAdded="fetchGifts" />
  </div>
</template>
