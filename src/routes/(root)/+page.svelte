<script lang="ts">
	import { onMount } from 'svelte';
	import Drawer from './Drawer/Drawer.svelte';
	import Network from './Network/Network.svelte';

	export let data;
</script>

{#if data.relatives}
	<div class="flex h-full">
		<Network relatives={data.relatives} />
		<Drawer />
	</div>
{/if}
