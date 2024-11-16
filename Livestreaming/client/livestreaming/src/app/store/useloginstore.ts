// // useLoginStore.ts
import { create } from "zustand";

interface LoginStore {
  formData: {
    email: string;
    password: string;
  };
  loading: boolean;
  setFormData: (data: Partial<LoginStore["formData"]>) => void;
  setLoading: (loading: boolean) => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
  formData: {
    email: "",
    password: "",
  },
  loading: false,
  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  setLoading: (loading) => set({ loading }),
}));
