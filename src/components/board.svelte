<script>
    import Cell from './cell.svelte';
    import {cells, cellsPerLine, CELL_TYPES, title} from '../stores/board';
    import { isOpen, selectedCell } from '../stores/modal';
	import Coins from "./coins.svelte";
    import { username } from '../stores/user';
    import Scores from './scores.svelte';

    const selectCellType = (c) => {
        if(Object.values(CELL_TYPES).filter(t => t.id == c.type && t.isEditable).length > 0) 
            $isOpen = true;
        $selectedCell = c.id;
    };
</script>

<div class="app">
    <div class="header">
        <div class="cartographer-infos">
            <p class="label">Cartographer :</p>
            <h1 class="name">{$username}</h1>
            <p class="label">Title :</p>
            <h1 class="title">{$title}</h1>
        </div>
        <div class="compass"></div>
    </div>
    <div class="board">
    {#each $cells as cell, index}
        <Cell click={() => selectCellType(cell)}
            data={cell}
            isFisrtCol={index % $cellsPerLine == 0} 
            isFisrtLine={index < $cellsPerLine} 
            isLastCol={index % $cellsPerLine == $cellsPerLine - 1} 
            isLastLine={index >= $cells.length - $cellsPerLine} />
    {/each}
    </div>
	<Coins />
    <Scores />
</div>

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
		font-size: 14px;
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
    
    .board {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: 0 auto 16px;

        border: solid grey 1px;
    }
</style>