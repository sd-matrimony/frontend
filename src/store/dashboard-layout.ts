import { create } from "zustand";
import { persist } from "zustand/middleware";

export const GRID_COLS = 12;
export const MIN_COL_SPAN = 4;
export const MIN_HEIGHT = 220;
export const MAX_HEIGHT = 900;
export const DEFAULT_HEIGHT = 420;

export type LayoutItem = {
  id: string;
  width: number;
  height: number;
};

type Row = { item: LayoutItem; index: number }[];

function computeRows(items: LayoutItem[]): Row[] {
  const rows: Row[] = [];
  let current: Row = [];
  let used = 0;

  items.forEach((item, index) => {
    if (used + item.width > GRID_COLS && current.length) {
      rows.push(current);
      current = [];
      used = 0;
    }
    current.push({ item, index });
    used += item.width;
  });

  if (current.length) rows.push(current);
  return rows;
}

type State = {
  items: LayoutItem[];
};

type Actions = {
  init: (defaults: LayoutItem[]) => void;
  setItems: (items: LayoutItem[]) => void;
  resize: (id: string, width: number) => void;
  resizeHeight: (id: string, height: number) => void;
  reset: (defaults: LayoutItem[]) => void;
};

const useDashboardLayoutStore = create<State & Actions>()(persist(
  (set, get) => ({
    items: [],

    init: (defaults) => {
      if (get().items.length) return;
      set({ items: defaults });
    },

    setItems: (items) => set({ items }),

    resize: (id, width) => {
      const items = get().items.map(i => ({ ...i }));
      const clamped = Math.max(MIN_COL_SPAN, Math.min(GRID_COLS, width));

      const target = items.find(i => i.id === id);
      if (!target) return;

      const rows = computeRows(items);
      const row = rows.find(r => r.some(r => r.item.id === id));
      if (!row) return;

      const idxInRow = row.findIndex(r => r.item.id === id);
      let delta = clamped - target.width;
      target.width = clamped;

      if (delta > 0) {
        for (let i = idxInRow + 1; i < row.length && delta > 0; i++) {
          const sibling = row[i].item;
          const shrinkable = sibling.width - MIN_COL_SPAN;
          if (shrinkable <= 0) continue;
          const take = Math.min(shrinkable, delta);
          sibling.width -= take;
          delta -= take;
        }
      }

      set({ items });
    },

    resizeHeight: (id, height) => {
      const clamped = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height));
      set({
        items: get().items.map(i => (i.id === id ? { ...i, height: clamped } : i)),
      });
    },

    reset: (defaults) => set({ items: defaults }),
  }),
  {
    name: "super-admin-dashboard-layout",
  },
));

export { computeRows };
export default useDashboardLayoutStore;
