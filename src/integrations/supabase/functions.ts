
// This file contains type definitions for RPC functions

export interface SupabaseRPCFunctions {
  get_settings: () => Promise<any[]>;
  get_setting: (params: { p_key: string }) => Promise<any>;
  save_setting: (params: { p_key: string; p_value: string }) => Promise<boolean>;
}

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(
      fn: keyof SupabaseRPCFunctions,
      params?: Parameters<SupabaseRPCFunctions[typeof fn]>[0]
    ): Promise<{ data: T; error: any }>;
  }
}
