import { create } from "zustand";

interface RegisterFormData {
  // Renamed from FormData to RegisterFormData
  username: string;
  email: string;
  password: string;
}

interface Store {
  formData: RegisterFormData;
  setFormData: (data: Partial<RegisterFormData>) => void;
  resetForm: () => void;
}

export const registerstore = create<Store>((set) => ({
  formData: {
    username: "",
    email: "",
    password: "",
  },
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  resetForm: () =>
    set({
      formData: {
        username: "",
        email: "",
        password: "",
      },
    }),
}));
