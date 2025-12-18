import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ReleasesPage } from './pages/ReleasesPage';
import { ReleaseDetailPage } from './pages/ReleaseDetailPage';
import { CreateSessionPage } from './pages/CreateSessionPage';
import { SessionChangesPage } from './pages/SessionChangesPage';
import { SessionReleaseNotesPage } from './pages/SessionReleaseNotesPage';
import { SessionHotspotsPage } from './pages/SessionHotspotsPage';
import { SessionTestPlanPage } from './pages/SessionTestPlanPage';
import { SessionExportsPage } from './pages/SessionExportsPage';
import { ReleaseProvider } from './context/ReleaseContext';

export default function App() {
  return (
    <ReleaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="releases" element={<ReleasesPage />} />
            <Route path="releases/:releaseId" element={<ReleaseDetailPage />} />
            <Route path="releases/:releaseId/new-session" element={<CreateSessionPage />} />
            <Route path="releases/:releaseId/sessions/:sessionId/changes" element={<SessionChangesPage />} />
            <Route path="releases/:releaseId/sessions/:sessionId/release-notes" element={<SessionReleaseNotesPage />} />
            <Route path="releases/:releaseId/sessions/:sessionId/hotspots" element={<SessionHotspotsPage />} />
            <Route path="releases/:releaseId/sessions/:sessionId/test-plan" element={<SessionTestPlanPage />} />
            <Route path="releases/:releaseId/sessions/:sessionId/exports" element={<SessionExportsPage />} />
            {/* Redirect old routes to dashboard */}
            <Route path="changes" element={<Navigate to="/" replace />} />
            <Route path="release-notes" element={<Navigate to="/" replace />} />
            <Route path="hotspots" element={<Navigate to="/" replace />} />
            <Route path="test-plan" element={<Navigate to="/" replace />} />
            <Route path="exports" element={<Navigate to="/" replace />} />
            <Route path="create-draft" element={<Navigate to="/releases" replace />} />
            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReleaseProvider>
  );
}