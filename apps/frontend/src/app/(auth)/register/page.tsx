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
import { useRegister } from '@/hooks/use-auth';
import { getErrorMessage } from '@/lib/http-error';

const registerSchema = z
  .object({
    displayName: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const registerMutation = useRegister();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
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
      await registerMutation.mutateAsync({
        displayName: values.displayName,
        email: values.email,
        password: values.password
      });
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to create your account. Please try again.'));
    }
  });

  return (
    <div className="mx-auto flex min-h-[680px] w-full max-w-md items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start tracking budgets, expenses, and assets. Upgrade later for AI-enabled insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form id="register-form" className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="displayName">Name</Label>
              <Input id="displayName" placeholder="Alex Morgan" {...register('displayName')} />
              {errors.displayName ? <p className="text-xs text-rose-500">{errors.displayName.message}</p> : null}
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword ? (
                <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
          </form>
          {formError ? <p className="text-sm text-rose-500">{formError}</p> : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button form="register-form" type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Creating account...' : 'Create account'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
