'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { FolderTree, LayoutDashboard, Loader2, PiggyBank, Receipt, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { CurrencyModal } from '@/components/currency/currency-modal';
import { LogoutButton } from '@/components/auth/logout-button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useUpdateCurrency } from '@/hooks/use-user';
import { getErrorMessage } from '@/lib/http-error';
import { cn } from '@/lib/utils';
import type { CurrencyCode } from '@zoltraak/types';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Receipt },
  { href: '/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/assets', label: 'Assets', icon: Wallet },
  { href: '/categories', label: 'Categories', icon: FolderTree }
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitializing } = useAuth();
  const updateCurrency = useUpdateCurrency();
  const [isCurrencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [currencyError, setCurrencyError] = useState<string | null>(null);

  const requiresCurrency = isAuthenticated && Boolean(user) && !user?.currency;

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isInitializing, router]);

  useEffect(() => {
    if (requiresCurrency) {
      setCurrencyModalOpen(true);
      setCurrencyError(null);
    } else if (!requiresCurrency && !updateCurrency.isPending) {
      setCurrencyModalOpen(false);
    }
  }, [requiresCurrency, updateCurrency.isPending]);

  const handleCurrencySubmit = async (currency: CurrencyCode) => {
    setCurrencyError(null);

    try {
      await updateCurrency.mutateAsync({ currency });
      setCurrencyModalOpen(false);
    } catch (error) {
      setCurrencyError(
        getErrorMessage(error, 'Unable to update currency. Please try again.')
      );
    }
  };

  const handleCurrencyClose = () => {
    if (!requiresCurrency) {
      setCurrencyModalOpen(false);
      setCurrencyError(null);
    }
  };

  const activePath = useMemo(() => {
    if (!pathname) {
      return '/dashboard';
    }
    const match = navItems.find((item) => pathname.startsWith(item.href));
    return match?.href ?? '/dashboard';
  }, [pathname]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-foreground dark:bg-[#0f1219] dark:text-slate-100">
      <aside className="relative hidden min-h-screen w-[280px] flex-col border-r border-border bg-muted/30 px-6 py-8 dark:border-white/5 dark:bg-[#131722] xl:flex">
        <div className="sticky top-0 z-10 -mx-6 -mt-8 flex items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-6 pb-4 pt-8 backdrop-blur-sm dark:border-white/10 dark:bg-[#131722]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-foreground dark:bg-[#2b3142] dark:text-slate-200">
              ZK
            </div>
            <div>
              <span className="block text-base font-semibold leading-tight">
                Zoltraak
              </span>
              <span className="block text-xs text-muted-foreground dark:text-slate-400">
                Financial intelligence
              </span>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mt-6 space-y-4 text-xs text-muted-foreground dark:text-slate-400">
          <p className="rounded-xl border border-border bg-card px-4 py-3 dark:border-white/5 dark:bg-[#181d2b]">
            Keep your workspace secure by enabling multi-factor authentication in settings.
          </p>
        </div>

        <nav className="mt-6 flex-1 space-y-1 text-sm">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-colors',
                activePath === href
                  ? 'border border-border bg-card/70 text-foreground shadow-sm dark:border-white/5 dark:bg-[#1f2534] dark:text-slate-100'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-400 dark:hover:bg-[#1b2030] dark:hover:text-slate-100'
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted dark:border-white/5 dark:bg-[#1d2230]',
                  activePath === href && 'border-foreground/30 text-foreground dark:border-white/10 dark:text-slate-100'
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="sticky bottom-0 z-10 -mx-6 -mb-8 mt-6 border-t border-border/60 bg-muted/30 px-6 pb-8 pt-4 dark:border-white/10 dark:bg-[#131722]">
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              {user?.displayName ?? user?.email ?? 'Account'}
            </p>
            {user?.email ? <p className="text-xs text-muted-foreground dark:text-slate-400">{user.email}</p> : null}
            {user?.role ? (
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground/70 dark:text-slate-500">
                {user.role.toLowerCase()}
              </p>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/settings"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'w-full justify-center border border-border/70 bg-transparent text-foreground hover:bg-muted/70 dark:border-white/10 dark:text-slate-100 dark:hover:bg-white/10'
              )}
            >
              Settings
            </Link>
            <LogoutButton
              className="w-full justify-center border border-border/70 text-foreground hover:bg-muted/70 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
              variant="outline"
            >
              Logout
            </LogoutButton>
          </div>
        </div>
      </aside>

      <main className="relative flex-1 overflow-y-auto px-3 py-6 sm:px-4 lg:px-5 xl:px-6">
        <div className="flex w-full flex-col gap-5">
          <div className="xl:hidden">
            <div className="rounded-2xl border border-border bg-card p-4 dark:border-white/5 dark:bg-[#161b26]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-foreground dark:bg-[#2b3142] dark:text-slate-200">
                  ZK
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {user?.displayName ?? user?.email ?? 'Zoltraak'}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-slate-400">Finance command center</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition',
                      pathname.startsWith(href)
                        ? 'border-foreground/30 bg-muted/80 text-foreground dark:border-white/10 dark:bg-white/10 dark:text-slate-100'
                        : 'border-border bg-transparent text-muted-foreground hover:bg-muted/70 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10'
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {children}
        </div>
      </main>

      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        initialCurrency={user?.currency ?? null}
        onSubmit={handleCurrencySubmit}
        onClose={handleCurrencyClose}
        isSubmitting={updateCurrency.isPending}
        allowDismiss={!requiresCurrency}
        warning={
          requiresCurrency
            ? 'Please choose your preferred currency to continue.'
            : 'Changing your currency will permanently delete all existing transactions.'
        }
        error={currencyError}
      />
    </div>
  );
}
