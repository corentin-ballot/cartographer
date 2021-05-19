<script>
	import Board from "./components/board.svelte";
	import Modal from "./components/modal.svelte";
	import Login from "./components/login.svelte";
	import Setup from "./components/setup.svelte";
	import { username } from "./stores/user";
</script>


<div>
	{#if !$username}
		<Login />
	{:else}
		<Setup />
	{/if}

	<Modal />
</div>

<style>
	
</style>