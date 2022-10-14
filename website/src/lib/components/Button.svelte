<script lang="ts">
	export let text: string;
	export let submit = false;
</script>

<button on:click type={submit ? 'submit' : 'button'}>{text}</button>

<style lang="scss">
	@use '../styles/colors.scss' as *;

	button {
		background-color: #952d2d;
		font-size: 1.3rem;
		padding: 0.7em;
		border: none;
		border-radius: 5px;
		color: white;
		width: 150px;
		margin-top: 10px;
		text-transform: uppercase;
		font-weight: bold;
	}

	button:focus-visible {
		outline-offset: 4px;
		outline: 2px solid #952d2d;
	}
</style>
