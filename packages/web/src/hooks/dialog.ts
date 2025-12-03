import { useRef, useState } from "react";

/**
 * Inspiration from this discussion
 * https://github.com/radix-ui/primitives/issues/1836#issuecomment-2051812652
 * */
export function useDialog<TriggerElement extends HTMLElement = HTMLButtonElement>() {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<TriggerElement|null>(null);
    
    function open() {
      setIsOpen(true);
    }
  
    function close() {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  
    return {
      triggerProps: {
        ref: triggerRef,
        onClick: open,
      },
      dialogProps: {
        open: isOpen,
        onOpenChange: (value: boolean) => {
          if (value) open();
          else close();
        },
      },
      open,
      close,
    };
  }