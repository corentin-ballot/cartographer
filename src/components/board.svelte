<script>
    import Cell from './cell.svelte';
    import {cells, cellsPerLine} from '../stores/board';
    import { isOpen, selectedCell } from '../stores/modal';
    import { isEditable } from '../utils/cells';

    const selectCellType = (c) => {
        if(isEditable(c.type))
        $isOpen = true;
        $selectedCell = c.id;
    };
</script>

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

<style>
    .board {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        margin: auto;

        border: solid grey 1px;
    }
</style>