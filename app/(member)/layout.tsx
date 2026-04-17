import Link from 'next/link';
import { redirect } from 'next/navigation';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { getCurrentProfile, getCurrentUser } from '@/lib/auth';

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between gap-4 px-4">
          <Link href="/" className="font-semibold">
            Catering
          </Link>
          <div className="flex items-center gap-3 text-sm">
            {profile?.role === 'admin' ? (
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground"
              >
                Admin
              </Link>
            ) : null}
            <span className="hidden text-muted-foreground sm:inline">
              {profile?.name ?? user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
