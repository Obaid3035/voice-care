import {
  Baby,
  Bell,
  ChevronUp,
  LayoutDashboard,
  LogOut,
  Mic2,
  Monitor,
  Moon,
  PlayCircle,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '../contexts/AuthContext';

const mainNav = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    variant: 'default',
  },
  {
    title: 'Content Library',
    href: '/dashboard/content',
    icon: PlayCircle,
    variant: 'ghost',
  },
  {
    title: 'Event Log',
    href: '/dashboard/logs',
    icon: Bell,
    variant: 'ghost',
  },
];

const deviceNav = [
  {
    title: 'Device Management',
    href: '/dashboard/devices',
    icon: Baby,
    variant: 'ghost',
  },
];

const settingsNav = [
  {
    title: 'Voice Clone',
    href: '/dashboard/voice',
    icon: Mic2,
    variant: 'ghost',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    variant: 'ghost',
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <Sidebar className='border-r border-[rgb(var(--border))] bg-[rgb(var(--background))] '>
      <SidebarHeader className='border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
        <div className='flex flex-col items-center justify-center gap-2'>
          <Baby className='h-8 w-8 text-[rgb(var(--primary))]' />
          <span className='text-lg font-semibold text-[rgb(var(--text-primary))]'>Voice Care</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <div className='px-3 py-2'>
            <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight text-[rgb(var(--text-primary))]'>
              Main
            </h2>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Button
                  variant={location.pathname === item.href ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-2 ${
                    location.pathname === item.href
                      ? 'bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-dark))]'
                      : 'text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10'
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className='h-5 w-5' />
                  {item.title}
                </Button>
              </SidebarMenuItem>
            ))}
          </div>

          <div className='px-3 py-2'>
            <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight text-[rgb(var(--text-primary))]'>
              Devices
            </h2>
            {deviceNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Button
                  variant={location.pathname === item.href ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-2 ${
                    location.pathname === item.href
                      ? 'bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-dark))]'
                      : 'text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10'
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className='h-5 w-5' />
                  {item.title}
                </Button>
              </SidebarMenuItem>
            ))}
          </div>

          <div className='px-3 py-2'>
            <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight text-[rgb(var(--text-primary))]'>
              Settings
            </h2>
            {settingsNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Button
                  variant={location.pathname === item.href ? 'default' : 'ghost'}
                  className={`w-full justify-start gap-2 ${
                    location.pathname === item.href
                      ? 'bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-dark))]'
                      : 'text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10'
                  }`}
                  onClick={() => navigate(item.href)}
                >
                  <item.icon className='h-5 w-5' />
                  {item.title}
                </Button>
              </SidebarMenuItem>
            ))}
          </div>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='border-t border-[rgb(var(--border))] bg-[rgb(var(--background))] p-3'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='w-full justify-start gap-3 p-3 h-auto text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10'
            >
              <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[rgb(var(--primary))]'>
                <User className='h-5 w-5 text-white' />
              </div>
              <div className='flex-1 text-left'>
                <p className='text-sm font-medium'>{user?.name || 'User'}</p>
                <p className='text-xs text-[rgb(var(--text-secondary))]'>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
              <ChevronUp className='h-4 w-4 text-[rgb(var(--text-secondary))]' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side='top'
            align='center'
            className='w-56 bg-[rgb(var(--overlay))] border-[rgb(var(--border))]'
          >
            <div className='px-2 py-1.5'>
              <p className='text-sm font-medium text-[rgb(var(--text-primary))]'>
                {user?.name || 'User'}
              </p>
              <p className='text-xs text-[rgb(var(--text-secondary))]'>
                {user?.email || 'user@example.com'}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className={`text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10 cursor-pointer ${
                theme === 'light' ? 'bg-[rgb(var(--accent))]/20' : ''
              }`}
            >
              <Sun className='mr-2 h-4 w-4' />
              <span>Light Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className={`text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10 cursor-pointer ${
                theme === 'dark' ? 'bg-[rgb(var(--accent))]/20' : ''
              }`}
            >
              <Moon className='mr-2 h-4 w-4' />
              <span>Dark Theme</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('system')}
              className={`text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10 cursor-pointer ${
                theme === 'system' ? 'bg-[rgb(var(--accent))]/20' : ''
              }`}
            >
              <Monitor className='mr-2 h-4 w-4' />
              <span>System Theme</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className='text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer'
            >
              <LogOut className='mr-2 h-4 w-4' />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
