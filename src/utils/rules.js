import { CELL_TYPES } from "./cells";

export const rules = [   
    {
        id: 26, 
        type: "forest", 
        name: "Bois de la Sentinelle", 
        desc: "Gagnez une étoile de réputation pour chaque case Forêt adjacente au bord du parchemin.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id && (c.id % cellsPerLine == 0 || c.id < cellsPerLine || c.id % cellsPerLine == cellsPerLine - 1 || c.id >= cells.length - cellsPerLine)).length
    },
    {
        id: 27, 
        type: "forest", 
        name: "Chemin Verdoyant", 
        desc: "Gagnez une étoile de réputation pour chaque ligne ou colonne ayant au moins une case Forêt. La même case Forêt peut être décomptée à la fois pour une ligne et pour une colonne.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id).map(c => [c.id%cellsPerLine +1, -Math.trunc(c.id/cellsPerLine) -1]).flat(1).filter((c, index, a) => a.indexOf(c) == index).length
    },
    {
        id: 28, 
        type: "forest", 
        name: "Arbres-Vigies", 
        desc: "Gagnez une étoile de réputation pour chaque case Forêt entourée sur ses quatres côtés par une case remplies ou par le bord du parchemin.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.FOREST.id && (c.id < cellsPerLine || cells[c.id - cellsPerLine].type != CELL_TYPES.EMPTY.id) && (c.id > cells.length - cellsPerLine || cells[c.id + cellsPerLine].type != CELL_TYPES.EMPTY.id) && (c.id % cellsPerLine == 0 || cells[c.id -1].type != CELL_TYPES.EMPTY.id) && (c.id % cellsPerLine == cellsPerLine -1 || cells[c.id +1].type != CELL_TYPES.EMPTY.id)).length
    },
    {
        id: 29, 
        type: "forest", 
        name: "Forêt des Hauts Plateaux", 
        desc: "Gagnez trois étoiles de réputation pour chaque case Montagne connectées à une autre case Montagne par une région de Forêts.",
    },

    {
        id: 30, 
        type: "field-sea", 
        name: "Cannaux d'Irrigation", 
        desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à au moins une Ferme. Gagnez une étoile de réputation pour chaque case Ferme adjacente à au moins une case Lac.",
        calc: (cells, cellsPerLine) => cells.filter(c => (c.type == CELL_TYPES.SEA.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].type == CELL_TYPES.FIELD.id) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].type == CELL_TYPES.FIELD.id) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].type == CELL_TYPES.FIELD.id) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].type == CELL_TYPES.FIELD.id))) || (c.type == CELL_TYPES.FIELD.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].type == CELL_TYPES.SEA.id) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].type == CELL_TYPES.SEA.id) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].type == CELL_TYPES.SEA.id) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].type == CELL_TYPES.SEA.id)))).length
    },
    {
        id: 31, 
        type: "field-sea", 
        name: "Vallée des Mages", 
        desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à une case Montagne. Gagnez une étoile de réputation pour chaque case Ferme adjacente à une case à une case Montagne.",
        calc: (cells, cellsPerLine) => cells.filter(c => (c.type == CELL_TYPES.SEA.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].type == CELL_TYPES.MOUNTAIN.id) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].type == CELL_TYPES.MOUNTAIN.id) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].type == CELL_TYPES.MOUNTAIN.id) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].type == CELL_TYPES.MOUNTAIN.id))) || (c.type == CELL_TYPES.FIELD.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].type == CELL_TYPES.MOUNTAIN.id) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].type == CELL_TYPES.MOUNTAIN.id) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].type == CELL_TYPES.MOUNTAIN.id) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].type == CELL_TYPES.MOUNTAIN.id)))).length
    },
    {
        id: 32, 
        type: "field-sea", 
        name: "Grenier Doré", 
        desc: "Gagnez une étoile de réputation pour chaque case Lac adjacente à une case Ruines. Gagnez trois étoiles de réputation pour chaque case Ferme sur une case Ruines.",
        calc: (cells, cellsPerLine) => cells.filter(c => (c.type == CELL_TYPES.SEA.id && ((c.id < cellsPerLine ? false : cells[c.id - cellsPerLine].isRuins) || (c.id > cells.length - cellsPerLine ? false : cells[c.id + cellsPerLine].isRuins) || (c.id % cellsPerLine == 0 ? false : cells[c.id -1].isRuins) || (c.id % cellsPerLine == cellsPerLine -1 ? false : cells[c.id +1].isRuins)))).length + cells.filter(c => c.type == CELL_TYPES.FIELD.id && cells[c.id].isRuins).length*3
    },
    {
        id: 33, 
        type: "field-sea", 
        name: "Montée des Eaux", 
        desc: "Gagnez trois étoiles de réputation pour chaque région de Ferme qui n'est adjacente ni à une case Lac ni au bord du parchemin. Gagnez trois étoiles de réputation pour chaque région de Lacs qui n'est adjacente ni à une case Ferme ni au bord du parchemin."
    },

    {
        id: 34, 
        type: "village", 
        name:"Places Fortes", 
        desc: "Gagnez huit étoiles de réputationpour chaque région de six Villages ou plus."
    },
    {
        id: 35, 
        type: "village", 
        name:"Grande Cité", 
        desc: "Gagnez une étoile de réputation pour chaque case Village dans la plus grande région de Village qui n'est pas adjacente à une case montagne."
    },
    {
        id: 36, 
        type: "village", 
        name:"Plaines de l'Or Vert", 
        desc: "Gagnez trois étoiles de réputation pour chaque région de villages adjacente à au moins trois types de terrains différents."
    },
    {
        id: 37, 
        type: "village", 
        name:"Remparts", 
        desc: "Gagnez deux étoiles de réputation pour chaque case Village dans la deuxième plus grande régions de villages. En cas d'égalité, ne décomptez qu'une seule des régions concernées."
    },
 
    {
        id: 38, 
        type: "board",
        name: "Frontières", 
        desc: "Gagnez six étoiles de réputation pour chaque ligne complète et chaque colonne complète de cases remplies.",
        calc: (cells, cellsPerLine) => (cellsPerLine + cells.length/cellsPerLine - cells.filter(c => c.type == CELL_TYPES.EMPTY.id).map(c => [c.id%cellsPerLine +1, -Math.trunc(c.id/cellsPerLine) -1]).flat(1).filter((c, index, a) => a.indexOf(c) == index).length) *6
    },
    {
        id: 39, 
        type: "board", 
        name: "Baronnie Perdue", 
        desc: "Gagnez trois étoiles de réputation pour chaque case constituant l'un des bords du plus grand carré ce cases remplies."
    },
    {
        id: 40, 
        type: "board", 
        name: "Route Brisée", 
        desc: "Gagnez trois étoiles de réputation pour chaque ligne diagonale de cases remplie qui touchent le bord gauche et le bord inférieur du parchemin."
    },
    {
        id: 41, 
        type: "board", 
        name: "Chaudrons", 
        desc: "Gagnez une étoile de réputation pour chaque case vierge entourée de ses quatre côtés par une case remplies ou par le bord du parchemin.",
        calc: (cells, cellsPerLine) => cells.filter(c => c.type == CELL_TYPES.EMPTY.id && (c.id < cellsPerLine || cells[c.id - cellsPerLine].type != CELL_TYPES.EMPTY.id) && (c.id > cells.length - cellsPerLine || cells[c.id + cellsPerLine].type != CELL_TYPES.EMPTY.id) && (c.id % cellsPerLine == 0 || cells[c.id -1].type != CELL_TYPES.EMPTY.id) && (c.id % cellsPerLine == cellsPerLine -1 || cells[c.id +1].type != CELL_TYPES.EMPTY.id)).length
    },
]