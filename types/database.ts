/**
 * Supabase database types.
 *
 * THIS FILE IS A PLACEHOLDER. Regenerate after every schema change with:
 *   npx supabase gen types typescript --linked > types/database.ts
 *
 * Hand-maintained until the first `supabase db push` so the rest of the
 * codebase compiles with strict types out of the gate.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          vendor_email: string;
          timezone: string;
          default_cutoff_time: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          vendor_email: string;
          timezone?: string;
          default_cutoff_time?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          vendor_email?: string;
          timezone?: string;
          default_cutoff_time?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: 'member' | 'admin' | 'vendor';
          org_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          role?: 'member' | 'admin' | 'vendor';
          org_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          role?: 'member' | 'admin' | 'vendor';
          org_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_org_id_fkey';
            columns: ['org_id'];
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      menus: {
        Row: {
          id: string;
          org_id: string;
          date: string;
          cutoff_at: string;
          status: 'draft' | 'published' | 'locked';
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          date: string;
          cutoff_at: string;
          status?: 'draft' | 'published' | 'locked';
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          date?: string;
          cutoff_at?: string;
          status?: 'draft' | 'published' | 'locked';
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'menus_org_id_fkey';
            columns: ['org_id'];
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'menus_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      menu_items: {
        Row: {
          id: string;
          menu_id: string;
          name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          menu_id: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          menu_id?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'menu_items_menu_id_fkey';
            columns: ['menu_id'];
            referencedRelation: 'menus';
            referencedColumns: ['id'];
          },
        ];
      };
      selections: {
        Row: {
          id: string;
          menu_id: string;
          menu_item_id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          menu_id: string;
          menu_item_id: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          menu_id?: string;
          menu_item_id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'selections_menu_id_fkey';
            columns: ['menu_id'];
            referencedRelation: 'menus';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'selections_menu_item_id_fkey';
            columns: ['menu_item_id'];
            referencedRelation: 'menu_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'selections_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin_of: {
        Args: { _org_id: string };
        Returns: boolean;
      };
      my_org_id: {
        Args: Record<PropertyKey, never>;
        Returns: string | null;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
