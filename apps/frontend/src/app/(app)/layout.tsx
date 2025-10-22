'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { LayoutDashboard, Loader2, PiggyBank, Receipt, Wallet } from 'lucide-react';
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
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Receipt },
  { href: '/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/assets', label: 'Assets', icon: Wallet }
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
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="flex w-full max-w-xs flex-col border-r bg-card/60 px-4 py-6 backdrop-blur lg:max-w-sm">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-card px-3 py-3 shadow-sm">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span>ZK</span>
            </div>
            <div>
              <span className="block text-base font-semibold leading-tight">Zoltraak</span>
              <span className="block text-xs text-muted-foreground">Financial Buddy</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activePath === href
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 rounded-xl border border-border/60 bg-card/90 p-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {user?.displayName ?? user?.email ?? 'Account'}
            </p>
            {user?.email ? <p className="text-xs text-muted-foreground">{user.email}</p> : null}
            {user?.role ? (
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{user.role.toLowerCase()}</p>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/settings"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'sm' }),
                'w-full justify-center border border-transparent'
              )}
            >
              Settings
            </Link>
            <LogoutButton className="w-full justify-center" variant="outline">
              Logout
            </LogoutButton>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-10">{children}</div>
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
