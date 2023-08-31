import { writable } from 'svelte/store';
import type { Relative } from '../../routes/+page.server';

export const relativesStore = writable<Relative[]>();
export const selectedRelativeIdStore = writable<string>();
