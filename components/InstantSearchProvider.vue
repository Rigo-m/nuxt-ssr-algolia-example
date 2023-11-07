<template>
  <div>
    <AisInstantSearchSsr>
      <AisConfigure :hits-per-page.camel="4" v-if="$route.params.indexName === 'instant_search'"
        :facet-filters.camel="`brand:${$route.params.brand}`" />
      <AisRefinementList :attribute="$route.params.indexName === 'airbnb' ? 'room_type' : 'categories'
        ">
      </AisRefinementList>
      <AisInfiniteHits show-previous>
        <template #loadPrevious="{ isFirstPage, refinePrevious }">
          <button :disabled="isFirstPage" @click="refinePrevious">
            Load less
          </button>
        </template>
        <template v-slot="{ items, refineNext, isLastPage }">
          <div class="cont">
            <div v-for="item in items" :key="item.objectID" class="item">
              {{ item.name }}
              <img :src="item.image ?? item.thumbnail_url" />
              {{ item }}
            </div>
          </div>
          <button :disabled="isLastPage" @click="refineNext">Load more</button>
        </template>
      </AisInfiniteHits>
    </AisInstantSearchSsr>
  </div>
</template>
<script>
import { renderToString } from "vue/server-renderer";
import {
  AisInstantSearchSsr,
  AisRefinementList,
  AisInfiniteHits,
  AisIndex,
  AisConfigure,
  // @ts-ignore
} from "vue-instantsearch/vue3/es/index.js";

export default defineNuxtComponent({
  components: {
    AisInstantSearchSsr,
    AisRefinementList,
    AisInfiniteHits,
    AisIndex,
    AisConfigure,
  },
  inject: ["$_ais_ssrInstantSearchInstance"],
  async serverPrefetch() {
    const s = await this["$_ais_ssrInstantSearchInstance"].findResultsState({
      component: this,
      renderToString,
    });
    this.$nuxt.ssrContext.payload.data.algoliaState = s;
  },
  props: {
    indexName: {
      type: String,
      required: false,
      default: null,
    },
  },
  mounted() {
    console.log(this.$_ais_ssrInstantSearchInstance);
    setTimeout(() => { }, 5000);
  },
  async beforeMount() {
    if (this.$nuxt.payload.data.algoliaState) {
      this.$_ais_ssrInstantSearchInstance.hydrate(
        this.$nuxt.payload.data.algoliaState,
      );
    } else {
      // somehow, it needs to be disposed and refreshed when i change route with client side navigation
      this.instantsearch.dispose();

      this.$nextTick(() => {
        this.$nextTick(() => {
          this.instantsearch.helper.setIndex(this.indexName).search();
        });
      });
    }
    // avoid double hydration
    delete this.$nuxt.payload.data.algoliaState;
  },
});
</script>
