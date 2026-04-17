import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentProfile, getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  // Layout has already enforced auth; non-null asserted via early returns.
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {profile?.name ?? user?.email}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s menu</CardTitle>
          <CardDescription>
            Menu rendering lands in Slice 3. For now, this page just proves
            the auth-gated tree works.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {profile?.org_id ? (
            <p>
              Linked to org <code className="font-mono">{profile.org_id}</code>.
            </p>
          ) : (
            <p>
              You aren&apos;t linked to an organization yet. Run the seed
              script (<code className="font-mono">supabase/seed.sql</code>) to
              bootstrap your org and admin.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
