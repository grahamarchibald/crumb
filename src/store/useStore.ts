import { create } from 'zustand';
import { RECIPES } from '../data/defs';
import { Amounts, Swapped } from '../domain/engine';

type Screen = 'library' | 'builder';

// Default gram amount seeded for a freshly added ingredient.
export const DEFAULT_ADD_GRAMS = 50;

type Store = {
  screen: Screen;
  activeId: string | null;
  filter: string;
  ings: Record<string, string[]>; // mutable ordered ingredient list per recipe
  amounts: Amounts;
  swapped: Swapped;
  open: string | null;
  adding: boolean; // is the add-ingredient picker open

  openRecipe: (id: string) => void;
  back: () => void;
  setFilter: (f: string) => void;
  setAmt: (rid: string, ingId: string, delta: number) => void;
  toggleSwap: (rid: string, ingId: string) => void;
  openIng: (ingId: string) => void;
  closeSheet: () => void;
  openAdd: () => void;
  closeAdd: () => void;
  addIngredient: (rid: string, ingId: string) => void;
  removeIngredient: (rid: string, ingId: string) => void;
};

const seedIngs: Record<string, string[]> = {};
const seedAmounts: Amounts = {};
const seedSwapped: Swapped = {};
for (const r of RECIPES) {
  seedIngs[r.id] = r.ings.map(([id]) => id);
  seedAmounts[r.id] = {};
  seedSwapped[r.id] = {};
  for (const [id, g] of r.ings) seedAmounts[r.id][id] = g;
}

export const useStore = create<Store>((set) => ({
  screen: 'library',
  activeId: null,
  filter: 'All',
  ings: seedIngs,
  amounts: seedAmounts,
  swapped: seedSwapped,
  open: null,
  adding: false,

  openRecipe: (id) => set({ screen: 'builder', activeId: id, open: null, adding: false }),
  back: () => set({ screen: 'library', open: null, adding: false }),
  setFilter: (filter) => set({ filter }),
  setAmt: (rid, ingId, delta) =>
    set((s) => ({
      amounts: {
        ...s.amounts,
        [rid]: { ...s.amounts[rid], [ingId]: Math.max(0, s.amounts[rid][ingId] + delta) },
      },
    })),
  toggleSwap: (rid, ingId) =>
    set((s) => ({
      swapped: {
        ...s.swapped,
        [rid]: { ...s.swapped[rid], [ingId]: !s.swapped[rid][ingId] },
      },
    })),
  openIng: (ingId) => set({ open: ingId, adding: false }),
  closeSheet: () => set({ open: null }),
  openAdd: () => set({ adding: true, open: null }),
  closeAdd: () => set({ adding: false }),
  addIngredient: (rid, ingId) =>
    set((s) => {
      if (s.ings[rid].includes(ingId)) return { adding: false, open: ingId };
      return {
        ings: { ...s.ings, [rid]: [...s.ings[rid], ingId] },
        amounts: {
          ...s.amounts,
          [rid]: { ...s.amounts[rid], [ingId]: s.amounts[rid][ingId] ?? DEFAULT_ADD_GRAMS },
        },
        adding: false,
        open: ingId, // jump straight to the new ingredient's sheet to tune it
      };
    }),
  removeIngredient: (rid, ingId) =>
    set((s) => ({
      ings: { ...s.ings, [rid]: s.ings[rid].filter((x) => x !== ingId) },
      open: s.open === ingId ? null : s.open,
    })),
}));
