import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as z from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { updatePassword, getSession, logout } = useAuth();

  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        setHasValidSession(!!session);
      } catch (error) {
        console.error('Error checking session:', error);
        setHasValidSession(false);
      }
    };

    checkSession();
  }, [getSession]);

  // Auto-redirect to login after successful password reset
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(async () => {
        try {
          await logout();
          navigate('/login');
        } catch (error) {
          console.error('Error during auto-logout:', error);
          navigate('/login');
        }
      }, 3000); // Wait 3 seconds to show success message

      return () => clearTimeout(timer);
    }
  }, [isSuccess, logout, navigate]);

  async function onSubmit(values: ResetPasswordFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updatePassword(values.password);

      if (result.success) {
        setIsSuccess(true);
        toast.success('Password reset successfully! You can now sign in with your new password.');
        // Don't logout here - let the success state handle the redirect
      } else {
        const errorMessage = result.error || 'Failed to reset password. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = () => {
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleBackToLogin = async () => {
    try {
      // Logout the user before redirecting to login
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
    navigate('/login');
  };

  // Show loading while checking session
  if (hasValidSession === null) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-center'>
          <div className='w-6 h-6 border-2 border-[#303c6c]/30 border-t-[#303c6c] rounded-full animate-spin' />
        </div>
        <p className='text-center text-[rgb(var(--text-secondary))]'>Verifying reset link...</p>
      </div>
    );
  }

  // If no valid session, show error
  if (!hasValidSession) {
    return (
      <>
        <div className='space-y-2 text-center lg:text-left animate-fade-in'>
          <h2 className='text-2xl lg:text-3xl font-bold text-black'>Invalid reset link</h2>
          <p className='text-[rgb(var(--text-secondary))]'>
            This password reset link is invalid or has expired.
          </p>
        </div>

        <div className='space-y-6'>
          <Alert className='border-red-200 bg-red-50 text-red-800'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Please request a new password reset link from the login page.
            </AlertDescription>
          </Alert>

          <Button onClick={handleBackToLogin} className='form-button w-full'>
            Back to sign in
          </Button>
        </div>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <div className='space-y-2 text-center lg:text-left animate-fade-in'>
          <h2 className='text-2xl lg:text-3xl font-bold text-black'>
            Password reset successfully!
          </h2>
          <p className='text-[rgb(var(--text-secondary))]'>
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>

        <div className='space-y-6'>
          <Alert className='border-green-200 bg-green-50 text-green-800'>
            <AlertDescription>
              Your password has been successfully reset. You will be automatically redirected to the
              login page in a few seconds.
            </AlertDescription>
          </Alert>

          <Button onClick={handleBackToLogin} className='form-button w-full'>
            Sign in now
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='space-y-2 text-center lg:text-left animate-fade-in'>
        <h2 className='text-2xl lg:text-3xl font-bold text-black'>Set new password</h2>
        <p className='text-[rgb(var(--text-secondary))]'>Enter your new password below.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Error Alert */}
          {error && (
            <Alert
              variant='destructive'
              className='slide-in-from-top-2 border-red-200 bg-red-50 text-red-800'
            >
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black! form-label'>New Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                      className='text-black! bg-white! form-input pr-12'
                      disabled={isLoading}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-secondary))] disabled:opacity-50'
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className='text-sm text-red-600' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black! form-label'>Confirm New Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                      className='text-black! bg-white! form-input pr-12'
                      disabled={isLoading}
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-secondary))] disabled:opacity-50'
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='w-5 h-5' />
                      ) : (
                        <Eye className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className='text-sm text-red-600' />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isLoading} className='form-button w-full'>
            {isLoading ? (
              <div className='flex items-center justify-center space-x-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                <span>Resetting password...</span>
              </div>
            ) : (
              'Reset password'
            )}
          </Button>

          <div className='text-center'>
            <button type='button' onClick={handleBackToLogin} className='auth-link text-sm'>
              Back to sign in
            </button>
          </div>
        </form>
      </Form>
    </>
  );
}
