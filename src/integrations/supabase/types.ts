export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          progress: number | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          progress?: number | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          progress?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_project_financial: {
        Args: {
          p_project_id: string
          p_transaction_date: string
          p_amount: number
          p_transaction_type: string
          p_category: string
          p_description: string
          p_payment_status?: string
        }
        Returns: string
      }
      add_project_member: {
        Args: {
          p_project_id: string
          p_user_id: string
          p_name: string
          p_role: string
          p_email?: string
        }
        Returns: string
      }
      add_project_members: {
        Args: { p_project_id: string; p_user_id: string; p_team_members: Json }
        Returns: boolean
      }
      add_project_milestone: {
        Args: {
          p_project_id: string
          p_title: string
          p_description: string
          p_due_date: string
          p_status?: string
        }
        Returns: string
      }
      add_project_risk: {
        Args: {
          p_project_id: string
          p_title: string
          p_description: string
          p_severity: string
          p_probability: string
          p_impact: string
          p_mitigation_plan: string
          p_status?: string
        }
        Returns: string
      }
      add_project_tasks: {
        Args: { p_project_id: string; p_user_id: string; p_tasks: Json }
        Returns: boolean
      }
      add_team_member_safe: {
        Args: {
          p_project_id: string
          p_user_id: string
          p_name: string
          p_role: string
          p_email?: string
        }
        Returns: string
      }
      assign_project_role: {
        Args: { p_user_id: string; p_project_id: string; p_role_key: string }
        Returns: string
      }
      bypass_rls_for_development: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      can_access_project: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      can_modify_project_tasks: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: boolean
      }
      check_is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_project_access: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_access_safe: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_access_v2: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_access_v3: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_member_access: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_member_access_safe: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_membership: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_membership_safe: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_owner_or_admin: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      check_project_ownership: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      create_new_project: {
        Args: { project_data: Json }
        Returns: string
      }
      delete_project: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      delete_project_v2: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      direct_project_access: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      get_auth_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_parent_task_title: {
        Args: { p_task_id: string }
        Returns: string
      }
      get_permissions_for_role: {
        Args: { p_role_key: string }
        Returns: {
          id: string
          permission_name: string
          description: string
        }[]
      }
      get_project_by_id: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          name: string
          description: string
          progress: number
          status: string
          due_date: string
          category: string
          team: Json
          project_type: string
          project_manager_id: string
          start_date: string
          estimated_cost: number
          actual_cost: number
          budget_approved: boolean
          performance_index: number
        }[]
      }
      get_project_financials: {
        Args: { p_project_id: string }
        Returns: Json[]
      }
      get_project_members_v2: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          user_id: string
          project_member_name: string
          role: string
          joined_at: string
        }[]
      }
      get_project_milestones: {
        Args: { p_project_id: string }
        Returns: Json[]
      }
      get_project_owner: {
        Args: { project_id: string }
        Returns: string
      }
      get_project_permissions: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          permission_name: string
          description: string
          created_at: string
        }[]
      }
      get_project_risks: {
        Args: { p_project_id: string }
        Returns: Json[]
      }
      get_project_role_id: {
        Args: { p_role_key: string }
        Returns: string
      }
      get_project_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          role_key: string
          description: string
          created_at: string
        }[]
      }
      get_project_roles_v3: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          role_key: string
          description: string
        }[]
      }
      get_project_tasks: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          title: string
          description: string
          status: string
          priority: string
          due_date: string
          completed: boolean
          project_id: string
          created_at: string
          updated_at: string
        }[]
      }
      get_project_team_with_permissions: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          name: string
          role: string
          user_id: string
          permissions: string[]
        }[]
      }
      get_role_description: {
        Args: { p_role_key: string }
        Returns: string
      }
      get_role_id_flexible: {
        Args: { p_role_key: string }
        Returns: string
      }
      get_team_members_v3: {
        Args: { p_project_id: string }
        Returns: {
          id: string
          user_id: string
          name: string
          role: string
          joined_at: string
        }[]
      }
      get_user_project_permissions: {
        Args: { p_user_id: string; p_project_id: string }
        Returns: {
          permission_name: string
        }[]
      }
      get_user_projects: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
          progress: number
          status: string
          due_date: string
          category: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      has_project_permission: {
        Args: { p_user_id: string; p_project_id: string; p_permission: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string } | Record<PropertyKey, never>
        Returns: boolean
      }
      is_member_of_project: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      is_project_member: {
        Args: { project_id: string; user_id: string } | { project_id: string }
        Returns: boolean
      }
      is_project_member_or_owner: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      is_project_owner: {
        Args: { p_project_id: string }
        Returns: boolean
      }
      is_project_owner_or_admin: {
        Args: { project_id: string }
        Returns: boolean
      }
      is_task_accessible: {
        Args: { task_id: string }
        Returns: boolean
      }
      is_task_accessible_by_user: {
        Args: { p_task_id: string; p_user_id: string }
        Returns: boolean
      }
      is_task_assignee: {
        Args: { task_id: string }
        Returns: boolean
      }
      is_task_owner: {
        Args: { task_id: string }
        Returns: boolean
      }
      remove_project_member: {
        Args: { p_project_id: string; p_member_id: string }
        Returns: boolean
      }
      update_financial: {
        Args: { p_financial_id: string; p_updates: Json }
        Returns: boolean
      }
      update_milestone: {
        Args: { p_milestone_id: string; p_updates: Json }
        Returns: boolean
      }
      update_project_settings: {
        Args: {
          p_project_id: string
          p_name: string
          p_description: string
          p_category: string
          p_status: string
        }
        Returns: boolean
      }
      update_risk: {
        Args: { p_risk_id: string; p_updates: Json }
        Returns: boolean
      }
    }
    Enums: {
      project_role_type:
        | "project_manager"
        | "project_owner"
        | "team_member"
        | "developer"
        | "designer"
        | "qa_tester"
        | "client_stakeholder"
        | "observer_viewer"
        | "admin"
        | "scrum_master"
        | "business_analyst"
        | "coordinator"
      user_role_type: "admin" | "manager" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      project_role_type: [
        "project_manager",
        "project_owner",
        "team_member",
        "developer",
        "designer",
        "qa_tester",
        "client_stakeholder",
        "observer_viewer",
        "admin",
        "scrum_master",
        "business_analyst",
        "coordinator",
      ],
      user_role_type: ["admin", "manager", "user"],
    },
  },
} as const
