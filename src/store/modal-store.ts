import { create } from "zustand";

type CloseFn = () => void;
type ChildrenGetter = (close: CloseFn) => JSX.Element;

interface ModalsState {
  openModal: (getChildren: ChildrenGetter) => void;
  show: boolean;
  children: JSX.Element | null;
  useClose: () => CloseFn;
}

export const useModalsStore = create<ModalsState>()((set, get) => ({
  children: null,
  show: false,
  openModal(getChildren) {
    function close() {
      set((prev) => ({ ...prev, children: null, show: false }));
    }
    let children = getChildren(close);
    set((prev) => ({ ...prev, children, show: true }));
  },
  useClose() {
    return function () {
      set((prev) => ({ ...prev, children: null, show: false }));
    };
  },
}));
