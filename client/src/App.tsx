import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { PlayQueueProvider } from '@/hooks/usePlayQueue';
import { RecordingProvider } from '@/hooks/useRecordingContext';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Login from '@/pages/auth/Login';
import ResetPassword from '@/pages/auth/ResetPassword';
import Register from '@/pages/auth/register';
import Dashboard from '@/pages/dashboard';
import ContentLibrary from '@/pages/dashboard/content';
import DeviceManagement from '@/pages/dashboard/devices';
import EventLogs from '@/pages/dashboard/logs';
import SettingsPage from '@/pages/dashboard/settings';
import VoiceClone from '@/pages/dashboard/voice';
import NotFound from '@/pages/NotFound';
import Onboarding from '@/pages/onboarding';
import { AuthLayout } from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import Loading from './components/shared/loading';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (needsOnboarding) {
    return <Navigate to='/onboarding' replace />;
  }

  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!needsOnboarding) {
    return <Navigate to='/dashboard' replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  // Allow reset password page even when authenticated (for password recovery)
  if (isAuthenticated && window.location.pathname !== '/reset-password') {
    // Redirect to onboarding if needed, otherwise dashboard
    return <Navigate to={needsOnboarding ? '/onboarding' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}

function Home() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (needsOnboarding) {
    return <Navigate to='/onboarding' replace />;
  }

  return <Navigate to='/dashboard' replace />;
}

function AppContent() {
  return (
    <Routes>
      <Route
        path='/login'
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path='/register'
        element={
          <PublicRoute>
            <AuthLayout>
              <Register />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path='/forgot-password'
        element={
          <PublicRoute>
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path='/reset-password'
        element={
          <PublicRoute>
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        path='/onboarding'
        element={
          <OnboardingRoute>
            <Onboarding />
          </OnboardingRoute>
        }
      />

      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/content'
        element={
          <ProtectedRoute>
            <ContentLibrary />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/logs'
        element={
          <ProtectedRoute>
            <EventLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/devices'
        element={
          <ProtectedRoute>
            <DeviceManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path='/dashboard/voice'
        element={
          <ProtectedRoute>
            <VoiceClone />
          </ProtectedRoute>
        }
      />
      <Route
        path='/dashboard/settings'
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route path='/' element={<Home />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <RecordingProvider>
      <PlayQueueProvider>
        <AppContent />
        <Toaster />
      </PlayQueueProvider>
    </RecordingProvider>
  );
}

export default App;
