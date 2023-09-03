<script lang="ts">
	export let onClick: () => void;
	export let disabled = false;
</script>

<button
	on:click={onClick}
	class:cursor-not-allowed={disabled}
	{disabled}
	class="group p-2 justify-center flex gap-1 bg-primary-dark shadow-md rounded-md relative transition-all
				hover:scale-95 hover:shadow-sm
				focus:scale-95 focus:shadow-sm
        active:translate-y-1"
>
	<slot />
</button>
