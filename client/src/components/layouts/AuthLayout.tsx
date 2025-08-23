import { Baby, Mic2, Music } from 'lucide-react';
import { useTheme } from 'next-themes';
import { type ReactNode, useEffect } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme('light');
  }, []);

  return (
    <div
      className='min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-gray-50 w-screen'
      data-theme='light'
    >
      <div className='hidden lg:col-span-6 lg:flex lg:items-center lg:justify-center bg-[#303c6c] relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#303c6c] via-[#4a5a94] to-[#303c6c] opacity-90' />
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          }}
        />

        <div className='relative z-10 max-w-lg space-y-12 p-12 text-center lg:text-left'>
          {/* Logo and brand */}
          <div className='space-y-6'>
            <div className='w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center'>
              <Baby className='w-8 h-8 text-white' />
            </div>
            <div className='space-y-4'>
              <h1 className='text-4xl xl:text-5xl font-bold text-white leading-tight'>
                Welcome to
                <br />
                Voice Care
              </h1>
              <p className='text-xl text-white/80 leading-relaxed'>
                Your smart calming companion for parenting peace of mind.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className='space-y-6'>
            <div className='flex items-center space-x-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/10'>
                <Music className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-white'>Adaptive calming content</h3>
                <p className='text-sm text-white/70'>Personalized music and sounds</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/10'>
                <Baby className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-white'>Smart cry detection</h3>
                <p className='text-sm text-white/70'>AI-powered baby monitoring</p>
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/10'>
                <Mic2 className='h-6 w-6 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-white'>Voice cloning technology</h3>
                <p className='text-sm text-white/70'>Your voice, always available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className='col-span-1 lg:col-span-6 flex min-h-screen items-center justify-center bg-white px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md space-y-8'>
          {/* Mobile header */}
          <div className='text-center lg:hidden space-y-4'>
            <div className='mx-auto w-16 h-16 bg-[#303c6c] rounded-2xl flex items-center justify-center'>
              <Baby className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-[#303c6c]'>Voice Care</h1>
              <p className='text-gray-600'>Your parenting companion</p>
            </div>
          </div>

          {/* Mobile features */}
          <div className='grid grid-cols-3 gap-4 py-6 lg:hidden'>
            <div className='text-center space-y-2'>
              <div className='mx-auto w-12 h-12 bg-[#303c6c]/10 rounded-xl flex items-center justify-center'>
                <Music className='w-5 h-5 text-[#303c6c]' />
              </div>
              <p className='text-xs text-gray-600 font-medium'>Adaptive Music</p>
            </div>
            <div className='text-center space-y-2'>
              <div className='mx-auto w-12 h-12 bg-[#303c6c]/10 rounded-xl flex items-center justify-center'>
                <Baby className='w-5 h-5 text-[#303c6c]' />
              </div>
              <p className='text-xs text-gray-600 font-medium'>Cry Detection</p>
            </div>
            <div className='text-center space-y-2'>
              <div className='mx-auto w-12 h-12 bg-[#303c6c]/10 rounded-xl flex items-center justify-center'>
                <Mic2 className='w-5 h-5 text-[#303c6c]' />
              </div>
              <p className='text-xs text-gray-600 font-medium'>Voice Clone</p>
            </div>
          </div>

          {/* Form content from children */}
          {children}
        </div>
      </div>
    </div>
  );
}
