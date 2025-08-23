import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
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
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword(values.email);

      if (result.success) {
        setIsSuccess(true);
        toast.success('Password reset email sent! Check your inbox.');
      } else {
        const errorMessage = result.error || 'Failed to send reset email. Please try again.';
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

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <>
        <div className='space-y-2 text-center lg:text-left animate-fade-in'>
          <div className='flex items-center justify-center lg:justify-start mb-4'>
            <CheckCircle className='w-8 h-8 text-green-600 mr-2' />
            <h2 className='text-2xl lg:text-3xl font-bold text-black'>Check your email</h2>
          </div>
          <p className='text-[rgb(var(--text-secondary))]'>
            We've sent a password reset link to your email address.
          </p>
        </div>

        <div className='space-y-6'>
          <Alert className='border-green-200 bg-green-50 text-green-800'>
            <CheckCircle className='h-4 w-4' />
            <AlertDescription>
              If an account with that email exists, you'll receive a password reset link shortly.
            </AlertDescription>
          </Alert>

          <div className='text-center space-y-4'>
            <p className='text-sm text-[rgb(var(--text-secondary))]'>
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className='space-y-3'>
              <Button
                onClick={() => {
                  setIsSuccess(false);
                  form.reset();
                }}
                variant='outline'
                className='w-full'
              >
                Try again with different email
              </Button>

              <Button onClick={handleBackToLogin} variant='ghost' className='w-full'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to sign in
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='space-y-2 text-center lg:text-left animate-fade-in'>
        <h2 className='text-2xl lg:text-3xl font-bold text-black'>Reset your password</h2>
        <p className='text-[rgb(var(--text-secondary))]'>
          Enter your email address and we'll send you a link to reset your password.
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

          <Button type='submit' disabled={isLoading} className='form-button w-full'>
            {isLoading ? (
              <div className='flex items-center justify-center space-x-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                <span>Sending reset link...</span>
              </div>
            ) : (
              'Send reset link'
            )}
          </Button>

          <div className='text-center'>
            <Button onClick={handleBackToLogin} variant='ghost' className='auth-link'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to sign in
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
