<script lang="ts">
	export let text: string;
	export let submit = false;
</script>

<button on:click type={submit ? 'submit' : 'button'}>{text}</button>

<style lang="scss">
	@use '../styles/colors.scss' as *;

	button {
		background-color: $c-red-1;
		padding: 20px;
		border: none;
		border-radius: 5px;
		color: white;
		font-size: 1.3rem;
		width: 150px;
		margin-top: 10px;
		text-transform: uppercase;
		font-weight: bold;
	}
</style>
