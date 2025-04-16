<script lang="ts">
	import type { InputGroup } from '../../routes/inputs';

	export let options: InputGroup;
	export let name: string;
	export let id: string;
</script>

<select {name} {id} class="text-white cursor-pointer select-none appearance-none h-10 pl-4 pr-10 text-base border-2 border-white/20 bg-[#111] font-normal rounded-md bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-[position:calc(100%-20px)_calc(1px+50%),calc(100%-16px)_calc(1px+50%)] bg-[size:4px_4px,4px_4px] bg-no-repeat w-full max-w-[12rem] hover:border-white/30 focus:border-[#5c9aed] focus-visible:outline focus-visible:outline-[0.2em] focus-visible:outline-[#5c9aed] focus-visible:outline-offset-[-0.2em]">
	{#each options as option (option.name)}
		<option value={option.value ?? option.name} class="bg-gray-700">{option.label}</option>
	{/each}
</select>

<style>
	select {
		color: white;
		cursor: pointer;
		-webkit-user-select: none;
		user-select: none;
		-webkit-appearance: none;
		appearance: none;
		height: 2.5rem;
		padding-left: 1rem;
		padding-right: 2.5rem;
		font-size: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background-color: #111;
		font-weight: 400;
		border-radius: 0.5rem;
		background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
			linear-gradient(135deg, currentColor 50%, transparent 50%);
		background-position: calc(100% - 20px) calc(1px + 50%), calc(100% - 16px) calc(1px + 50%);
		background-size: 4px 4px, 4px 4px;
		background-repeat: no-repeat;
		width: 100%;
		max-width: 12rem;
	}

	select:focus-visible {
		outline: 0.2em solid #5c9aed;
		outline-offset: -0.2em;
	}
	
	option {
		background-color: #232323;
	}
</style>
