<script>
	import Board from "./components/board.svelte";
	import Modal from "./components/modal.svelte";
	import Coins from "./components/coins.svelte";

	export let name;
	export let title;
</script>

<main class="app">
	<div class="header">
		<div class="cartographer-infos">
			<p class="label">Cartographer :</p>
			<h1 class="name">{name}</h1>
			<p class="label">Title :</p>
			<h1 class="title">{title}</h1>
		</div>
		<div class="compass"></div>
	</div>

	<Board />
	<Coins />

	<Modal />
</main>

<style>
	.app {
		margin: 0 auto;
        max-width: 640px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: stretch;
	}

	.label {
		text-transform: uppercase;
		margin: 0;
		font-size: 14px;;
	}

	.name, .title {
		color: #ff3e00;
		text-transform: uppercase;
		margin-top: 0;
		font-weight: 100;
	}

	.compass {
        background-image: url("../assets/img/compass.svg");
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
		opacity: .2;
		
		width: 96px;
	}


	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>