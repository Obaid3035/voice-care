import { Monitor, Moon, Settings, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Light mode' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark mode' },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
      description: 'Follow system preference',
    },
  ];

  return (
    <DashboardLayout>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-[rgb(var(--text-primary))]'>Settings</h1>
        <p className='mt-1 text-[rgb(var(--text-secondary))]'>
          Configure your account and application preferences.
        </p>
      </div>

      <div className='space-y-6'>
        {/* Theme Settings */}
        <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
          <CardHeader>
            <CardTitle className='text-[rgb(var(--text-primary))] flex items-center gap-2'>
              <Settings className='h-5 w-5' />
              Appearance
            </CardTitle>
            <CardDescription className='text-[rgb(var(--text-secondary))]'>
              Customize how the application looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-[rgb(var(--text-primary))] mb-3'>Theme</h3>
                <div className='grid grid-cols-3 gap-3'>
                  {themeOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? 'default' : 'outline'}
                      onClick={() => setTheme(option.value)}
                      className={`h-20 flex flex-col items-center gap-2 ${
                        theme === option.value
                          ? 'bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-dark))]'
                          : 'text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
                      }`}
                    >
                      <option.icon className='h-5 w-5' />
                      <div className='text-center'>
                        <div className='text-sm font-medium'>{option.label}</div>
                        <div className='text-xs opacity-70'>{option.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className='border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
          <CardHeader>
            <CardTitle className='text-[rgb(var(--text-primary))] flex items-center gap-2'>
              <User className='h-5 w-5' />
              Account
            </CardTitle>
            <CardDescription className='text-[rgb(var(--text-secondary))]'>
              Manage your account information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-[rgb(var(--text-primary))]'>
                    Profile Information
                  </p>
                  <p className='text-sm text-[rgb(var(--text-secondary))]'>
                    Update your profile details and preferences
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
                >
                  Edit Profile
                </Button>
              </div>
              <Separator className='bg-[rgb(var(--border))]' />
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-[rgb(var(--text-primary))]'>
                    Change Password
                  </p>
                  <p className='text-sm text-[rgb(var(--text-secondary))]'>
                    Update your account password
                  </p>
                </div>
                <Button
                  variant='outline'
                  className='text-[rgb(var(--text-primary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--accent))]/10'
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
