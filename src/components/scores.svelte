<script>
    import { get } from "svelte/store";
    import { cells, cellsPerLine, CELL_TYPES, coins, scoring } from "../stores/board";

    let current = 0;

    let seasons = [
        {name: "Printemps", r1:$scoring[0].calc, r2:$scoring[1].calc, ended: false, score: {r1: 0, r2: 0, coins: 0, monsters: 0, total: 0}},
        {name: "Été", r1:$scoring[1].calc, r2:$scoring[2].calc, ended: false, score: {r1: 0, r2: 0, coins: 0, monsters: 0, total: 0}},
        {name: "Automne", r1:$scoring[2].calc, r2:$scoring[3].calc, ended: false, score: {r1: 0, r2: 0, coins: 0, monsters: 0, total: 0}},
        {name: "Hiver", r1:$scoring[3].calc, r2:$scoring[0].calc, ended: false, score: {r1: 0, r2: 0, coins: 0, monsters: 0, total: 0}},
    ]

    const endSeason = () => {
        let r1 = seasons[current].r1(get(cells),get(cellsPerLine));
        let r2 = seasons[current].r2(get(cells),get(cellsPerLine));
        let cs = get(coins);
        let monsters = $cells.filter(c => c.type == CELL_TYPES.MONSTER.id).map(c => c.getNeighborsOfType(CELL_TYPES.EMPTY.id)).reduce((a,b) => a.concat(b),[]).filter((e,i,a) => a.indexOf(e) == i).length;
        seasons[current].score = {r1, r2, coins: cs, monsters, total: r1+r2+cs-monsters};

        current++;
    }
</script>

<div>
    <div class="scores">
        {#each seasons as season}
            <div class="score">
                <div class="cell rule">{season.score.r1}</div>
                <div class="cell rule">{season.score.r2}</div>
                <div class="cell coins">{season.score.coins}</div>
                <div class="cell monsters">-{season.score.monsters}</div>
                <div class="cell sstotal">{season.score.total}</div>
            </div>
        {/each}
    </div>
    {#if current < seasons.length}
        <button class="next-season" on:click={endSeason}>Next season</button>
    {:else}
        <div class="total">{seasons.reduce((a,b) => a + b.score.total, 0)}</div>
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