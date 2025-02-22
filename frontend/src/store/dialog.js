import { create } from "zustand";

export const useDialogStore = create(
  (set) => ({
    isLoginOpen: false,
    openChange: () => set((state)=> ({isLoginOpen: !(state.isLoginOpen)})),
    openLogin: () => set((state)=> ({isLoginOpen: true})),
    closeLogin: () => set(() => ({isLoginOpen: false}))
  }));