
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-wrapper';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSent(true);
      toast("Password reset email sent", {
        description: "Please check your email for further instructions",
      });
    } catch (error: any) {
      toast.error("Failed to send reset email", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Forgot Password</h2>
        <p className="text-sm text-muted-foreground">
          {isSent 
            ? "Reset link sent! Check your email."
            : "Enter your email to receive a reset link"}
        </p>
      </div>
      
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center py-4">
          <Button asChild variant="outline" className="mt-2">
            <Link to="/auth/login">Return to sign in</Link>
          </Button>
        </div>
      )}
      
      {!isSent && (
        <div className="text-center text-sm">
          Remember your password?{' '}
          <Link to="/auth/login" className="underline">
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
