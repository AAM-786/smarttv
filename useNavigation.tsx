import { useEffect, useRef, useState } from "react";

export function useNavigation() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const focusableElements = useRef<Element[]>([]);

  useEffect(() => {
    const updateFocusableElements = () => {
      focusableElements.current = Array.from(
        document.querySelectorAll('.tv-focus:not([disabled])')
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      updateFocusableElements();
      const elements = focusableElements.current;
      
      if (elements.length === 0) return;

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          setFocusedIndex(prev => {
            const newIndex = prev > 0 ? prev - 1 : elements.length - 1;
            elements[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (elements[newIndex] as HTMLElement)?.focus();
            return newIndex;
          });
          break;

        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          setFocusedIndex(prev => {
            const newIndex = prev < elements.length - 1 ? prev + 1 : 0;
            elements[newIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (elements[newIndex] as HTMLElement)?.focus();
            return newIndex;
          });
          break;

        case 'Enter':
          event.preventDefault();
          (elements[focusedIndex] as HTMLElement)?.click();
          break;

        case 'Escape':
          event.preventDefault();
          document.body.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    updateFocusableElements();

    // Focus first element on mount
    if (focusableElements.current.length > 0) {
      (focusableElements.current[0] as HTMLElement)?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [focusedIndex]);

  return { focusedIndex };
}
