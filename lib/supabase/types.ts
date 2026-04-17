import type { Database } from '@/types/database';

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type Organization = Tables<'organizations'>;
export type Menu = Tables<'menus'>;
export type MenuItem = Tables<'menu_items'>;
export type Selection = Tables<'selections'>;

export type Role = Profile['role'];
export type MenuStatus = Menu['status'];
