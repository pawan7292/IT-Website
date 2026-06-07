import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import { PageLoader } from './components/shared/LoadingSpinner';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Submissions from './pages/Submissions';
import Attendance from './pages/Attendance';
import Updates from './pages/Updates';
import SOPs from './pages/SOPs';
import Team from './pages/Team';
import MemberProfile from './pages/MemberProfile';

// Route guards
function ProtectedRoute() {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (userProfile !== null && userProfile.profileComplete === false) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}

function AuthRoute() {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user) {
    if (userProfile !== null && userProfile.profileComplete === false) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

function OnboardingRoute() {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (userProfile?.profileComplete === true) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthRoute />,
    children: [{ index: true, element: <Login /> }],
  },
  {
    path: '/onboarding',
    element: <OnboardingRoute />,
    children: [{ index: true, element: <Onboarding /> }],
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard',   element: <Dashboard /> },
          { path: 'tasks',       element: <Tasks /> },
          { path: 'reports',     element: <Reports /> },
          { path: 'submissions', element: <Submissions /> },
          { path: 'attendance',  element: <Attendance /> },
          { path: 'updates',     element: <Updates /> },
          { path: 'sops',        element: <SOPs /> },
          { path: 'team',        element: <Team /> },
          { path: 'team/:uid',   element: <MemberProfile /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

function AppInner() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#e5e7eb',
            border: '1px solid #374151',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
