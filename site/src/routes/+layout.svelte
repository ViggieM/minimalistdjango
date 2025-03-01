<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<nav class="flex justify-center">
  <ul class="flex gap-4 bg-black pt-2 pb-3 px-5 rounded-b-xl">
    <li class="uppercase"><a href="/" class="nav-item">Home</a></li>
    <li class="uppercase"><a href="" class="nav-item">TIL</a></li>
    <li class="uppercase"><a href="" class="nav-item">Articles</a></li>
    <li class="uppercase"><a href="" class="nav-item">Tools</a></li>
    <li class="uppercase"><a href="" class="nav-item">Snippets</a></li>
  </ul>
</nav>

{@render children()}
