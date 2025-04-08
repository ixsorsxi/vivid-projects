
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
    // Prevent regular sign-ups
    toast.error('Registration restricted', {
      description: 'Self-registration is disabled. Please contact an administrator to create an account.',
    });
    return { error: new Error('Self-registration is disabled'), success: false };
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
    // Save the current admin session tokens before creating the new user
    const { data: currentSession } = await supabase.auth.getSession();
    const adminAccessToken = currentSession?.session?.access_token;
    const adminRefreshToken = currentSession?.session?.refresh_token;
    
    console.log("Current admin session saved:", currentSession?.session?.user?.email);
    
    if (!adminAccessToken || !adminRefreshToken) {
      console.error("No admin session tokens found");
      toast.error("User creation failed", {
        description: "Could not securely maintain admin session",
      });
      return false;
    }
    
    // Sign out first to clear current session
    await supabase.auth.signOut();
    
    // Create the new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: {
          full_name: name,
          role: role,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error("User creation failed", {
        description: error.message,
      });
      console.error("Error creating user:", error);
      
      // Attempt to restore admin session anyway
      await supabase.auth.setSession({
        access_token: adminAccessToken,
        refresh_token: adminRefreshToken
      });
      
      return false;
    }

    if (!data?.user?.id) {
      toast.error("User creation error", {
        description: "User was created but no user ID was returned",
      });
      console.error("No user ID returned after creation");
      
      // Attempt to restore admin session anyway
      await supabase.auth.setSession({
        access_token: adminAccessToken,
        refresh_token: adminRefreshToken
      });
      
      return false;
    }
    
    console.log("New user created:", data.user.id);
    
    // Wait a moment to ensure the profile trigger has time to execute
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the profile with additional information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        role,
        full_name: name 
      })
      .eq('id', data.user.id);
    
    if (profileError) {
      console.error('Error updating user profile:', profileError);
      toast.info("Profile update issue", {
        description: "User created but there was an issue updating their profile details.",
      });
    }

    // Always restore the admin session explicitly using saved tokens
    console.log("Restoring admin session for:", currentSession?.session?.user?.email);
    try {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: adminAccessToken,
        refresh_token: adminRefreshToken
      });
      
      if (sessionError) {
        console.error("Error restoring admin session:", sessionError);
        toast.error("Session restoration error", {
          description: "Your admin session could not be restored. Please refresh the page if you experience any issues.",
        });
        
        // If session restore fails, explicitly sign out to ensure we're in a clean state
        await supabase.auth.signOut();
        return false;
      }
      
      // Verify the session was restored properly
      const { data: verifySession } = await supabase.auth.getSession();
      if (verifySession?.session?.user?.email !== currentSession.session.user?.email) {
        console.warn("Session may not have been restored correctly. Expected:", currentSession.session.user?.email, "Got:", verifySession?.session?.user?.email);
        
        toast.warning("Session warning", {
          description: "Your admin session may not have been fully restored. Please refresh the page if needed.",
        });
      } else {
        console.log("Admin session successfully restored");
      }
    } catch (sessionError) {
      console.error("Critical error restoring admin session:", sessionError);
      toast.error("Session restoration failed", {
        description: "Please refresh the page to restore your admin access.",
      });
      return false;
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
