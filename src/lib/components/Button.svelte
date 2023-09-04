<script lang="ts">
	export let onClick: () => void;
	export let secondary = false;
	export let disabled = false;
	const primaryStyle = 'bg-primary-dark shadow-md';
	const secondaryStyle = 'bg-primary-light shadow-none';
</script>

<button
	on:click={onClick}
	class:cursor-not-allowed={disabled}
	{disabled}
	class={`${secondary ? secondaryStyle : primaryStyle}
				group p-2 justify-center rounded-md relative transition-all
				hover:scale-95 hover:shadow-sm
				focus:scale-95 focus:shadow-sm
        active:translate-y-1`}
>
	<slot />
</button>
