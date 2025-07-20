<script lang="ts">
	import type { InputGroup } from '../../routes/inputs';

	export let options: InputGroup;
	export let name: string;
	export let id: string;
</script>

<select {name} {id} class="text-white cursor-pointer select-none appearance-none h-10 pl-4 pr-10 text-base border border-[#2e333b] bg-[#131417] font-medium rounded-lg bg-[linear-gradient(45deg,transparent_50%,currentColor_50%),linear-gradient(135deg,currentColor_50%,transparent_50%)] bg-position-[calc(100%-20px)_calc(1px+50%),calc(100%-16px)_calc(1px+50%)] bg-size-[4px_4px,4px_4px] bg-no-repeat w-full max-w-48 hover:border-[#2e333b] focus:border-[#2e333b] focus:ring-2 focus:ring-[#2e333b]/20 transition-all duration-200">
	{#each options as option (option.name)}
		<option value={option.value ?? option.name} class="bg-[#2e333b]">{option.label}</option>
	{/each}
</select>