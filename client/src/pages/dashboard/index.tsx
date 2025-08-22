import { Baby } from 'lucide-react';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useAuth } from '@/hooks/useAuth';

function WelcomeBanner() {
  const { user } = useAuth();
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className='relative overflow-hidden rounded-xl bg-gradient-to-r from-[rgb(var(--primary))] to-blue-600 p-6 text-white shadow-lg'>
      <div className='relative z-10'>
        <h1 className='text-2xl font-bold mb-2'>
          {greeting}, {firstName}! 👋
        </h1>
        <p className='text-blue-100 max-w-2xl'>
          Everything looks great today. All your devices are online and your little ones are
          sleeping peacefully. You have 3 new pieces of content generated and ready to deploy.
        </p>
      </div>
      <div className='absolute top-0 right-0 opacity-10'>
        <Baby className='h-32 w-32' />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className='space-y-8'>
      <WelcomeBanner />
      <div>
        <h2 className='text-xl font-semibold text-[rgb(var(--text-primary))] mb-4'>
          System Overview
        </h2>
        <OverviewCards />
      </div>

      <div className='space-y-6'>
        <RecentActivity />
      </div>
    </div>
  );
}
