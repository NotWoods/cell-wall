<script lang="ts">
  let open = false;
</script>

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="https://github.com/NotWoods/cell-wall">
      <img src="/assets/logo.png" alt="" width="28" height="28" />
      <span style="margin-left: 0.5rem">CellWall Remote</span>
    </a>

    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      role="button"
      class="navbar-burger burger"
      class:is-active={open}
      aria-label="menu"
      aria-expanded={open.toString()}
      data-target="navMenu"
      on:click={() => {
        open = !open;
      }}>
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </a>
  </div>

  <div id="navMenu" class="navbar-menu" class:is-active={open}>
    <div class="navbar-start">
      <a class="navbar-item" href="#preset"> Preset </a>
      <a class="navbar-item" href="#image"> Image </a>
      <a class="navbar-item" href="#custom"> Custom </a>
    </div>
  </div>
</nav>
