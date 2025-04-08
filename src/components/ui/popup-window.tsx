
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PopupWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  hideCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top' | 'bottom';
  maxHeight?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-2xl',
};

export function PopupWindow({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  contentClassName,
  hideCloseButton = false,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  size = 'full',
  position = 'center',
  maxHeight,
}: PopupWindowProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnEscape, isOpen, onClose]);
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === overlayRef.current) {
      onClose();
    }
  };
  
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return {
          initial: { opacity: 0, y: -20, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -20, scale: 0.96 },
          containerClass: 'items-start pt-16'
        };
      case 'bottom':
        return {
          initial: { opacity: 0, y: 20, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 20, scale: 0.96 },
          containerClass: 'items-end pb-16'
        };
      default: // center
        return {
          initial: { opacity: 0, y: 10, scale: 0.96 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 10, scale: 0.96 },
          containerClass: 'items-center'
        };
    }
  };
  
  const positionClasses = getPositionClasses();
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className={`popup-overlay flex justify-center ${positionClasses.containerClass}`}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={cn(`popup-window ${sizeClasses[size]}`, className)}
            initial={positionClasses.initial}
            animate={positionClasses.animate}
            exit={positionClasses.exit}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.3 
            }}
          >
            <div className="popup-header">
              <h2 className="popup-title">{title}</h2>
              {!hideCloseButton && (
                <button 
                  className="popup-close-btn"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div 
              className={cn("popup-content", contentClassName)}
              style={{ maxHeight: maxHeight }}
            >
              {children}
            </div>
            
            {footer && (
              <div className="popup-footer">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
