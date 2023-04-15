import { useModalsStore } from "../store/modal-store";
import { useClickOutside } from "@mantine/hooks";

function Modal() {
  const children = useModalsStore((s) => s.children);
  const show = useModalsStore((s) => s.show);
  const useClose = useModalsStore((s) => s.useClose);
  const close = useClose();
  let ref = useClickOutside(() => close());
  return (
    <>
      {show && (
        <>
          <div className="absolute left-0 top-0 z-10 h-full w-full bg-slate-800/60" />
          <div className="absolute left-0 top-0 z-10 h-full w-full">
            <div className="flex h-full w-full items-center justify-center">
              <div
                className="flex max-w-[80%] -translate-y-8 flex-col gap-2 rounded-2xl bg-white p-4"
                ref={ref}
              >
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Modal;
