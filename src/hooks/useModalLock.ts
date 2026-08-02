import { useEffect } from 'react';

/**
 * Locks the body scroll whenever `isOpen` is true and restores it on close/unmount.
 * Also prevents layout shift by measuring the scrollbar width and compensating.
 */
export function useModalLock(isOpen: boolean): void {
  useEffect(() => {
    if (!isOpen) return;

    // Measure actual scrollbar width so the layout doesn't shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');

    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, [isOpen]);
}
