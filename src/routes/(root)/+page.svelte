<script lang="ts">
	import Drawer from './Drawer/Drawer.svelte';
	import Network from './Network/Network.svelte';

	export let data;
</script>

{#if data.relatives}
	<Network relatives={data.relatives} />
{/if}
<Drawer />
