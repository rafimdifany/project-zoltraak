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
    <div className="mx-auto flex min-h-[600px] w-full max-w-md items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Log in to continue exploring your Zoltraak dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form id="login-form" className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email ? <p className="text-xs text-rose-500">{errors.email.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" {...register('password')} />
              {errors.password ? <p className="text-xs text-rose-500">{errors.password.message}</p> : null}
            </div>
          </form>
          {formError ? <p className="text-sm text-rose-500">{formError}</p> : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button form="login-form" type="submit" className="w-full" disabled={loginMutation.isPending}>
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
    </div>
  );
}
