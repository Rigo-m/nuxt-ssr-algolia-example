# Nuxt InstantSearch SSR

After _MANY_ attempts, I've managed to make InstantSearch work almost flawlessly with nuxt3 in SSR.

### Premise

The `@nuxtjs/algolia` module is installed and used so the "worst case scenario" is met,
where most nuxt developers will have the module and want to use instantsearch with the same apiKey and applicationId.

The solution has some caveats that I will explain later, and it's not performant by any means, but this is "by design"
because Vue-instantsearch is not performant in how it handles SSR.
Somehow, Algolia devs decided to render the component one more time alongside nuxt (using renderToString) to infer the algolia search state
instead of relying on Nuxt isomorphic capabilities.
There's a single source of truth, which is the global mixin that you will find in the instantsearch plugin.
I had to install the plugin _globally_, so pages that does not have a need for instantsearch still have to get the instantsearch client shoved
into their figurative throat.

### Parts

#### app/router.options.ts

This is to ensure nuxt router understands deeply nested queries objects using `qs`.

#### plugins/instantsearch.ts

This is the global mixin in which the SSR Algolia instance gets created. With its own router and with an indexName already set.
The indexName part is tricky, because many times we need to change which index are we fetching (for localization purposes for example)

You need to find a way to infer from the route the correct index to set. An example has been given (lucky you if you won't ever change index).

Routing part has already been implemented with a basic working example, refer to the instantsearch docs if you need different routing.

#### components/InstantSearchProvider.ts

Here you can set your instantsearch components. It accepts an indexName.
Caveats:

- Logic for which the indexName gets passed has to be THE SAME of how it gets inferred inside the plugin (already esemplified)
- Instantsearch components have to live inside of this component and not inside its children

When you need a different set of components, create a new InstantSearchProvider copying the serverPrefetch/beforeMount logic.

Why defineComponent and not script setup? Because passing getCurrentInstance on server prefetch does not seem to work the same as passing `this` with option api.

Feel free to check the repo yourselves and improve where it's due.
