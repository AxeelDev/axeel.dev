// Matches the checked-in migration. Regenerate against your project with npm run db:types.
import type { Project, Post, Tool, ToolGroup, SiteSettings } from "@/features/content/types";
type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};
export type Database = {
  public: {
    Tables: {
      projects: Table<Project, "title" | "slug">;
      posts: Table<Post, "title" | "slug">;
      tools: Table<Tool, "name" | "group_id">;
      tool_groups: Table<ToolGroup, "label">;
      site_settings: Table<SiteSettings, "id">;
      portfolio_admins: Table<{ user_id: string; created_at: string }, "user_id">;
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
