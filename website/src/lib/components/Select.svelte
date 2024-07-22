<script lang="ts">
	import type { InputGroup } from '../../routes/inputs';

	export let options: InputGroup;
	export let name: string;
	export let id: string;
</script>

<select {name} {id}>
	{#each options as option (option.name)}
		<option value={option.value ?? option.name}>{option.label}</option>
	{/each}
</select>

<style>
	select {
		color: var(--clr-bg-primary-content);
		cursor: pointer;
		-webkit-user-select: none;
		user-select: none;
		-webkit-appearance: none;
		appearance: none;
		height: 3rem;
		padding-left: 1rem;
		padding-right: 2.5rem;
		font-size: 0.875rem;
		border: 0.15em solid var(--clr-bg-tertiary);
		background-color: var(--clr-bg-tertiary);
		font-weight: 600;
		border-radius: 0.2rem;
		background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
			linear-gradient(135deg, currentColor 50%, transparent 50%);
		background-position:
			calc(100% - 20px) calc(1px + 50%),
			calc(100% - 16px) calc(1px + 50%);
		background-size:
			4px 4px,
			4px 4px;
		background-repeat: no-repeat;
		width: 100%;
		max-width: 12rem;
	}

	select:focus-visible {
		outline: 0.2em solid var(--clr-accent-content);
		outline-offset: -0.2em;
	}
	option {
		background-color: var(--clr-bg-secondary);
	}
</style>
