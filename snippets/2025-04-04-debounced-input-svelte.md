---
title: Svelte 5 Debounced Input Component - Optimize Search Performance
shortDescription: A code snippet for an input that updates the bound value with a delay. Can be used for search inputs
pubDate: 2025-04-04
tags:
  - Svelte
---

This example demonstrates a reusable debounced input component in Svelte 5 that delays updates to prevent excessive API calls during user typing.
The debounce technique waits for a pause in user input before triggering actions, making it ideal for search inputs and real-time filtering.

**Key advantages:**
- **Performance**: Reduces API calls from every keystroke to only when user pauses typing
- **Server load**: Minimizes unnecessary requests and bandwidth usage
- **User experience**: Prevents flickering results and provides smoother interactions
- **Reusability**: Component can be dropped into any form with configurable delay timing

## The `debounce` method

```js
export function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```

## DebouncedInput.svelte

```svelte
<script lang="ts">
    import { debounce } from '$lib';

    let { debouncedValue = $bindable(), initialValue, ...props } = $props();

    const update = debounce((v: string) => (debouncedValue = v), 300);

    let value = $state(initialValue);
    $effect(() => update(value));
</script>

<input type="text" bind:value {...props} />
```

## Usage

```svelte
<script lang="ts">
    import DebouncedInput from './DebouncedInput.svelte';

    let searchTerm = $state('');
    let results = $state([]);
    let loading = $state(false);

    $effect(async () => {
        if (!searchTerm.trim()) {
            results = [];
            return;
        }

        loading = true;
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
            results = await response.json();
        } catch (error) {
            console.error('Search failed:', error);
            results = [];
        } finally {
            loading = false;
        }
    });
</script>

<DebouncedInput
    bind:debouncedValue={searchTerm}
    placeholder="Search..."
    class="w-full px-3 py-2 border rounded"
/>

{#if loading}
    <p>Searching...</p>
{:else if results.length > 0}
    <ul>
        {#each results as result}
            <li>{result.title}</li>
        {/each}
    </ul>
{/if}
```
