import { create } from "zustand";

interface LoginDialogState {
  isOpen: boolean;
  message: string | null;
  open: (message?: string) => void;
  close: () => void;
}

export const useLoginDialog = create<LoginDialogState>((set) => ({
  isOpen: false,
  message: null,
  open: (message) => set({ isOpen: true, message: message || null }),
  close: () => set({ isOpen: false, message: null }),
}));
