'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

import { Button, type ButtonProps } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

type LogoutButtonProps = Omit<ButtonProps, 'onClick'> & {
  confirmTitle?: string;
  confirmMessage?: string;
};

export function LogoutButton({
  children = 'Log out',
  variant = 'outline',
  confirmTitle = 'Sign out?',
  confirmMessage = 'You will need to log in again to access your dashboard.',
  ...buttonProps
}: LogoutButtonProps) {
  const animationDuration = 200;
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    []
  );

  const openDialog = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsMounted(true);
    requestAnimationFrame(() => setIsVisible(true));
  };

  const hideDialog = (onHidden?: () => void) => {
    setIsVisible(false);
    closeTimerRef.current = window.setTimeout(() => {
      setIsMounted(false);
      closeTimerRef.current = null;
      onHidden?.();
    }, animationDuration);
  };

  const handleConfirm = () => {
    hideDialog(() => {
      logout();
      router.replace('/login');
    });
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      hideDialog();
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        onClick={openDialog}
        {...buttonProps}
      >
        {children}
      </Button>

      {isMounted && typeof document !== 'undefined'
        ? createPortal(
            <div
              className={cn(
                'fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm transition-opacity duration-200',
                isVisible ? 'opacity-100' : 'opacity-0'
              )}
              onClick={handleBackdropClick}
            >
              <div
                className={cn(
                  'w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-lg transition-all duration-200 ease-out',
                  isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                )}
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-lg font-semibold text-foreground">{confirmTitle}</h2>
                  <p className="text-sm text-muted-foreground">{confirmMessage}</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => hideDialog()}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleConfirm}>
                    Log out
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
