import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
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

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(values.email, values.password);

      if (result.success) {
        toast.success('Welcome back! Setting up your experience...');
        navigate('/');
      } else {
        const errorMessage = result.error || 'Login failed. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
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

  return (
    <>
      <div className='space-y-2 text-center lg:text-left animate-fade-in'>
        <h2 className='text-2xl lg:text-3xl font-bold text-black'>Sign in to your account</h2>
        <p className='text-[rgb(var(--text-secondary))]'>
          Enter your details to access your dashboard
        </p>
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
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black! form-label'>Email address</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='you@example.com'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange();
                    }}
                    className='bg-white! text-black! form-input'
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className='text-sm text-red-600' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-black! form-label'>Password</FormLabel>
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

          <div className='text-right'>
            <button
              type='button'
              onClick={() => navigate('/forgot-password')}
              className='auth-link text-sm'
            >
              Forgot password?
            </button>
          </div>

          <Button type='submit' disabled={isLoading} className='form-button w-full'>
            {isLoading ? (
              <div className='flex items-center justify-center space-x-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </Button>

          <div className='text-center'>
            <p className='text-sm text-[rgb(var(--text-secondary))]'>
              Don't have an account?{' '}
              <a href='/register' className='auth-link'>
                Create one now
              </a>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
}
