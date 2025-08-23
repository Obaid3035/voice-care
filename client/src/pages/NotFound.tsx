import { Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex items-center justify-center bg-[rgb(var(--background))] p-4'>
      <div className='w-full max-w-lg'>
        {/* Main 404 Card */}
        <Card className='text-center shadow-xl border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
          <CardHeader className='space-y-6 pb-8'>
            {/* 404 Number with gradient */}
            <div className='relative'>
              <h1 className='text-8xl font-bold bg-gradient-to-r from-[rgb(var(--primary))] to-blue-600 bg-clip-text text-transparent'>
                404
              </h1>
              <div className='absolute -top-2 -right-2 w-6 h-6 bg-[rgb(var(--primary))] rounded-full opacity-20' />
              <div className='absolute -bottom-2 -left-2 w-4 h-4 bg-blue-600 rounded-full opacity-20' />
            </div>

            {/* Icon */}
            <div className='mx-auto w-20 h-20 bg-gradient-to-br from-[rgb(var(--primary))] to-blue-600 rounded-2xl flex items-center justify-center shadow-lg'>
              <Search className='w-10 h-10 text-white' />
            </div>

            <div className='space-y-2'>
              <CardTitle className='text-2xl font-bold text-[rgb(var(--text-primary))]'>
                Page Not Found
              </CardTitle>
              <CardDescription className='text-[rgb(var(--text-secondary))] text-base'>
                Oops! The page you're looking for seems to have wandered off.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className='space-y-6 pb-8'>
            <p className='text-[rgb(var(--text-secondary))] max-w-sm mx-auto'>
              Don't worry, you can always find your way back to the dashboard where everything is
              organized and ready for you.
            </p>

            <div className='flex flex-col sm:flex-row gap-3 max-w-xs mx-auto'>
              <Button
                onClick={() => navigate('/dashboard')}
                className='flex-1 bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-dark))] text-white font-semibold h-12 rounded-lg transition-colors focus:ring-2 focus:ring-[rgb(var(--ring))]/20'
              >
                <Home className='w-4 h-4 mr-2' />
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Decorative elements */}
        <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-[rgb(var(--primary))] rounded-full opacity-30 animate-pulse' />
        <div className='absolute top-1/3 right-1/4 w-1 h-1 bg-blue-600 rounded-full opacity-40 animate-pulse delay-1000' />
        <div className='absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[rgb(var(--primary))] rounded-full opacity-25 animate-pulse delay-500' />
      </div>
    </div>
  );
}
