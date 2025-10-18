'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaAndroid, FaApple, FaDesktop } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Option = {
  href: string;
  label: string;
  icon: IconType;
};

const options: Option[] = [
  { href: '/download/android', label: 'Android', icon: FaAndroid },
  { href: '/download/ios', label: 'iOS', icon: FaApple },
  { href: '/download/pc', label: 'PC', icon: FaDesktop }
];

export function DownloadMenu() {
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Download
      </Button>
      <div
        className={cn(
          'absolute right-0 z-50 mt-2 min-w-[160px] overflow-hidden rounded-lg border border-border bg-card shadow-lg transition-opacity',
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        role="menu"
      >
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <Link
              key={option.href}
              href={option.href}
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground transition hover:bg-muted"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
