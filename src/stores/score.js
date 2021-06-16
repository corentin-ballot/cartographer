import { writable, get } from 'svelte/store'
import { rules } from '../utils/rules';
import { cells, cellsPerLine, CELL_TYPES } from './board';

export const season = writable(JSON.parse(localStorage.getItem("season")) >= 0 ? JSON.parse(localStorage.getItem("season")) : -99);
season.subscribe(val => localStorage.setItem("season", JSON.stringify(val)));

export const coins = writable(JSON.parse(localStorage.getItem("coins")) || 0);
coins.subscribe(val => localStorage.setItem("coins", JSON.stringify(val)));

export const scoring = writable(JSON.parse(localStorage.getItem("scoring")) || []);
scoring.subscribe(val => localStorage.setItem("scoring", JSON.stringify(val)));

const initialSeasons = [
    {name: "Printemps", score: {r1: 0, r2: 0, coins: 0, monsters: 0, total: 0}},
    {name: "Été", score: {r1: 0, r2: 0, coins: 0, monsters: 0, total: 0}},
    {name: "Automne", score: {r1: 0, r2: 0, coins: 0, monsters: 0, total: 0}},
    {name: "Hiver", score: {r1: 0, r2: 0, coins: 0, monsters: 0, total: 0}},
]

export const seasons = writable(JSON.parse(localStorage.getItem("seasons")) || initialSeasons);
seasons.subscribe(val => localStorage.setItem("seasons", JSON.stringify(val)));

export const nextSeason = () => {
    let r1 = rules.find(r => r.id == get(scoring)[get(season) % get(seasons).length]).calc(get(cells),get(cellsPerLine));
    let r2 = rules.find(r => r.id == get(scoring)[(get(season)+1) % get(seasons).length]).calc(get(cells),get(cellsPerLine));
    let monsters = get(cells).filter(c => c.type == CELL_TYPES.MONSTER.id).map(c => c.getNeighborsOfType(CELL_TYPES.EMPTY.id)).reduce((a,b) => a.concat(b),[]).filter((e,i,a) => a.indexOf(e) == i).length;
    seasons.update(ss => ss.map((s,i) => get(season) == i ? {...s, score: {r1, r2, coins: get(coins), monsters, total: r1+r2+get(coins)-monsters}} : s))

    season.update(n => n < 3 ? n + 1 : -99);
}