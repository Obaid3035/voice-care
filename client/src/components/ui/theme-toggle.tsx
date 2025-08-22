import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-9 w-9 text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--accent))]/10'
        >
          <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='bg-[rgb(var(--overlay))] border-[rgb(var(--border))]'
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10 cursor-pointer ${
            theme === 'light' ? 'bg-[rgb(var(--accent))]/20' : ''
          }`}
        >
          <Sun className='mr-2 h-4 w-4' />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10 cursor-pointer ${
            theme === 'dark' ? 'bg-[rgb(var(--accent))]/20' : ''
          }`}
        >
          <Moon className='mr-2 h-4 w-4' />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10 cursor-pointer ${
            theme === 'system' ? 'bg-[rgb(var(--accent))]/20' : ''
          }`}
        >
          <Monitor className='mr-2 h-4 w-4' />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
