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
      accounts_payable: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          description: string
          due_date: string
          id: string
          invoice_number: string | null
          notes: string | null
          payment_date: string | null
          status: Database["public"]["Enums"]["account_status"] | null
          supplier_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          description: string
          due_date: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          status?: Database["public"]["Enums"]["account_status"] | null
          supplier_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          status?: Database["public"]["Enums"]["account_status"] | null
          supplier_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_payable_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_receivable: {
        Row: {
          amount: number
          company_id: string
          created_at: string
          customer_id: string | null
          description: string
          due_date: string
          id: string
          invoice_number: string | null
          notes: string | null
          payment_date: string | null
          status: Database["public"]["Enums"]["account_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          company_id: string
          created_at?: string
          customer_id?: string | null
          description: string
          due_date: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          status?: Database["public"]["Enums"]["account_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          company_id?: string
          created_at?: string
          customer_id?: string | null
          description?: string
          due_date?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string | null
          status?: Database["public"]["Enums"]["account_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_receivable_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_analysis: {
        Row: {
          analysis_type: string
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          analysis_type: string
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          analysis_type?: string
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_accounts: {
        Row: {
          account_number: string | null
          account_type: string | null
          agency: string | null
          bank_name: string | null
          company_id: string
          created_at: string
          current_balance: number | null
          id: string
          initial_balance: number | null
          is_active: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          account_type?: string | null
          agency?: string | null
          bank_name?: string | null
          company_id: string
          created_at?: string
          current_balance?: number | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          account_type?: string | null
          agency?: string | null
          bank_name?: string | null
          company_id?: string
          created_at?: string
          current_balance?: number | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_movements: {
        Row: {
          account_payable_id: string | null
          account_receivable_id: string | null
          amount: number
          balance_after: number
          bank_account_id: string
          company_id: string
          created_at: string
          description: string
          id: string
          imported_from_ofx: boolean | null
          movement_type: string
          reference_date: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_payable_id?: string | null
          account_receivable_id?: string | null
          amount: number
          balance_after: number
          bank_account_id: string
          company_id: string
          created_at?: string
          description: string
          id?: string
          imported_from_ofx?: boolean | null
          movement_type: string
          reference_date: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_payable_id?: string | null
          account_receivable_id?: string | null
          amount?: number
          balance_after?: number
          bank_account_id?: string
          company_id?: string
          created_at?: string
          description?: string
          id?: string
          imported_from_ofx?: boolean | null
          movement_type?: string
          reference_date?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_movements_account_payable_id_fkey"
            columns: ["account_payable_id"]
            isOneToOne: false
            referencedRelation: "accounts_payable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_movements_account_receivable_id_fkey"
            columns: ["account_receivable_id"]
            isOneToOne: false
            referencedRelation: "accounts_receivable"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_movements_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_movements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_movements_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          created_at: string | null
          end_date: string
          id: string
          period: string | null
          start_date: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["transaction_category"]
          created_at?: string | null
          end_date: string
          id?: string
          period?: string | null
          start_date: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["transaction_category"]
          created_at?: string | null
          end_date?: string
          id?: string
          period?: string | null
          start_date?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      crm_clients: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: []
      }
      crm_status: {
        Row: {
          color: string
          created_at: string
          id: string
          name: string
          order_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          name: string
          order_index?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          created_at: string
          credit_limit: number | null
          customer_type: string | null
          document: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string | null
          state: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          created_at?: string
          credit_limit?: number | null
          customer_type?: string | null
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          created_at?: string
          credit_limit?: number | null
          customer_type?: string | null
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_tasks: {
        Row: {
          assigned_to: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_alerts: {
        Row: {
          alert_type: string
          company_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          severity: string | null
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          company_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          severity?: string | null
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          company_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          severity?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      kanban_boards: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kanban_tasks: {
        Row: {
          assignee: string | null
          board_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          assignee?: string | null
          board_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          assignee?: string | null
          board_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kanban_tasks_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "kanban_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      ofx_imports: {
        Row: {
          bank_account_id: string
          company_id: string
          created_at: string
          error_message: string | null
          file_name: string
          id: string
          import_date: string
          status: string | null
          total_transactions: number | null
          user_id: string
        }
        Insert: {
          bank_account_id: string
          company_id: string
          created_at?: string
          error_message?: string | null
          file_name: string
          id?: string
          import_date?: string
          status?: string | null
          total_transactions?: number | null
          user_id: string
        }
        Update: {
          bank_account_id?: string
          company_id?: string
          created_at?: string
          error_message?: string | null
          file_name?: string
          id?: string
          import_date?: string
          status?: string | null
          total_transactions?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ofx_imports_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ofx_imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          subscription_end_date: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_end_date?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          subscription_end_date?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          created_at: string
          document: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          state: string | null
          supplier_type: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          state?: string | null
          supplier_type?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          created_at?: string
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          state?: string | null
          supplier_type?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bank_account_id: string | null
          category: Database["public"]["Enums"]["transaction_category"]
          company_id: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          processed_by_ai: boolean | null
          receipt_url: string | null
          supplier_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
          whatsapp_message_id: string | null
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          category: Database["public"]["Enums"]["transaction_category"]
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          processed_by_ai?: boolean | null
          receipt_url?: string | null
          supplier_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
          whatsapp_message_id?: string | null
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          category?: Database["public"]["Enums"]["transaction_category"]
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          processed_by_ai?: boolean | null
          receipt_url?: string | null
          supplier_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_config: {
        Row: {
          created_at: string | null
          id: string
          is_connected: boolean | null
          last_connected_at: string | null
          qr_code: string | null
          session_data: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_connected_at?: string | null
          qr_code?: string | null
          session_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          last_connected_at?: string | null
          qr_code?: string | null
          session_data?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          ai_response: string | null
          created_at: string | null
          id: string
          media_url: string | null
          message_content: string | null
          message_type: string | null
          processed: boolean | null
          user_id: string | null
          user_phone: string
        }
        Insert: {
          ai_response?: string | null
          created_at?: string | null
          id?: string
          media_url?: string | null
          message_content?: string | null
          message_type?: string | null
          processed?: boolean | null
          user_id?: string | null
          user_phone: string
        }
        Update: {
          ai_response?: string | null
          created_at?: string | null
          id?: string
          media_url?: string | null
          message_content?: string | null
          message_type?: string | null
          processed?: boolean | null
          user_id?: string | null
          user_phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_user_id_fkey"
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
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      account_status: "pending" | "paid" | "overdue" | "cancelled"
      subscription_status: "active" | "inactive" | "pending" | "expired"
      transaction_category:
        | "food"
        | "transport"
        | "entertainment"
        | "health"
        | "education"
        | "shopping"
        | "bills"
        | "salary"
        | "investment"
        | "other"
      transaction_type: "income" | "expense"
      user_role: "admin" | "user"
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
      account_status: ["pending", "paid", "overdue", "cancelled"],
      subscription_status: ["active", "inactive", "pending", "expired"],
      transaction_category: [
        "food",
        "transport",
        "entertainment",
        "health",
        "education",
        "shopping",
        "bills",
        "salary",
        "investment",
        "other",
      ],
      transaction_type: ["income", "expense"],
      user_role: ["admin", "user"],
    },
  },
} as const
