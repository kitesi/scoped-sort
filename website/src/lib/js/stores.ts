import { writable } from 'svelte/store';

export const isSidebarOpen = writable(false);
export const errors = writable([] as string[]);
