import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { AppProvider } from '@/lib/AppContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Public page
import Landing from './pages/Landing';

// Protected pages
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ResumeManager from './pages/ResumeManager';
import JobAnalyzer from './pages/JobAnalyzer';
import MatchScore from './pages/MatchScore';
import ResumeOptimization from './pages/ResumeOptimization';
import CoverLetter from './pages/CoverLetter';
import LinkedInOptimizer from './pages/LinkedInOptimizer';
import SkillsGap from './pages/SkillsGap';
import ApplicationTracker from './pages/ApplicationTracker';
import ProfileSettings from './pages/ProfileSettings';
import NewApplication from './pages/NewApplication';
import ResumeBuilder from './pages/ResumeBuilder';
import DocumentCenter from './pages/DocumentCenter';
import ApplicationWorkspace from './pages/ApplicationWorkspace';
import AnalysisDashboard from './pages/AnalysisDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resumes" element={<ResumeManager />} />
          <Route path="/job-analyzer" element={<JobAnalyzer />} />
          <Route path="/match-score" element={<MatchScore />} />
          <Route path="/resume-optimization" element={<ResumeOptimization />} />
          <Route path="/cover-letter" element={<CoverLetter />} />
          <Route path="/linkedin" element={<LinkedInOptimizer />} />
          <Route path="/skills-gap" element={<SkillsGap />} />
          <Route path="/tracker" element={<ApplicationTracker />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/new-application" element={<NewApplication />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/document-center" element={<DocumentCenter />} />
          <Route path="/application-workspace" element={<ApplicationWorkspace />} />
          <Route path="/analysis-dashboard" element={<AnalysisDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        </QueryClientProvider>
      </AppProvider>
    </AuthProvider>
  )
}

export default App