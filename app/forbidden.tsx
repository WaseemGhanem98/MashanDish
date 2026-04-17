import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Forbidden() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          403
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          You don&apos;t have access
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          This area is for admins. If you think you should have access,
          ask an admin in your organization to update your role.
        </p>
      </div>
      <Button asChild>
        <Link href="/">Back to today&apos;s menu</Link>
      </Button>
    </main>
  );
}
