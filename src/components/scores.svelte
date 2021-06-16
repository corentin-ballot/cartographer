<script>
    import { get } from "svelte/store";
    import { cells, cellsPerLine, CELL_TYPES } from "../stores/board";
    import { nextSeason, seasons, season } from "../stores/score";
</script>

<div>
    <div class="scores">
        {#each $seasons as season}
            <div class="score">
                <div class="cell rule">{season.score.r1}</div>
                <div class="cell rule">{season.score.r2}</div>
                <div class="cell coins">{season.score.coins}</div>
                <div class="cell monsters">-{season.score.monsters}</div>
                <div class="cell sstotal">{season.score.total}</div>
            </div>
        {/each}
    </div>
    {#if $season < $seasons.length}
        <button class="next-season" on:click={nextSeason}>Next season</button>
    {:else}
        <div class="total">{$seasons.reduce((a,b) => a + b.score.total, 0)}</div>
    {/if}
</div>

<style>
    .scores {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .score {
        display: grid;
        grid-template-columns: auto auto auto;
        grid-template-rows: auto auto;
        border: solid 1px black;
        width: 100%;
        margin: 0 8px;
        text-align: center;
    }
    .score:first-child {
        margin-left: 0;
    }
    .score:last-child {
        margin-right: 0;
    }

    .cell {
        border: solid 1px black;
        height: 100%;
    }

    .cell.sstotal {
        font-size: 24px;
        line-height: 40px;
        grid-column: 3;
        grid-row-start: 1;
        grid-row-end: 3;
    }

    .total {
        background-image: url("../assets/img/shield.svg");
        background-repeat: no-repeat;
        background-size: contain;
        width: 64px;
        height: 64px;
        flex-shrink: 0;
        text-align: center;
        line-height: 40px;
        margin: 0 auto;
    }

    .next-season {
        width: 100%;
    }
</style>