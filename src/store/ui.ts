import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  data: any;
  open: string;
  remindVerification: boolean;
  planReminderDismissedFor: string;
};

type Actions = {
  update: (v: Partial<State>) => void;
  close: () => void;
};

const useUIStore = create<State & Actions>()(persist(set => ({
  open: "",
  data: null,
  remindVerification: true,
  planReminderDismissedFor: "",

  update: (val) => set(val),
  close: () => set({ open: "", data: null }),
}),
  {
    name: "ui-store",
    partialize: s => ({ remindVerification: s.remindVerification, planReminderDismissedFor: s.planReminderDismissedFor }),
  }
))

export default useUIStore
