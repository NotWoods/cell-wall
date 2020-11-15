<script lang="ts">
  export let value: string;
</script>

<button
  type="submit"
  formaction="/v3/device/power"
  class="button"
  name="on"
  {value}>
  <slot />
</button>
