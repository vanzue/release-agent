import { useParams, Link } from 'react-router-dom';
import { useRelease } from '../context/ReleaseContext';
import { ReleaseNotesPage } from './ReleaseNotesPage';

export function SessionReleaseNotesPage() {
  const { releaseId, sessionId } = useParams<{ releaseId: string; sessionId: string }>();
  const { releases } = useRelease();

  const release = releases.find((r) => r.id === releaseId);
  const session = release?.sessions.find((s) => s.id === sessionId);

  if (!session || !release) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Session not found</p>
        <Link to="/releases">
          <button className="mt-4 text-blue-600 hover:underline">Back to Releases</button>
        </Link>
      </div>
    );
  }

  return <ReleaseNotesPage />;
}
