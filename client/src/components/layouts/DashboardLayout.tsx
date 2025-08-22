import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const getBreadcrumbItems = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const items = paths.map((path) => ({
    label: path.charAt(0).toUpperCase() + path.slice(1),
    href: `/${paths.slice(0, paths.indexOf(path) + 1).join('/')}`,
  }));

  return items;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full bg-[rgb(var(--background-secondary))]'>
        <AppSidebar />
        <SidebarInset className='flex flex-1 flex-col w-full'>
          <header className='flex h-16 shrink-0 items-center gap-2 border-b border-[rgb(var(--border))] bg-[rgb(var(--background))]'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1 text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--accent))]/10' />
              <Separator
                orientation='vertical'
                className='mr-2 bg-[rgb(var(--border))] data-[orientation=vertical]:h-4'
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={item.href}>
                      <BreadcrumbItem>
                        {index === breadcrumbItems.length - 1 ? (
                          <BreadcrumbPage className='text-[rgb(var(--text-primary))]'>
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={item.href}
                            className='text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--primary))]'
                          >
                            {item.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbItems.length - 1 && (
                        <BreadcrumbSeparator className='text-[rgb(var(--text-secondary))]' />
                      )}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <main className='flex-1 overflow-y-auto bg-[rgb(var(--background))] p-6 w-full'>
            <div className='w-full max-w-none'>{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
