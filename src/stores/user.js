import { writable } from "svelte/store";

export const username = writable(localStorage.username);

username.subscribe((currentValue) => {
    if(currentValue) localStorage.username = currentValue;
})
