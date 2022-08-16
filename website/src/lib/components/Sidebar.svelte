<script lang="ts">
	let isChecked = false;
	export let attach = false;
</script>

<input class:attach aria-label={isChecked ? 'Close' : 'Open'} type="checkbox" id="menu-toggle" />
<label class:attach for="menu-toggle">
	<span class="top" />
	<span class="middle" />
	<span class="bottom" />
</label>

<div class:attach><slot /></div>

<style lang="scss">
	@use '../styles/colors.scss' as *;
	@use '../styles/numerical.scss' as *;

	input {
		opacity: 0;
		position: absolute;
	}
	div {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		transform: translateX(-100%);
		transition: 100ms ease-in;
		z-index: 2;
	}

	div:not(.attach) {
		width: 100%;
	}

	input:checked ~ div {
		transform: translateX(0);
	}

	span {
		display: block;
		top: 20px;
		right: 0px;
	}

	span {
		display: block;
		width: 1.8rem;
		height: 2px;
		background-color: white;
		transition-duration: 100ms;
	}

	label {
		display: flex;
		position: absolute;
		right: 20px;
		top: 20px;
		flex-direction: column;
		justify-content: space-between;
		height: 16px;
		z-index: 3;
		cursor: pointer;
	}

	input:checked ~ label .middle {
		opacity: 0;
	}

	input:checked ~ label .top {
		transform: rotate(45deg);
	}

	input:checked ~ label .bottom {
		transform: rotate(135deg) translate(-10px, 10px);
	}
	@media screen and (min-width: $size-1) {
		div.attach {
			position: static;
			transform: translateX(0);
			box-shadow: none;
			-webkit-box-shadow: none;
			-moz-box-shadow: none;
		}

		label.attach {
			opacity: 0;
		}
	}
</style>
