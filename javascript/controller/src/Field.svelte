<script lang="ts">
  export let label: string;
  export let htmlFor: string;
</script>

<div class="field">
  <label class="label" for={htmlFor}>{label}</label>
  <div class="control">
    <slot />
  </div>
</div>
