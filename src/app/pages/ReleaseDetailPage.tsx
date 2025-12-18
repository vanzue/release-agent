import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useRelease } from '../context/ReleaseContext';
import { Plus, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ReleaseDetailPage() {
  const { releaseId } = useParams<{ releaseId: string }>();
  const navigate = useNavigate();
  const { releases } = useRelease();
  
  const release = releases.find((r) => r.id === releaseId);

  if (!release) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Release not found</p>
        <Link to="/releases">
          <Button variant="outline" className="mt-4">Back to Releases</Button>
        </Link>
      </div>
    );
  }

  const getSessionStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 border-gray-300',
      generating: 'bg-blue-100 text-blue-700 border-blue-300',
      ready: 'bg-green-100 text-green-700 border-green-300',
      exported: 'bg-purple-100 text-purple-700 border-purple-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'parse-changes': 'Parse Changes',
      'generate-notes': 'Generate Notes',
      'analyze-hotspots': 'Analyze Hotspots',
      'generate-testplan': 'Generate Test Plan',
    };
    return labels[type] || type;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link to="/releases" className="hover:text-blue-600">Releases</Link>
          <span>/</span>
          <span>{release.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">{release.name}</h1>
            <p className="text-gray-600 mt-1">
              {release.repo} • {release.targetBranch} • v{release.version}
            </p>
          </div>
          <Button
            onClick={() => navigate(`/releases/${releaseId}/new-session`)}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-2xl text-gray-900 mb-1">{release.sessions.length}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl text-gray-900 mb-1">
            {release.sessions.filter((s) => s.status === 'ready').length}
          </div>
          <div className="text-sm text-gray-600">Ready</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl text-gray-900 mb-1">
            {release.sessions.filter((s) => s.status === 'generating').length}
          </div>
          <div className="text-sm text-gray-600">Generating</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl text-gray-900 mb-1">
            {release.sessions.filter((s) => s.status === 'exported').length}
          </div>
          <div className="text-sm text-gray-600">Exported</div>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        <h2 className="text-gray-900">Sessions ({release.sessions.length})</h2>
        
        {release.sessions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No sessions yet</p>
            <Button
              onClick={() => navigate(`/releases/${releaseId}/new-session`)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Create First Session
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {[...release.sessions].reverse().map((session) => {
              const completedJobs = session.jobs.filter((j) => j.status === 'completed').length;
              const totalJobs = session.jobs.length;
              const runningJob = session.jobs.find((j) => j.status === 'running');

              return (
                <Card key={session.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            to={`/releases/${releaseId}/sessions/${session.id}/changes`}
                            className="text-lg text-gray-900 hover:text-blue-600"
                          >
                            {session.name}
                          </Link>
                          <div className="text-sm text-gray-600 mt-1">
                            {session.baseRef}..{session.headRef} • {formatDistanceToNow(session.createdAt, { addSuffix: true })}
                          </div>
                        </div>
                        <Badge variant="outline" className={getSessionStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>

                      {/* Job Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Job Progress</span>
                          <span className="text-gray-900">
                            {completedJobs}/{totalJobs} completed
                          </span>
                        </div>
                        <Progress value={(completedJobs / totalJobs) * 100} className="h-2" />
                      </div>

                      {/* Running Job */}
                      {runningJob && (
                        <div className="flex items-center gap-2 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
                          <span className="text-blue-700">
                            {getJobTypeLabel(runningJob.type)} in progress ({runningJob.progress}%)
                          </span>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex gap-6 pt-2 border-t border-gray-200">
                        <div>
                          <div className="text-sm text-gray-600">Changes</div>
                          <div className="text-gray-900">{session.stats.changeCount}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Release Notes</div>
                          <div className="text-gray-900">{session.stats.releaseNotesCount}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Hotspots</div>
                          <div className="text-gray-900">{session.stats.hotspotsCount}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Test Cases</div>
                          <div className="text-gray-900">{session.stats.testCasesCount}</div>
                        </div>
                      </div>

                      {/* Job Status Icons */}
                      <div className="flex gap-3">
                        {session.jobs.map((job) => (
                          <div key={job.id} className="flex items-center gap-1.5">
                            {job.status === 'completed' && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                            {job.status === 'running' && (
                              <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
                            )}
                            {job.status === 'failed' && (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            {job.status === 'pending' && (
                              <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                            )}
                            <span className="text-xs text-gray-600">{getJobTypeLabel(job.type)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link to={`/releases/${releaseId}/sessions/${session.id}/changes`}>
                      <Button variant="outline">
                        Open Session
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
