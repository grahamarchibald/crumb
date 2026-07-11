import { create } from 'zustand';
import { RECIPES } from '../data/defs';
import { Amounts, Swapped } from '../domain/engine';

type Screen = 'library' | 'builder';

type Store = {
  screen: Screen;
  activeId: string | null;
  filter: string;
  amounts: Amounts;
  swapped: Swapped;
  open: string | null;

  openRecipe: (id: string) => void;
  back: () => void;
  setFilter: (f: string) => void;
  setAmt: (rid: string, ingId: string, delta: number) => void;
  toggleSwap: (rid: string, ingId: string) => void;
  openIng: (ingId: string) => void;
  closeSheet: () => void;
};

const seedAmounts: Amounts = {};
const seedSwapped: Swapped = {};
for (const r of RECIPES) {
  seedAmounts[r.id] = {};
  seedSwapped[r.id] = {};
  for (const [id, g] of r.ings) seedAmounts[r.id][id] = g;
}

export const useStore = create<Store>((set) => ({
  screen: 'library',
  activeId: null,
  filter: 'All',
  amounts: seedAmounts,
  swapped: seedSwapped,
  open: null,

  openRecipe: (id) => set({ screen: 'builder', activeId: id, open: null }),
  back: () => set({ screen: 'library', open: null }),
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
  openIng: (ingId) => set({ open: ingId }),
  closeSheet: () => set({ open: null }),
}));
