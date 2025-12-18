import { NavLink, useParams } from 'react-router-dom';
import { Home, FolderKanban, GitBranch, FileText, Activity, CheckSquare, Archive } from 'lucide-react';
import { cn } from '../ui/utils';
import { useRelease } from '../../context/ReleaseContext';

export function Sidebar() {
  const { releaseId, sessionId } = useParams<{ releaseId?: string; sessionId?: string }>();
  const { releases } = useRelease();

  const release = releases.find((r) => r.id === releaseId);
  const session = release?.sessions.find((s) => s.id === sessionId);

  // Show session navigation only when viewing a specific session
  const showSessionNav = releaseId && sessionId;

  const mainNavItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/releases', icon: FolderKanban, label: 'Releases' },
  ];

  const sessionNavItems = showSessionNav ? [
    { to: `/releases/${releaseId}/sessions/${sessionId}/changes`, icon: GitBranch, label: 'Changes' },
    { to: `/releases/${releaseId}/sessions/${sessionId}/release-notes`, icon: FileText, label: 'Release Notes' },
    { to: `/releases/${releaseId}/sessions/${sessionId}/hotspots`, icon: Activity, label: 'Hotspots' },
    { to: `/releases/${releaseId}/sessions/${sessionId}/test-plan`, icon: CheckSquare, label: 'Test Plan' },
    { to: `/releases/${releaseId}/sessions/${sessionId}/exports`, icon: Archive, label: 'Exports' },
  ] : [];

  return (
    <aside className="w-70 bg-white border-r border-gray-200 shrink-0 flex flex-col">
      <div className="flex-1 overflow-auto">
        <nav className="p-4 space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {showSessionNav && (
          <>
            <div className="px-4 py-2">
              <div className="border-t border-gray-200" />
            </div>
            
            <div className="px-4 pb-2">
              <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2">
                Session
              </div>
            </div>

            <nav className="px-4 space-y-1">
              {sessionNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </>
        )}
      </div>

      {session && release && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="truncate">
              <span className="font-medium">Release:</span> {release.name}
            </div>
            <div className="truncate">
              <span className="font-medium">Session:</span> {session.name}
            </div>
            <div className="truncate text-gray-500">
              {session.baseRef}..{session.headRef}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
