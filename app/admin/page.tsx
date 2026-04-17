import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Menu management arrives in Slice 2.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menus</CardTitle>
          <CardDescription>List + create UI lands next slice.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          You can see this page because your profile has{' '}
          <code className="font-mono">role = &apos;admin&apos;</code>. Members
          who hit <code className="font-mono">/admin</code> get a 403.
        </CardContent>
      </Card>
    </div>
  );
}
