'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import { useLogin } from '@/hooks/use-auth';
import { getErrorMessage } from '@/lib/http-error';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const loginMutation = useLogin();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isInitializing, router]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to sign in. Please check your credentials.'));
    }
  });

  return (
    <div className="relative flex min-h-screen w-full bg-background">
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <div className="grid w-full flex-1 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-purple-700 p-10 text-primary-foreground lg:flex dark:from-slate-950 dark:via-slate-900 dark:to-[#0b1120] dark:text-slate-100">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-white/25 blur-3xl dark:bg-emerald-400/20" />
            <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/15 blur-2xl dark:bg-cyan-500/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_70%)]" />
            <div className="absolute -bottom-24 -left-32 h-48 w-48 rounded-full bg-purple-400/20 blur-3xl dark:bg-indigo-500/20" />
          </div>

          <div className="relative z-10 max-w-lg space-y-6">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              Intelligent finance
            </span>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Master your money with real-time personal finance insights.
            </h1>
            <p className="text-sm text-primary-foreground/80 sm:text-base">
              Zoltraak analyses your budgets, transactions, and goals to surface the next best action—so you can focus on what matters.
            </p>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white" />
                Personalized automations that adapt to spending patterns.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white" />
                Predictive dashboards that forecast account health.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white" />
                Collaboration tools to sync with partners or advisors.
              </li>
            </ul>
          </div>

          <div className="relative z-10 mt-10 grid gap-4 text-sm text-primary-foreground/90 md:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-white/60">Net Worth</p>
              <p className="mt-2 text-2xl font-semibold">$142,380</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-200" />
                Up 8.4% this quarter
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-white/60">Savings runway</p>
              <p className="mt-2 text-2xl font-semibold">18 months</p>
              <p className="mt-1 text-xs text-white/70">Based on your recurring expenses and goals.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-16 sm:px-10">
          <Card className="relative z-10 w-full max-w-md shadow-xl">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
              <CardDescription className="text-sm">
                Sign in to continue exploring Lunaris insights and automate your next financial win.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form id="login-form" className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
                  {errors.email ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
                  {errors.password ? <p className="text-xs text-rose-500">{errors.password.message}</p> : null}
                </div>
              </form>
              {formError ? <p className="text-sm text-rose-500">{formError}</p> : null}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                form="login-form"
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                No account yet?{' '}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Create one for free
                </Link>
              </p>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
}
