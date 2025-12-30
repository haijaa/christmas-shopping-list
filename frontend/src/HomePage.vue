<script setup>
import GiftDashboard from "./components/GiftDashboard.vue";
</script>

<template>
  <div class="bg-[#f8f6f6] h-screen w-screen flex justify-center items-center">
    <div class="w-4/5">
      <div class="flex justify-between w-full border-b border-gray-300 pb-5">
        <span>
          <h1 class="text-3xl font-bold">Christmas shopping</h1>
          <p class="pb-4 text-red-700 text-lg">
            Handle your christmas shopping with this tracker
          </p>
        </span>
      </div>
      <GiftDashboard />
    </div>
  </div>
</template>
