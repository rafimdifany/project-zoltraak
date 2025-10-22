'use client';

import { LayoutDashboard, Loader2, PiggyBank, Receipt, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { CurrencyModal } from '@/components/currency/currency-modal';
import { LogoutButton } from '@/components/auth/logout-button';
import { useAuth } from '@/contexts/auth-context';
import { useUpdateCurrency } from '@/hooks/use-user';
import { getErrorMessage } from '@/lib/http-error';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import type { CurrencyCode } from '@zoltraak/types';

type AppShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Receipt },
  { href: '/budgets', label: 'Budgets', icon: PiggyBank },
  { href: '/assets', label: 'Assets', icon: Wallet }
];

export function AppShell({ children }: AppShellProps) {
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
      setCurrencyError(getErrorMessage(error, 'Unable to update currency. Please try again.'));
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

  const navLinks = navItems.map(({ href, label, icon: Icon }) => (
    <Link
      key={href}
      href={href}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        activePath === href
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  ));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span>ZK</span>
            </div>
            <div>
              <span className="block text-base leading-tight">Zoltraak</span>
              <span className="block text-xs text-muted-foreground">Finance intelligence</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-semibold text-foreground">{user?.displayName ?? user?.email}</p>
              {user?.role ? (
                <p className="text-xs uppercase text-muted-foreground">{user.role.toLowerCase()}</p>
              ) : null}
            </div>
            <ThemeToggle />
            <Link
              href="/settings"
              className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
            >
              Settings
            </Link>
            <LogoutButton>Logout</LogoutButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="flex w-full flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 md:flex-row">
          <aside className="md:w-56">
            <div className="rounded-2xl border bg-card p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Navigation</p>
              <nav className="hidden flex-col gap-1 md:flex">{navLinks}</nav>
              <nav className="flex flex-wrap gap-2 md:hidden">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'rounded-full border px-3 py-1 text-sm font-medium transition',
                      activePath === href
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          <section className="flex-1">{children}</section>
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
            ? 'Please choose your preferred currency to begin exploring your dashboard.'
            : 'Changing your currency will permanently delete all existing transactions.'
        }
        error={currencyError}
      />
    </div>
  );
}
