// Domain data extracted from the handoff (`Crumb App.dc.html` — DEFS/SWAPS/RECIPES).
// In production this would come from a DB/API rather than hardcoded tables.

export type MacroSet = { cal: number; p: number; c: number; f: number };
export type TexVector = { chewy: number; soft: number; airy: number; dense: number };
export type AxisKey = keyof TexVector;
export type Axis = { key: AxisKey; name: string; color: string };

export type Ingredient = {
  name: string;
  per100: MacroSet;
  tex: TexVector;
  dot: string;
};

export type Swap = {
  name: string;
  per100: MacroSet;
  tex: TexVector;
  note: string;
};

export type Recipe = {
  id: string;
  name: string;
  tag: string;
  unit: string;
  servings: number;
  ings: [string, number][];
};

export const AXES: Axis[] = [
  { key: 'chewy', name: 'Chewy', color: '#B08033' },
  { key: 'soft', name: 'Soft', color: '#6B8E5A' },
  { key: 'airy', name: 'Airy', color: '#9FBE86' },
  { key: 'dense', name: 'Dense', color: '#8A7355' },
];

export const MACROCOL = { p: '#6B8E5A', c: '#C9A86A', f: '#C77B54' } as const;

export const THUMB: Record<string, { bg: string; ink: string }> = {
  Cookies: { bg: '#EFE3CE', ink: '#B08033' },
  Muffins: { bg: '#E6EEDD', ink: '#6B8E5A' },
  Breads: { bg: '#F0E4D3', ink: '#B5722F' },
  Brownies: { bg: '#E4D8CD', ink: '#6B4A2F' },
};

export const DEFS: Record<string, Ingredient> = {
  oats:         { name: 'Rolled oats',       per100: { cal: 389, p: 16.9, c: 66.3, f: 6.9 },  tex: { chewy: 0.9, soft: -0.2, airy: -0.3, dense: 0.6 },  dot: '#C9A86A' },
  oatFlour:     { name: 'Oat flour',         per100: { cal: 404, p: 15,   c: 66,   f: 9 },    tex: { chewy: 0.6, soft: -0.1, airy: -0.2, dense: 0.5 },  dot: '#D8C08A' },
  wwFlour:      { name: 'Whole wheat flour', per100: { cal: 340, p: 13.2, c: 72,   f: 2.5 },  tex: { chewy: 0.5, soft: -0.2, airy: 0.1, dense: 0.6 },   dot: '#B79A6A' },
  almond:       { name: 'Almond flour',      per100: { cal: 571, p: 21.4, c: 21.4, f: 50 },   tex: { chewy: -0.3, soft: 0.5, airy: -0.2, dense: 0.7 },  dot: '#B8895A' },
  banana:       { name: 'Mashed banana',     per100: { cal: 89,  p: 1.1,  c: 22.8, f: 0.3 },  tex: { chewy: 0.1, soft: 0.9, airy: -0.1, dense: 0.5 },   dot: '#D8C56A' },
  yogurt:       { name: 'Greek yogurt',      per100: { cal: 59,  p: 10.2, c: 3.6,  f: 0.4 },  tex: { chewy: -0.2, soft: 0.8, airy: 0.3, dense: -0.1 },  dot: '#E9E0CB' },
  honey:        { name: 'Honey',             per100: { cal: 304, p: 0.3,  c: 82.4, f: 0 },    tex: { chewy: 0.7, soft: 0.2, airy: -0.2, dense: 0.4 },   dot: '#C9932E' },
  maple:        { name: 'Maple syrup',       per100: { cal: 260, p: 0,    c: 67,   f: 0.1 },  tex: { chewy: 0.6, soft: 0.3, airy: -0.1, dense: 0.3 },   dot: '#B5722F' },
  egg:          { name: 'Whole egg',         per100: { cal: 143, p: 12.6, c: 0.7,  f: 9.5 },  tex: { chewy: 0.2, soft: 0.1, airy: 0.7, dense: -0.2 },   dot: '#E7B84B' },
  choc:         { name: 'Dark choc chips',   per100: { cal: 480, p: 4.9,  c: 60,   f: 30 },   tex: { chewy: 0.1, soft: 0, airy: -0.3, dense: 0.8 },     dot: '#4A3520' },
  coconut:      { name: 'Coconut oil',       per100: { cal: 862, p: 0,    c: 0,    f: 100 },  tex: { chewy: -0.6, soft: 0.9, airy: 0.1, dense: 0.2 },   dot: '#EFE7D6' },
  soda:         { name: 'Baking soda',       per100: { cal: 0,   p: 0,    c: 0,    f: 0 },    tex: { chewy: -0.2, soft: 0.2, airy: 1.0, dense: -0.8 },  dot: '#DCD6C6' },
  bakingPowder: { name: 'Baking powder',     per100: { cal: 53,  p: 0,    c: 28,   f: 0 },    tex: { chewy: -0.2, soft: 0.2, airy: 1.0, dense: -0.7 },  dot: '#D6D0C0' },
  pb:           { name: 'Peanut butter',     per100: { cal: 588, p: 25,   c: 20,   f: 50 },   tex: { chewy: 0.5, soft: 0.3, airy: -0.2, dense: 0.6 },   dot: '#C08A4E' },
  blueberry:    { name: 'Blueberries',       per100: { cal: 57,  p: 0.7,  c: 14,   f: 0.3 },  tex: { chewy: -0.1, soft: 0.7, airy: 0, dense: 0.2 },     dot: '#5A6B8C' },
  pumpkin:      { name: 'Pumpkin puree',     per100: { cal: 34,  p: 1.1,  c: 8,    f: 0.3 },  tex: { chewy: -0.1, soft: 0.8, airy: 0.1, dense: 0.3 },   dot: '#C97B3A' },
  zucchini:     { name: 'Grated zucchini',   per100: { cal: 17,  p: 1.2,  c: 3.1,  f: 0.3 },  tex: { chewy: -0.2, soft: 0.9, airy: 0.1, dense: 0.1 },   dot: '#7F9A5A' },
  cocoa:        { name: 'Cocoa powder',      per100: { cal: 228, p: 19.6, c: 57.9, f: 13.7 }, tex: { chewy: 0.2, soft: -0.1, airy: -0.2, dense: 0.7 },  dot: '#6B4A2F' },
  protein:      { name: 'Vanilla protein',   per100: { cal: 375, p: 75,   c: 12,   f: 6 },    tex: { chewy: 0.3, soft: -0.3, airy: -0.1, dense: 0.6 },  dot: '#E6D9C0' },
};

