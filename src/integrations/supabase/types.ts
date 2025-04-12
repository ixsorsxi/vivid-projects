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
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string | null
          id: string
          unread_count: number | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          id?: string
          unread_count?: number | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          id?: string
          unread_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_last_message_id_fkey"
            columns: ["last_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          id: string
          read: boolean
          recipient_id: string
          sender_id: string
          timestamp: string | null
        }
        Insert: {
          content: string
          id?: string
          read?: boolean
          recipient_id: string
          sender_id: string
          timestamp?: string | null
        }
        Update: {
          content?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_to_id: string | null
          related_to_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_to_id?: string | null
          related_to_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_to_id?: string | null
          related_to_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          custom_role_id: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          custom_role_id?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          custom_role_id?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "system_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_financials: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          description: string | null
          id: string
          payment_status: string
          project_id: string
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          payment_status?: string
          project_id: string
          transaction_date?: string
          transaction_type?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          payment_status?: string
          project_id?: string
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_financials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string | null
          id: string
          joined_at: string | null
          left_at: string | null
          project_id: string
          project_member_name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          project_id: string
          project_member_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          joined_at?: string | null
          left_at?: string | null
          project_id?: string
          project_member_name?: string | null
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
      project_milestones: {
        Row: {
          completion_date: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          project_id: string
          status: string
          title: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          project_id: string
          status?: string
          title: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          project_id?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_permissions: {
        Row: {
          created_at: string | null
          description: string
          id: string
          permission_name: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          permission_name: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          permission_name?: string
        }
        Relationships: []
      }
      project_risks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          impact: string
          mitigation_plan: string | null
          probability: string
          project_id: string
          severity: string
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          impact?: string
          mitigation_plan?: string | null
          probability?: string
          project_id: string
          severity?: string
          status?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          impact?: string
          mitigation_plan?: string | null
          probability?: string
          project_id?: string
          severity?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_risks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_role_permissions: {
        Row: {
          created_at: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "project_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_roles: {
        Row: {
          created_at: string | null
          description: string
          id: string
          role_key: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          role_key: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          role_key?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_cost: number | null
          budget_approved: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_cost: number | null
          id: string
          name: string
          performance_index: number | null
          progress: number | null
          project_manager_id: string | null
          project_type: string | null
          start_date: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          budget_approved?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          name: string
          performance_index?: number | null
          progress?: number | null
          project_manager_id?: string | null
          project_type?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          budget_approved?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          name?: string
          performance_index?: number | null
          progress?: number | null
          project_manager_id?: string | null
          project_type?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_role_permissions: {
        Row: {
          enabled: boolean | null
          id: string
          permission: string
          role_id: string | null
        }
        Insert: {
          enabled?: boolean | null
          id?: string
          permission: string
          role_id?: string | null
        }
        Update: {
          enabled?: boolean | null
          id?: string
          permission?: string
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "system_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_roles: {
        Row: {
          base_type: Database["public"]["Enums"]["user_role_type"]
          created_at: string | null
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          base_type?: Database["public"]["Enums"]["user_role_type"]
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          base_type?: Database["public"]["Enums"]["user_role_type"]
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      task_assignees: {
        Row: {
          created_at: string | null
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignees_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          created_at: string | null
          dependency_task_id: string
          dependency_type: string
          id: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_task_id: string
          dependency_type?: string
          id?: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          dependency_task_id?: string
          dependency_type?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_dependency_task_id_fkey"
            columns: ["dependency_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_subtasks: {
        Row: {
          completed: boolean
          created_at: string | null
          id: string
          parent_task_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: string
          parent_task_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: string
          parent_task_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_subtasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed: boolean
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_project_roles: {
        Row: {
          created_at: string | null
          id: string
          project_id: string
          project_role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_id: string
          project_role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          project_id?: string
          project_role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_project_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_project_roles_project_role_id_fkey"
            columns: ["project_role_id"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_project_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      assign_project_role: {
        Args: { p_user_id: string; p_project_id: string; p_role_key: string }
        Returns: string
      }
      bypass_rls_for_development: {
        Args: Record<PropertyKey, never>
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
      check_project_access_v2: {
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
      get_project_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          role_key: string
          description: string
          created_at: string
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
