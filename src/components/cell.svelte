<script>
    import { cellsPerLine as cpl, CELL_TYPES} from "../stores/board";

    export let data = {};

    export let cellsPerLine = $cpl;

    export let isFisrtLine = false;
    export let isFisrtCol = false;
    export let isLastLine = false;
    export let isLastCol = false;

    export let click;
</script>

<button class="cell-container" style="flex-basis: {(100/cellsPerLine)}%;" on:click={click}>
    <div class="cell"
        class:cell-mountain={data.type == CELL_TYPES.MOUNTAIN.id}
        class:cell-forest={data.type == CELL_TYPES.FOREST.id}
        class:cell-field={data.type == CELL_TYPES.FIELD.id}
        class:cell-sea={data.type == CELL_TYPES.SEA.id}
        class:cell-village={data.type == CELL_TYPES.VILLAGE.id}
        class:cell-monster={data.type == CELL_TYPES.MONSTER.id}
        class:cell-crevasse={data.type == CELL_TYPES.CREVASSE.id}
        class:cell-ruins={data.isRuins} 
        class:cell-top={isFisrtLine}
        class:cell-bottom={isLastLine}
        class:cell-left={isFisrtCol}
        class:cell-right={isLastCol}
        >
    </div>
</button>

<style>
    .cell-container {
        width: 100%;
        background-color: none;
        padding: 0;
        margin: 0;
        border: none;
    }
    .cell {
        padding-top: 100%;
        border: dashed grey 1px;
        cursor: pointer;
        position: relative;

        background-position: center;
        background-repeat: no-repeat;
        background-size: 75%;
    }
    .cell-top {
        border-top: none;
    }
    .cell-bottom {
        border-bottom: none;
    }
    .cell-left {
        border-left: none;
    }
    .cell-right {
        border-right: none;
    }
    .cell-mountain {
        background-color: #95301a;
        background-image: url("../assets/img/mountain.svg");
    }
    .cell-mountain::after {
        content: "";
        position: absolute;
        display: block;
        background-image: url("../assets/img/coin.svg");
        width: 40%;
        height: 40%;
        bottom: 5%;
        right: calc(50% - 20%);
    }
    .cell-forest {
        background-color: forestgreen;
        background-image: url("../assets/img/forest.svg");
    }
    .cell-field {
        background-color: sandybrown;
        background-image: url("../assets/img/field.svg");
    }
    .cell-sea {
        background-color: slateblue;
        background-image: url("../assets/img/sea.svg");
    }
    .cell-village {
        background-color: #fa1425 ;
        background-image: url("../assets/img/village.svg");
    }
    .cell-monster {
        background-color: darkorchid;
        background-image: url("../assets/img/monster.svg");
    }
    .cell-crevasse {
        background-color: #534e4e;
        background-image: url("../assets/img/crevasse.svg");
    }
    .cell-ruins {
        background-image: url("../assets/img/ruins.svg");
    }
</style>