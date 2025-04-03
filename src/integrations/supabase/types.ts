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
      custom_roles: {
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
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
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
      role_permissions: {
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
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
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
      add_project_members: {
        Args: {
          p_project_id: string
          p_user_id: string
          p_team_members: Json
        }
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
        Args: {
          p_project_id: string
          p_user_id: string
          p_tasks: Json
        }
        Returns: boolean
      }
      can_modify_project_tasks: {
        Args: {
          p_project_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      check_project_member_access: {
        Args: {
          p_project_id: string
        }
        Returns: boolean
      }
      create_new_project: {
        Args: {
          project_data: Json
        }
        Returns: string
      }
      delete_project: {
        Args: {
          p_project_id: string
        }
        Returns: boolean
      }
      get_auth_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_project_by_id: {
        Args: {
          p_project_id: string
        }
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
        Args: {
          p_project_id: string
        }
        Returns: Json[]
      }
      get_project_milestones: {
        Args: {
          p_project_id: string
        }
        Returns: Json[]
      }
      get_project_owner: {
        Args: {
          project_id: string
        }
        Returns: string
      }
      get_project_risks: {
        Args: {
          p_project_id: string
        }
        Returns: Json[]
      }
      get_project_tasks: {
        Args: {
          p_project_id: string
        }
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
        Args: {
          user_id: string
        }
        Returns: string
      }
      is_admin:
        | {
            Args: Record<PropertyKey, never>
            Returns: boolean
          }
        | {
            Args: {
              user_id: string
            }
            Returns: boolean
          }
      is_member_of_project: {
        Args: {
          p_project_id: string
        }
        Returns: boolean
      }
      is_project_member:
        | {
            Args: {
              project_id: string
            }
            Returns: boolean
          }
        | {
            Args: {
              project_id: string
              user_id: string
            }
            Returns: boolean
          }
      is_project_member_or_owner: {
        Args: {
          project_id: string
        }
        Returns: boolean
      }
      is_project_owner_or_admin: {
        Args: {
          project_id: string
        }
        Returns: boolean
      }
      is_task_accessible: {
        Args: {
          task_id: string
        }
        Returns: boolean
      }
      is_task_accessible_by_user: {
        Args: {
          p_task_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      is_task_assignee: {
        Args: {
          task_id: string
        }
        Returns: boolean
      }
      is_task_owner: {
        Args: {
          task_id: string
        }
        Returns: boolean
      }
      remove_project_member: {
        Args: {
          p_project_id: string
          p_member_id: string
        }
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
    }
    Enums: {
      user_role_type: "admin" | "manager" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
