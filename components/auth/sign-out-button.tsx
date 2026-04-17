import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SignOutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <Button type="submit" variant="ghost" size="sm">
        <LogOut aria-hidden />
        Sign out
      </Button>
    </form>
  );
}
