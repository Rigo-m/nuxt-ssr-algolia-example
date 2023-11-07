// @ts-ignore
import VueInstantSearch, {
  createServerRootMixin,
  // @ts-ignore
} from "vue-instantsearch/vue3/es";
import algoliasearch from "algoliasearch/lite";
import type { LocationQueryRaw } from "vue-router";

export default defineNuxtPlugin(({ vueApp }) => {
  const { apiKey, applicationId } = useRuntimeConfig().public.algolia;
  const searchClient = algoliasearch(applicationId, apiKey);
  const router = useRouter();
  const route = useRoute();

  // SET DEFAULT INDEX NAME HERE
  const indexName = route.params.indexName ?? "instant_search";
  const algoliaRouter: Record<string, any> = {
    router: {
      read() {
        return route.query;
      },
      write(routeState: LocationQueryRaw) {
        router.push({ query: routeState });
      },
      createURL(routeState: LocationQueryRaw) {
        return router.resolve({
          query: routeState,
        }).href;
      },
      onUpdate(cb: any) {
        if (typeof window === "undefined") return;
        this._removeAfterEach = router.afterEach(() => {
          cb(this.read());
        });

        this._onPopState = () => {
          cb(this.read());
        };
        window.addEventListener("popstate", this._onPopState);
      },
      dispose() {
        if (typeof window === "undefined") {
          return;
        }
        if (this._onPopState) {
          window.removeEventListener("popstate", this._onPopState);
        }
        if (this._removeAfterEach) {
          this._removeAfterEach();
        }
      },
    },
  };
  vueApp.use(VueInstantSearch);
  vueApp.mixin(
    createServerRootMixin({
      searchClient,
      indexName: indexName,
      routing: algoliaRouter,
    }),
  );
});
