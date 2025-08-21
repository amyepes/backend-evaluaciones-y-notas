import { create } from "zustand";

interface IUser {
  id: number;
  name: string;
  username: string;
  role: string;
  createdAt: string;
}

type Store = {
  user: IUser | null;
  token: string;
  login: (user: IUser, token: string) => void;
  logout: () => void;
};

export const useAppContext = create<Store>((set) => ({
  user: null,
  token: "",
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: "" }),
}));
