import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect('/');
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}
