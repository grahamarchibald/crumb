// Pure derivation functions — the macro + texture engine from the handoff's
// "Domain Logic". Everything is recomputed from (amounts, swapped) per render.

import { AXES, DEFS, Ingredient, MacroSet, RECIPES, Recipe, SWAPS, TexVector } from '../data/defs';

export type Amounts = Record<string, Record<string, number>>;
export type Swapped = Record<string, Record<string, boolean>>;

export function fmt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getRecipe(id: string): Recipe {
  return RECIPES.find((r) => r.id === id)!;
}

// Base ingredient, or with the swap's name/macros/texture substituted when applied.
export function resolveDef(rid: string, ingId: string, swapped: Swapped): Ingredient {
  const base = DEFS[ingId];
  if (swapped[rid]?.[ingId] && SWAPS[ingId]) {
    const s = SWAPS[ingId];
    return { ...base, name: s.name, per100: s.per100, tex: s.tex };
  }
  return base;
}

// Recipe totals: Σ per100 · grams/100. Per-serving = total / servings.
export function macros(rid: string, amounts: Amounts, swapped: Swapped): MacroSet {
  const r = getRecipe(rid);
  const t: MacroSet = { cal: 0, p: 0, c: 0, f: 0 };
  for (const [ingId] of r.ings) {
    const a = amounts[rid][ingId];
    const d = resolveDef(rid, ingId, swapped);
    const k = a / 100;
    t.cal += d.per100.cal * k;
    t.p += d.per100.p * k;
    t.c += d.per100.c * k;
    t.f += d.per100.f * k;
  }
  return t;
}

// Per axis: clamp(round(50 + 58 · Σ(grams·coef)/Σgrams), 4, 100)
export function texture(rid: string, amounts: Amounts, swapped: Swapped): TexVector {
  const r = getRecipe(rid);
  let mass = 0;
  const ax: TexVector = { chewy: 0, soft: 0, airy: 0, dense: 0 };
  for (const [ingId] of r.ings) {
    const a = amounts[rid][ingId];
    const d = resolveDef(rid, ingId, swapped);
    mass += a;
    for (const k of Object.keys(ax) as (keyof TexVector)[]) ax[k] += a * d.tex[k];
  }
  const out = {} as TexVector;
  for (const k of Object.keys(ax) as (keyof TexVector)[]) {
    const norm = mass ? ax[k] / mass : 0;
    out[k] = Math.max(4, Math.min(100, Math.round(50 + 58 * norm)));
  }
  return out;
}

// Axis with the largest |coefficient| → "adds <axis>" / "reduces <axis>"
export function domTex(def: Ingredient): string {
  let best = null as (typeof AXES)[number] | null;
  let bv = 0;
  for (const ax of AXES) {
    if (Math.abs(def.tex[ax.key]) > Math.abs(bv)) {
      bv = def.tex[ax.key];
      best = ax;
    }
  }
  return best ? (bv >= 0 ? 'adds ' : 'reduces ') + best.name.toLowerCase() : '';
}
