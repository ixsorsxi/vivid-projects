
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export const signInUser = async (email: string, password: string): Promise<any> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    return { data, success: !!data.user };
  } catch (error: any) {
    toast.error('Login failed', {
      description: error.message || 'Please check your credentials',
    });
    return { error, success: false };
  }
};

export const signUpUser = async (email: string, password: string, metadata?: any): Promise<any> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    
    toast("Account created", {
      description: "Please check your email to confirm your account",
    });
    
    return { data, success: !!data.user };
  } catch (error: any) {
    toast.error('Registration failed', {
      description: error.message || 'Please try again',
    });
    return { error, success: false };
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    toast("Signed out", {
      description: "You have been signed out successfully",
    });
  } catch (error: any) {
    toast.error('Sign out failed', {
      description: error.message || 'Please try again',
    });
  }
};

export const createNewUser = async (email: string, password: string, name: string, role: 'user' | 'admin' | 'manager'): Promise<boolean> => {
  try {
    // Since admin user creation requires service_role privileges which we don't have in the browser,
    // we'll use regular signup and then update the profile with admin role
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: {
          full_name: name,
          role: role, // Store role in metadata for easy access
        },
      },
    });

    if (error) {
      toast.error("User creation failed", {
        description: error.message,
      });
      console.error("Error creating user:", error);
      return false;
    }

    // Update the user's profile with the assigned role
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role,
          full_name: name 
        })
        .eq('id', data.user.id);
        
      if (profileError) {
        console.error('Error updating user role:', profileError);
      }
    }

    toast.success("User created successfully", {
      description: `${name} has been added. Note: They will need to confirm their email to log in.`,
    });
    return true;
  } catch (error: any) {
    console.error("User creation error:", error);
    toast.error("An error occurred", {
      description: "Please try again later or create the user directly in Supabase.",
    });
    return false;
  }
};
