import { writable } from 'svelte/store';
import type { Relative } from '$lib/types/types';

export const relativesStore = writable<Relative[]>();
export const selectedRelativeIdStore = writable<string>();
