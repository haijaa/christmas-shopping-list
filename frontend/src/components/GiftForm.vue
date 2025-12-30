<script setup>
import { ref } from "vue";
const modelValue = defineModel();
const emit = defineEmits(["giftAdded"]);

const giftName = ref("");
const giftTo = ref("");
const giftPrice = ref(0);
const errorPrompt = ref(null);

const giftForm = ref([
  {
    id: 1,
    label: "Gift:",
    placeholder: "What is this gift?",
    type: "text",
    modelKey: "giftName",
  },
  {
    id: 2,
    label: "To:",
    placeholder: "Who is this for?",
    type: "text",
    modelKey: "giftTo",
  },
  {
    id: 3,
    label: "Price:",
    placeholder: "How much does it cost?",
    type: "number",
    modelKey: "giftPrice",
  },
]);

const models = {
  giftName,
  giftTo,
  giftPrice,
};

const postNewGift = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/gift", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: giftName.value,
        to: giftTo.value,
        price: giftPrice.value,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      errorPrompt.value = error.message;
      return;
    }

    const result = await response.json();

    giftName.value = "";
    giftTo.value = "";
    giftPrice.value = 0;

    emit("giftAdded");
    modelValue.value = false;
    return result;
  } catch (error) {
    console.error("Could not add gift: ", error);
  }
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
  >
    <div
      class="w-[50%] h-[50%] bg-white rounded-lg flex flex-col justify-evenly items-center text-start"
    >
      <div class="flex flex-col gap-3 text-start">
        <h1>Add new gift:</h1>
        <label v-for="form in giftForm" :key="form.id" class="flex flex-col">
          {{ form.label }}
          <input
            :type="form.type"
            :placeholder="form.placeholder"
            v-model="models[form.modelKey].value"
            class="border-b px-2 py-1"
          />
        </label>
        <p class="text-red-500">{{ errorPrompt }}</p>
      </div>
      <div class="w-full flex gap-3 justify-center">
        <button
          class="text-2xl bg-red-500 rounded-lg px-3 py-2 text-center hover:cursor-pointer hover:bg-red-400 text-white"
          @click="postNewGift"
        >
          Done
        </button>
        <button
          class="text-2xl bg-gray-500 rounded-lg px-3 py-2 text-center hover:cursor-pointer hover:bg-gray-400 text-white"
          @click="modelValue = false"
        >
          Exit
        </button>
      </div>
    </div>
  </div>
</template>
