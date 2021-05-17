import { writable, get } from 'svelte/store'
import { CELL_TYPES, initBoardA, isCellSurrounded } from '../utils/cells'
import { rules } from '../utils/rules';

export const cells = writable(initBoardA());
export const coins = writable(0);
export const cellsPerLine = writable(11);

cells.subscribe((currentCells) => {
    currentCells.filter(c => c.type === CELL_TYPES.MOUNTAIN.id && !c.coinEarn)
                .forEach(c => {
                    if(isCellSurrounded(c.id)) {
                        c.coinEarn = true;
                        coins.set(get(coins) +1);
                    }

                    console.log("============================");
                    rules.forEach(r => {
                        if(r.calc) console.log(r.name, r.calc(currentCells, get(cellsPerLine)));
                    })
                })
})