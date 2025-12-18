import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useRelease } from '../context/ReleaseContext';
import { Plus, Archive, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function ReleasesPage() {
  const { releases, createRelease } = useRelease();
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    repo: 'microsoft/PowerToys',
    targetBranch: '',
    version: '',
  });

  const handleCreate = () => {
    createRelease(formData);
    setShowCreate(false);
    setFormData({ name: '', repo: 'microsoft/PowerToys', targetBranch: '', version: '' });
  };

  const activeReleases = releases.filter((r) => r.status === 'active');
  const archivedReleases = releases.filter((r) => r.status === 'archived');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Release Management</h1>
          <p className="text-gray-600">Create and manage release tracks</p>
        </div>
        
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4" />
              New Release
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Release</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Release Name</Label>
                <Input
                  id="name"
                  placeholder="0.99.x Release"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repo">Repository</Label>
                <Select value={formData.repo} onValueChange={(value) => setFormData({ ...formData, repo: value })}>
                  <SelectTrigger id="repo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="microsoft/PowerToys">microsoft/PowerToys</SelectItem>
                    <SelectItem value="microsoft/terminal">microsoft/terminal</SelectItem>
                    <SelectItem value="microsoft/vscode">microsoft/vscode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetBranch">Target Branch</Label>
                <Input
                  id="targetBranch"
                  placeholder="release/0.99"
                  value={formData.targetBranch}
                  onChange={(e) => setFormData({ ...formData, targetBranch: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  placeholder="0.99.0"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Create Release
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Releases */}
      <div className="space-y-4">
        <h2 className="text-gray-900">Active Releases ({activeReleases.length})</h2>
        
        <div className="grid gap-4">
          {activeReleases.map((release) => (
            <Card key={release.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div>
                    <Link
                      to={`/releases/${release.id}`}
                      className="text-xl text-gray-900 hover:text-blue-600"
                    >
                      {release.name}
                    </Link>
                    <div className="text-sm text-gray-600 mt-1">
                      {release.repo} • {release.targetBranch}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-sm text-gray-600">Version</div>
                      <div className="text-gray-900">v{release.version}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Sessions</div>
                      <div className="text-gray-900">{release.sessions.length}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Created</div>
                      <div className="text-gray-900">
                        {formatDistanceToNow(release.createdAt, { addSuffix: true })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Last Updated</div>
                      <div className="text-gray-900">
                        {formatDistanceToNow(release.updatedAt, { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Link to={`/releases/${release.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {activeReleases.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">No active releases yet</p>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create First Release
            </Button>
          </Card>
        )}
      </div>

      {/* Archived Releases */}
      {archivedReleases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-gray-900">Archived Releases ({archivedReleases.length})</h2>
          
          <div className="grid gap-4">
            {archivedReleases.map((release) => (
              <Card key={release.id} className="p-6 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xl text-gray-700">{release.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {release.repo} • {release.targetBranch} • v{release.version}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-gray-200 text-gray-700 border-gray-300">
                    Archived
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
