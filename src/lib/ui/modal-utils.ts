import { useEffect, type RefObject } from 'react';

let lockCount = 0;
let previousBodyOverflow = '';

export function useModalBodyLock(open: boolean): void {
  useEffect(() => {
    if (!open) return;

    if (lockCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount++;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }
    };
  }, [open]);
}

export function usePreventNumberInputWheel(
  containerRef: RefObject<HTMLElement | null>,
  open: boolean,
): void {
  useEffect(() => {
    if (!open || !containerRef.current) return;

    const container = containerRef.current;

    function onWheel(event: WheelEvent) {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.type === 'number') {
        event.preventDefault();
      }
    }

    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [open, containerRef]);
}
