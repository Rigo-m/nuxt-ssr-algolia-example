<template>
  <div>
    <NuxtLink :href="'/instant_search/Samsung'" style="display: block">Go To instant search samsung</NuxtLink>
    <NuxtLink :href="'/instant_search/Metra'" style="display: block">Go To instant search metra</NuxtLink>

    <NuxtLink :href="'/airbnb/stoca'" style="display: block">Go To Us giorgio</NuxtLink>
    <InstantSearchProvider :indexName="$route.params.indexName" />
  </div>
</template>
<script setup lang="ts"></script>

<style>
.cont {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.item {
  display: flex;
  flex-direction: column;
  width: 33.333%;
  flex: 0 0 33.333%;
}
</style>
