import { writable, get, set } from 'svelte/store'

export const getRegions = () => {
    return get(cells).filter(cell => cell.type != CELL_TYPES.EMPTY.id).map(cell => {
        let cs = [cell.id];
        if(cell.id >= get(cellsPerLine) && get(cells)[cell.id - get(cellsPerLine)].type == cell.type) cs.push(cell.id - get(cellsPerLine));
        if(cell.id < get(cells).length - get(cellsPerLine) && get(cells)[cell.id + get(cellsPerLine)].type == cell.type) cs.push(cell.id + get(cellsPerLine));
        if(cell.id%get(cellsPerLine) != 0 && get(cells)[cell.id - 1].type == cell.type) cs.push(cell.id - 1);
        if(cell.id%get(cellsPerLine) != get(cellsPerLine) - 1 && get(cells)[cell.id + 1].type == cell.type) cs.push(cell.id + 1);

        return {
            type: cell.type,
            cells: cs
        }
    }).reduce(regionsReducer);
}

const regionsReducer = (regions, region) => {
    if(!Array.isArray(regions)) regions = [regions];
    let found = false;
    regions.forEach(r => {
        if(r.type == region.type && r.cells.some(_r => region.cells.includes(_r))) {
            r.cells = r.cells.concat(region.cells).filter((c, index, a) => a.indexOf(c) == index);
            found = true;
        }
    });
    return found ? regions : [...regions, region];
}

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

export function Cell(id, type = CELL_TYPES.EMPTY.id, isRuins = false) {
    this.id = id;
    this.type = type;
    this.isRuins = isRuins;

    this.hasNeighborOfType = function(_type) {
        return (this.id >= get(cellsPerLine) && get(cells)[this.id - get(cellsPerLine)].type == _type)
                || (this.id < get(cells).length - get(cellsPerLine) && get(cells)[this.id + get(cellsPerLine)].type == _type)
                || (this.id%get(cellsPerLine) != 0 && get(cells)[this.id - 1].type == _type)
                || (this.id%get(cellsPerLine) != get(cellsPerLine) - 1 && get(cells)[this.id + 1].type == _type);
    }

    this.getNeighborsOfType = function(_type) {
        let neighbors = [];
        if(this.id >= get(cellsPerLine) && get(cells)[this.id - get(cellsPerLine)].type == _type) neighbors.push(this.id - get(cellsPerLine));
        if(this.id < get(cells).length - get(cellsPerLine) && get(cells)[this.id + get(cellsPerLine)].type == _type) neighbors.push(this.id + get(cellsPerLine));
        if(this.id%get(cellsPerLine) != 0 && get(cells)[this.id - 1].type == _type) neighbors.push(this.id - 1);
        if(this.id%get(cellsPerLine) != get(cellsPerLine) - 1 && get(cells)[this.id + 1].type == _type) neighbors.push(this.id + 1);
        return neighbors;
    }

    this.getNeighborsType = function() {
        let neighbors = [];
        if(this.id >= get(cellsPerLine) && get(cells)[this.id - get(cellsPerLine)].type != CELL_TYPES.EMPTY.id) neighbors.push(get(cells)[this.id - get(cellsPerLine)].type);
        if(this.id < get(cells).length - get(cellsPerLine) && get(cells)[this.id + get(cellsPerLine)].type != CELL_TYPES.EMPTY.id) neighbors.push(get(cells)[this.id + get(cellsPerLine)].type);
        if(this.id%get(cellsPerLine) != 0 && get(cells)[this.id - 1].type != CELL_TYPES.EMPTY.id) neighbors.push(get(cells)[this.id - 1].type);
        if(this.id%get(cellsPerLine) != get(cellsPerLine) - 1 && get(cells)[this.id + 1].type != CELL_TYPES.EMPTY.id) neighbors.push(get(cells)[this.id + 1].type);
        return neighbors;
    }

    this.isAtEdge = function() {
        return this.id < get(cellsPerLine) || this.id >= get(cells).length - get(cellsPerLine) || this.id%get(cellsPerLine) == 0 || this.id%get(cellsPerLine) == get(cellsPerLine) -1;
    }

    this.isSurrounded = function() {
        return (this.id < get(cellsPerLine) || get(cells)[this.id - get(cellsPerLine)].type != CELL_TYPES.EMPTY.id)
        && (this.id >= get(cells).length - get(cellsPerLine) || get(cells)[id + get(cellsPerLine)].type != CELL_TYPES.EMPTY.id)
        && (this.id%get(cellsPerLine) == 0 || get(cells)[id - 1].type != CELL_TYPES.EMPTY.id)
        && (this.id%get(cellsPerLine) == get(cellsPerLine) - 1 || get(cells)[id + 1].type != CELL_TYPES.EMPTY.id);
    }
}

export const boards = [
    {
        name: "Face A", 
        init: () => {
            let array = initBoard(121);
            // Add mountains
            array[14].type = CELL_TYPES.MOUNTAIN.id;array[30].type = CELL_TYPES.MOUNTAIN.id;array[60].type = CELL_TYPES.MOUNTAIN.id;array[90].type = CELL_TYPES.MOUNTAIN.id;array[106].type = CELL_TYPES.MOUNTAIN.id;
            // Add ruins
            array[16].isRuins = true;array[23].isRuins = true;array[23].isRuins = true;array[31].isRuins = true;array[89].isRuins = true;array[97].isRuins = true;array[104].isRuins = true;
            return array;
        }
    },
    {
        name: "Face B",
        init: () => {
            let array = initBoard(121);
            // Add mountains
            array[19].type = CELL_TYPES.MOUNTAIN.id;
            array[25].type = CELL_TYPES.MOUNTAIN.id;
            array[82].type = CELL_TYPES.MOUNTAIN.id;
            array[97].type = CELL_TYPES.MOUNTAIN.id;
            array[101].type = CELL_TYPES.MOUNTAIN.id;

            // Add crevasses
            array[38].type = CELL_TYPES.CREVASSE.id;
            array[48].type = CELL_TYPES.CREVASSE.id;
            array[49].type = CELL_TYPES.CREVASSE.id;
            array[59].type = CELL_TYPES.CREVASSE.id;
            array[60].type = CELL_TYPES.CREVASSE.id;
            array[61].type = CELL_TYPES.CREVASSE.id;
            array[71].type = CELL_TYPES.CREVASSE.id;
            
            // Add ruins
            array[17].isRuins = true;
            array[24].isRuins = true;
            array[67].isRuins = true;
            array[85].isRuins = true;
            array[102].isRuins = true;
            return array;
        }
    }
]

const initBoard = (length = 121) => {
    return Array.from({length}, (v,i) => new Cell(i));
}

export const board = writable(boards[0]);
export const cells = writable([]);
export const coins = writable(0);
export const cellsPerLine = writable(11);
export const title = writable("");
export const scoring = writable([{},{},{},{}]);

board.subscribe(currentValue => {
    cells.set(currentValue.init());
})