export const SWAPS: Record<string, Swap> = {
  coconut: {
    name: 'Applesauce',
    per100: { cal: 42, p: 0.2, c: 11.3, f: 0.1 },
    tex: { chewy: -0.1, soft: 0.9, airy: 0.1, dense: 0.3 },
    note: 'Cuts almost all the fat and adds moisture — expect a softer, more cake-like crumb.',
  },
  almond: {
    name: 'Oat flour',
    per100: { cal: 404, p: 15, c: 66, f: 9 },
    tex: { chewy: 0.6, soft: -0.1, airy: -0.2, dense: 0.5 },
    note: 'Much lower in fat and cheaper — trades a little tenderness for a heartier chew.',
  },
  pb: {
    name: 'Powdered PB',
    per100: { cal: 400, p: 50, c: 30, f: 13 },
    tex: { chewy: 0.4, soft: 0.1, airy: -0.2, dense: 0.6 },
    note: 'Keeps the peanut flavor and most of the protein while cutting the majority of the fat.',
  },
};

export const RECIPES: Recipe[] = [
  { id: 'cookies',   name: 'Banana-oat chocolate chip cookies',  tag: 'Cookies',  unit: 'cookie', servings: 12, ings: [['oats', 120], ['almond', 80], ['banana', 100], ['yogurt', 90], ['honey', 45], ['egg', 50], ['choc', 50], ['coconut', 25], ['soda', 4]] },
  { id: 'muffins',   name: 'Blueberry protein muffins',          tag: 'Muffins',  unit: 'muffin', servings: 10, ings: [['oatFlour', 130], ['protein', 60], ['banana', 120], ['yogurt', 100], ['maple', 50], ['egg', 100], ['blueberry', 120], ['coconut', 20], ['bakingPowder', 6]] },
  { id: 'bread',     name: 'Pumpkin spice oat bread',            tag: 'Breads',   unit: 'slice',  servings: 12, ings: [['oats', 150], ['wwFlour', 120], ['pumpkin', 200], ['maple', 70], ['egg', 100], ['coconut', 30], ['soda', 5]] },
  { id: 'pbcookies', name: 'Peanut butter protein cookies',      tag: 'Cookies',  unit: 'cookie', servings: 14, ings: [['oatFlour', 100], ['pb', 120], ['protein', 40], ['maple', 50], ['egg', 50], ['choc', 40], ['soda', 3]] },
  { id: 'brownies',  name: 'Double chocolate zucchini brownies', tag: 'Brownies', unit: 'square', servings: 16, ings: [['wwFlour', 110], ['cocoa', 60], ['zucchini', 200], ['maple', 80], ['egg', 100], ['choc', 70], ['coconut', 25], ['soda', 4]] },
];

export const FILTERS = ['All', 'Cookies', 'Muffins', 'Breads', 'Brownies'];
