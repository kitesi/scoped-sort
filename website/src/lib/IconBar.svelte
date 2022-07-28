<script lang="ts">
	import Icon from '$lib/Icon.svelte';
</script>

<div>
	<ul>
		<li><a href="/github"><Icon width="1.4rem" height="1.4rem" name="github" /></a></li>
		<li><a href="/vscode"><Icon width="1.4rem" height="1.4rem" name="edit" /></a></li>
		<li><a href="/npm"><Icon width="1.4rem" height="1.4rem" name="package" /></a></li>
		<li><a href="/cli"><Icon width="1.4rem" height="1.4rem" name="terminal" /></a></li>
	</ul>
</div>

<style lang="scss">
	@use '../colors.scss' as *;

	ul {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
	}

	li {
		text-decoration: none;
		list-style-type: none;
	}

	a {
		color: $primary-accent;
	}
</style>
