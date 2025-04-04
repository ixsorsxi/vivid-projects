
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { toast } from '@/components/ui/toast-wrapper';
import { Eye, EyeOff, User, Lock, LogIn, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await signIn(data.email, data.password);
      
      if (success) {
        toast.success('Login successful', {
          description: 'Welcome back!',
        });
        navigate('/');
      } else {
        toast.error('Login failed', {
          description: 'Please check your credentials',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred', {
        description: 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Welcome Back
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to continue to your workspace
        </p>
      </motion.div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-muted shadow-sm rounded-xl focus:border-indigo-500 transition-all"
                        {...field}
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link to="/auth/forgot-password" className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
                            Forgot password?
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset your password</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-muted shadow-sm rounded-xl focus:border-indigo-500 transition-all"
                        {...field}
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? 
                          <EyeOff className="h-5 w-5" /> : 
                          <Eye className="h-5 w-5" />
                        }
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div variants={item}>
            <Button 
              type="submit" 
              className="w-full font-medium h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 rounded-xl shadow-md transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign in</span>
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
      
      <motion.div variants={item} className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full bg-muted/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-3 text-muted-foreground">Or</span>
        </div>
      </motion.div>
      
      <motion.div variants={item} className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            to="/auth/register" 
            className="text-indigo-500 font-medium inline-flex items-center gap-1 hover:text-indigo-600 transition-colors"
          >
            Create an account <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
