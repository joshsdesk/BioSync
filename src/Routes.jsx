import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import FloatingActionButton from './components/FloatingActionButton';
import AuthProvider from './contexts/AuthContext';

// Pages
import Dashboard from './pages/dashboard';
import VideoCapture from './pages/video-capture';
import VideoUpload from './pages/video-upload';
import AnalysisResults from './pages/analysis-results';
import SessionHistory from './pages/session-history';
import AICoach from './pages/ai-coach';
import AuthPage from './pages/auth';
import Settings from './pages/settings';
import Preferences from './pages/preferences';
import Biometrics from './pages/biometrics';
import WorkoutSchedule from './pages/workout-schedule';
import NotFound from './pages/NotFound';

import Header from './components/ui/Header';

/**
 * Routes Component
 * Defines the main application routing structure and layout wrappers.
 * Includes global providers, error barriers, and navigation elements.
 */
const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Header />
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/video-capture" element={<VideoCapture />} />
            <Route path="/video-upload" element={<VideoUpload />} />
            <Route path="/analysis-results" element={<AnalysisResults />} />
            <Route path="/session-history" element={<SessionHistory />} />
            <Route path="/ai-coach" element={<AICoach />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="/biometrics" element={<Biometrics />} />
            <Route path="/workout-schedule" element={<WorkoutSchedule />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
          <FloatingActionButton />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;