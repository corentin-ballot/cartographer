import { getRegions, CELL_TYPES } from "../stores/board";

export const rules = [   
    {
        id: 26, 
        type: "Forêt", 
        name: "Bois de la Sentinelle", 
        desc: "Gagnez une étoile de réputation pour chaque case Forêt adjacente au bord du parchemin.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id && (c.id % cellsPerLine == 0 || c.id < cellsPerLine || c.id % cellsPerLine == cellsPerLine - 1 || c.id >= cells.length - cellsPerLine)).length
    },
    {
        id: 27, 
        type: "Forêt", 
        name: "Chemin Verdoyant", 
        desc: "Gagnez une étoile de réputation pour chaque ligne ou colonne ayant au moins une case Forêt. La même case Forêt peut être décomptée à la fois pour une ligne et pour une colonne.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id).map(c => [c.id%cellsPerLine +1, -Math.trunc(c.id/cellsPerLine) -1]).flat(1).filter((c, index, a) => a.indexOf(c) == index).length
    },
    {
        id: 28, 
        type: "Forêt", 
        name: "Arbres-Vigies", 
        desc: "Gagnez une étoile de réputation pour chaque case Forêt entourée sur ses quatres côtés par une case remplies ou par le bord du parchemin.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id && c.isSurrounded()).length
    },
    {
        id: 29, 
        type: "Forêt", 
        name: "Forêt des Hauts Plateaux", 
        desc: "Gagnez trois étoiles de réputation pour chaque case Montagne connectées à une autre case Montagne par une région de Forêts.",
        calc: (cells, cellsPerLine) => getRegions().filter(r => r.type == CELL_TYPES.FOREST.id).map(r => r.cells.reduce((a, b) => a.concat(cells[b].getNeighborsOfType(CELL_TYPES.MOUNTAIN.id)), []).filter((c, index, a) => a.indexOf(c) == index)).filter(r => r.length >= 2).reduce((a,b) => a.concat(b), []).filter((c, index, a) => a.indexOf(c) == index).length *3
    },

    {
        id: 30, 
        type: "Ferme/Lac", 
        name: "Cannaux d'Irrigation", 
        desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à au moins une Ferme. Gagnez une étoile de réputation pour chaque case Ferme adjacente à au moins une case Lac.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.SEA.id && c.hasNeighborOfType(CELL_TYPES.FIELD.id)).length + cells.filter(c => c.type == CELL_TYPES.FIELD.id && c.hasNeighborOfType(CELL_TYPES.SEA.id)).length
    },
    {
        id: 31, 
        type: "Ferme/Lac", 
        name: "Vallée des Mages", 
        desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à une case Montagne. Gagnez une étoile de réputation pour chaque case Ferme adjacente à une case à une case Montagne.",
        calc: (cells, cellsPerLine) => 2* cells.filter(c => c.type == CELL_TYPES.SEA.id && c.hasNeighborOfType(CELL_TYPES.MOUNTAIN.id)).length + cells.filter(c => c.type == CELL_TYPES.FIELD.id && c.hasNeighborOfType(CELL_TYPES.MOUNTAIN.id)).length
    },
    {
        id: 32, 
        type: "Ferme/Lac", 
        name: "Grenier Doré", 
        desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à une case Ruines. Gagnez trois étoiles de réputation pour chaque case Ferme sur une case Ruines.",
        calc: (cells, cellsPerLine) => cells.filter(c => (c.type == CELL_TYPES.SEA.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].isRuins) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].isRuins) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].isRuins) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].isRuins)))).length + cells.filter(c => c.type == CELL_TYPES.FIELD.id && cells[c.id].isRuins).length*3
    },
    {
        id: 33, 
        type: "Ferme/Lac", 
        name: "Montée des Eaux", 
        desc: "Gagnez trois étoiles de réputation pour chaque région de Ferme qui n'est adjacente ni à une case Lac ni au bord du parchemin. Gagnez trois étoiles de réputation pour chaque région de Lacs qui n'est adjacente ni à une case Ferme ni au bord du parchemin.",
        calc: (cells, cellsPerLine) => getRegions().filter(r => r.type == CELL_TYPES.FIELD.id && (r.cells.filter(cid => cells[cid].hasNeighborOfType(CELL_TYPES.SEA.id) || cells[cid].isAtEdge()).length == 0)).length *3 + getRegions().filter(r => r.type == CELL_TYPES.SEA.id && (r.cells.filter(cid => cells[cid].hasNeighborOfType(CELL_TYPES.FIELD.id) || cells[cid].isAtEdge()).length == 0)).length *3
    },

    {
        id: 34, 
        type: "Village", 
        name:"Places Fortes", 
        desc: "Gagnez huit étoiles de réputationpour chaque région de six Villages ou plus.",
        calc: (cells, cellsPerLine) => getRegions().filter(r => r.type == CELL_TYPES.VILLAGE.id && r.cells.length >= 6).length *8
    },
    {
        id: 35, 
        type: "Village", 
        name:"Grande Cité", 
        desc: "Gagnez une étoile de réputation pour chaque case Village dans la plus grande région de Village qui n'est pas adjacente à une case montagne.",
        calc: (cells, cellsPerLine) => getRegions().filter(r => r.type == CELL_TYPES.VILLAGE.id && r.cells.filter(cid => cells[cid].hasNeighborOfType(CELL_TYPES.MOUNTAIN.id)).length == 0).reduce((a,b) => a > b.cells.length ? a : b.cells.length, 0)
    },
    {
        id: 36, 
        type: "Village", 
        name:"Plaines de l'Or Vert", 
        desc: "Gagnez trois étoiles de réputation pour chaque région de villages adjacente à au moins trois types de terrains différents.",
        calc: (cells, cellsPerLine) => getRegions().filter(r => r.type == CELL_TYPES.VILLAGE.id && r.cells.reduce((a,b) => a.concat(cells[b].getNeighborsType()), []).filter((c, index, a) => a.indexOf(c) == index && c != CELL_TYPES.VILLAGE.id).length >= 3).length *3
    },
    {
        id: 37, 
        type: "Village", 
        name:"Remparts", 
        desc: "Gagnez deux étoiles de réputation pour chaque case Village dans la deuxième plus grande régions de villages. En cas d'égalité, ne décomptez qu'une seule des régions concernées.",
        calc: (cells, cellsPerLine) => 2* (getRegions().filter(r => r.type == CELL_TYPES.VILLAGE.id).map(r => r.cells.length).sort((a,b) => b-a)[1] || 0)
    },
 
    {
        id: 38, 
        type: "Plateau",
        name: "Frontières", 
        desc: "Gagnez six étoiles de réputation pour chaque ligne complète et chaque colonne complète de cases remplies.",
        calc: (cells, cellsPerLine) => (cellsPerLine + cells.length/cellsPerLine - cells.filter(c => c.type == CELL_TYPES.EMPTY.id).map(c => [c.id%cellsPerLine +1, -Math.trunc(c.id/cellsPerLine) -1]).flat(1).filter((c, index, a) => a.indexOf(c) == index).length) *6
    },
    {
        id: 39, 
        type: "Plateau", 
        name: "Baronnie Perdue", 
        desc: "Gagnez trois étoiles de réputation pour chaque case constituant l'un des bords du plus grand carré de cases remplies.",
        calc: (cells, cellsPerLine) => 3* Math.max(...cells.map(c => c.type > 0 ? 1:0).map((e, i, a) => {let v = i < cellsPerLine || i%cellsPerLine == 0 ? e : (e > 0 ? 1 + Math.min(a[i-cellsPerLine],a[i-1],a[i-cellsPerLine-1]) : e); a[i]=v; return v;}))
    },
    {
        id: 40, 
        type: "Plateau", 
        name: "Route Brisée", 
        desc: "Gagnez trois étoiles de réputation pour chaque ligne diagonale de cases remplie qui touchent le bord gauche et le bord inférieur du parchemin.",
        calc: (cells, cellsPerLine) => {let completeDiagonals = 0; for(let i = 0; i < cells.length/cellsPerLine; i++) { let j = 0; for (; j < cellsPerLine - i;) {if(cells[i*cellsPerLine+j*cellsPerLine+j].type == CELL_TYPES.EMPTY.id) break; j++} if(j == cellsPerLine - i) completeDiagonals++} return 3* completeDiagonals}
    },
    {
        id: 41, 
        type: "Plateau", 
        name: "Chaudrons", 
        desc: "Gagnez une étoile de réputation pour chaque case vierge entourée de ses quatre côtés par une case remplies ou par le bord du parchemin.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.EMPTY.id && c.isSurrounded()).length
    },
]