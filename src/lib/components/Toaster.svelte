<script>
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import { store } from '$lib/store';
</script>

<div
	class:translate-y-12={!!$store.showErrorToaster}
	class="-translate-y-full transition-transform absolute items-center top-0 left-1/2 -translate-x-1/2
	p-2 bg-primary-light text-white z-10 flex gap-2 rounded-lg border-2 border-accent-1 shadow-md"
>
	<span class="max-w-sm"> {$store.errorMessage}</span>
	<div class="ml-2 w-[1px] h-6 bg-primary-dark" />
	<button class="text-white hover:text-white rounded-md hover:bg-primary-dark">
		<CloseIcon />
	</button>
</div>
