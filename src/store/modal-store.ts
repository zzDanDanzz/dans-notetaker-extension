import { create } from "zustand";

type CloseFn = () => void;
type UserWillCallThis = (close: CloseFn) => JSX.Element;

interface ModalsState {
  openModal: (fn: UserWillCallThis) => void;
  show: boolean;
  children: JSX.Element | null;
  useClose: () => CloseFn;
}

export const useModalsStore = create<ModalsState>()((set, get) => ({
  children: null,
  show: false,
  openModal(userWillCallThis) {
    function close() {
      set((prev) => ({ ...prev, children: null, show: false }));
    }
    let children = userWillCallThis(close);
    set((prev) => ({ ...prev, children, show: true }));
  },
  useClose() {
    return function () {
      set((prev) => ({ ...prev, children: null, show: false }));
    };
  },
}));
