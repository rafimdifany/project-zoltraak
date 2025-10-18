'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : 'Not available';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Review your account details and manage your session.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>Your profile information sourced from the Zoltraak backend.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Name</dt>
              <dd className="text-sm font-medium text-foreground">{user.displayName ?? 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium text-foreground">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Role</dt>
              <dd className="text-sm font-medium text-foreground">{user.role.toLowerCase()}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Member since</dt>
              <dd className="text-sm font-medium text-foreground">{formatDate(user.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted-foreground">Last updated</dt>
              <dd className="text-sm font-medium text-foreground">{formatDate(user.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session control</CardTitle>
          <CardDescription>Sign out if you are finished working on this device.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Logging out clears local session tokens stored in your browser.
          </p>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
