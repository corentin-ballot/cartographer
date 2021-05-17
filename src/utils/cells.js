import { get } from "svelte/store";
import { cellsPerLine, cells } from '../stores/board';

export const CELL_TYPES = {
    EMPTY: {id: 0, isEditable: true},
    MOUNTAIN: {id: 1, isEditable: false},
    FOREST: {id: 2, isEditable: true},
    FIELD: {id: 3, isEditable: true},
    SEA: {id: 4, isEditable: true},
    VILLAGE: {id: 5, isEditable: true},
    MONSTER: {id: 6, isEditable: true},
    CREVASSE: {id: 7, isEditable: false}
}

export const selectableTypes = () => {
    return Object.values(CELL_TYPES).filter(t => t.isEditable);
}

export const isEditable = (id) => {
    return Object.values(CELL_TYPES).filter(t => t.id == id && t.isEditable).length > 0;
}

export const isCellSurrounded = (id) => {
    let cpl = get(cellsPerLine);
    let cs = get(cells);

    let isTopOccupied = id < cpl || cs[id - cpl].type != CELL_TYPES.EMPTY.id;
    let isBotOccupied = id > cs.length - cpl || cs[id + cpl].type != CELL_TYPES.EMPTY.id;
    let isLeftOccupied = id%cpl == 0 || cs[id - 1].type != CELL_TYPES.EMPTY.id;
    let isRightOccupied = id%cpl == cpl - 1 || cs[id + 1].type != CELL_TYPES.EMPTY.id;

    return isTopOccupied && isRightOccupied && isBotOccupied && isLeftOccupied;
}

export const initBoardA = () => {
    let array = initBoard(121);

    // Add mountains
    array[14].type = CELL_TYPES.MOUNTAIN.id;
    array[30].type = CELL_TYPES.MOUNTAIN.id;
    array[60].type = CELL_TYPES.MOUNTAIN.id;
    array[90].type = CELL_TYPES.MOUNTAIN.id;
    array[106].type = CELL_TYPES.MOUNTAIN.id;

    // Add ruins
    array[16].isRuins = true;
    array[23].isRuins = true;
    array[23].isRuins = true;
    array[31].isRuins = true;
    array[89].isRuins = true;
    array[97].isRuins = true;
    array[104].isRuins = true;

    return array;
}

const initBoard = (length = 121) => {
    return Array.from({length}, (v,i) => initCell(i, CELL_TYPES.EMPTY.id));
}

export const initCell = (id, type = CELL_TYPES.EMPTY.id, isRuins = false) => {
    return {id, type, isRuins}
}