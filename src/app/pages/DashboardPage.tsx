import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useRelease } from '../context/ReleaseContext';
import { Activity, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function DashboardPage() {
  const { releases, getRunningJobs } = useRelease();
  const runningJobs = getRunningJobs();
  const activeReleases = releases.filter((r) => r.status === 'active');

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'parse-changes': 'Parsing Changes',
      'generate-notes': 'Generating Notes',
      'analyze-hotspots': 'Analyzing Hotspots',
      'generate-testplan': 'Generating Test Plan',
    };
    return labels[type] || type;
  };

  const getSessionStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700 border-gray-300',
      generating: 'bg-blue-100 text-blue-700 border-blue-300',
      ready: 'bg-green-100 text-green-700 border-green-300',
      exported: 'bg-purple-100 text-purple-700 border-purple-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of all releases and running jobs</p>
      </div>

      {/* Running Jobs */}
      {runningJobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <h2 className="text-gray-900">Running Jobs ({runningJobs.length})</h2>
          </div>
          
          <div className="grid gap-4">
            {runningJobs.map(({ release, session, job }) => (
              <Card key={job.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          to={`/releases/${release.id}/sessions/${session.id}/changes`}
                          className="text-gray-900 hover:text-blue-600"
                        >
                          {getJobTypeLabel(job.type)}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1">
                          {release.name} • {session.name}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Running
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  </div>
                  
                  <Link to={`/releases/${release.id}/sessions/${session.id}/changes`}>
                    <Button variant="ghost" size="sm">
                      View Session
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-2xl text-gray-900 mb-1">{activeReleases.length}</div>
          <div className="text-sm text-gray-600">Active Releases</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl text-gray-900 mb-1">
            {activeReleases.reduce((sum, r) => sum + r.sessions.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl text-gray-900 mb-1">{runningJobs.length}</div>
          <div className="text-sm text-gray-600">Running Jobs</div>
        </Card>
        <Card className="p-6">
          <div className="text-2xl text-gray-900 mb-1">
            {activeReleases.reduce(
              (sum, r) => sum + r.sessions.filter((s) => s.status === 'ready').length,
              0
            )}
          </div>
          <div className="text-sm text-gray-600">Ready Sessions</div>
        </Card>
      </div>

      {/* Active Releases */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900">Active Releases</h2>
          <Link to="/releases">
            <Button variant="outline" size="sm">
              Manage Releases
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {activeReleases.map((release) => {
            const latestSession = release.sessions[release.sessions.length - 1];
            const completedJobs = latestSession?.jobs.filter((j) => j.status === 'completed').length || 0;
            const totalJobs = latestSession?.jobs.length || 0;

            return (
              <Card key={release.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <Link
                        to={`/releases/${release.id}`}
                        className="text-xl text-gray-900 hover:text-blue-600"
                      >
                        {release.name}
                      </Link>
                      <div className="text-sm text-gray-600 mt-1">
                        {release.repo} • {release.targetBranch} • v{release.version}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Sessions</div>
                        <div className="text-lg text-gray-900">{release.sessions.length}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Latest Session</div>
                        <div className="text-lg text-gray-900">
                          {latestSession ? (
                            <Badge variant="outline" className={getSessionStatusColor(latestSession.status)}>
                              {latestSession.status}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">None</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Job Progress</div>
                        <div className="text-lg text-gray-900">
                          {completedJobs}/{totalJobs}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Last Updated</div>
                        <div className="text-lg text-gray-900">
                          {formatDistanceToNow(release.updatedAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>

                    {latestSession && (
                      <div className="flex gap-2 pt-2 border-t border-gray-200">
                        {latestSession.jobs.map((job) => (
                          <div key={job.id} className="flex items-center gap-1">
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
                    )}
                  </div>

                  <Link to={`/releases/${release.id}`}>
                    <Button variant="outline">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {activeReleases.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No active releases yet</p>
            <Link to="/releases">
              <Button>Create First Release</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
