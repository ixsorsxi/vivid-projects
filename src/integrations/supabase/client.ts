
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zjepfrybhlzomyxktaju.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZXBmcnliaGx6b215eGt0YWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1NTAxNDcsImV4cCI6MjA1NzEyNjE0N30.uSX6I8LbjPv5ZXfBU1xMXTcaPTIqKOqgFj3DFy8o7Rs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
