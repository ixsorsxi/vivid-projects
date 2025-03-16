
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Login failed", {
        description: error.message,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Login error:', error);
    toast.error("An error occurred", {
      description: "Please try again later",
    });
    return false;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    toast.error("Error signing out", {
      description: "Please try again",
    });
  }
};

export const createNewUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'user' | 'admin'
): Promise<boolean> => {
  try {
    // Create the user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
      },
    });

    if (error) {
      toast.error("User creation failed", {
        description: error.message,
      });
      return false;
    }

    // Update the profile with the specified role
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Error updating user role:', profileError);
        toast.error("Failed to set user role", {
          description: "User was created but role couldn't be set",
        });
        // We still return true because the user was created
      }
    }

    toast.success("User created successfully", {
      description: `${name} has been added as a ${role}`,
    });
    return true;
  } catch (error) {
    console.error('User creation error:', error);
    toast.error("An error occurred", {
      description: "Please try again later",
    });
    return false;
  }
};
