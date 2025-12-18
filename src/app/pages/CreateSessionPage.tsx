import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useRelease } from '../context/ReleaseContext';

export function CreateSessionPage() {
  const { releaseId } = useParams<{ releaseId: string }>();
  const navigate = useNavigate();
  const { releases, createSession } = useRelease();
  
  const release = releases.find((r) => r.id === releaseId);
  
  const [formData, setFormData] = useState({
    name: '',
    useLatestTag: true,
    baseRef: '',
    headRef: 'HEAD',
    normalizeBy: 'pr',
    outputLanguage: 'english',
    strictMode: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!releaseId) return;

    const session = createSession(releaseId, {
      name: formData.name || `Session ${new Date().toLocaleString()}`,
      baseRef: formData.baseRef,
      headRef: formData.headRef,
    });

    navigate(`/releases/${releaseId}/sessions/${session.id}/changes`);
  };

  if (!release) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Release not found</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link to="/releases" className="hover:text-blue-600">Releases</Link>
          <span>/</span>
          <Link to={`/releases/${releaseId}`} className="hover:text-blue-600">{release.name}</Link>
          <span>/</span>
          <span>New Session</span>
        </div>
        <h1 className="text-gray-900 mb-2">Create New Session</h1>
        <p className="text-gray-600">
          Select a change range. We'll normalize changes by PR and generate all outputs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Session Info */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Session Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Session Name (optional)</Label>
                <Input
                  id="name"
                  placeholder="e.g., Post-merge update, Final review"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <p className="text-xs text-gray-500">Leave empty to auto-generate based on timestamp</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="text-sm text-gray-600">Release Target</div>
                <div className="text-gray-900">{release.targetBranch}</div>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Range */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Change Range</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useLatestTag"
                  checked={formData.useLatestTag}
                  onCheckedChange={(checked) => setFormData({ ...formData, useLatestTag: !!checked })}
                />
                <Label htmlFor="useLatestTag" className="cursor-pointer">
                  Use latest release tag as base
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseRef">Base (tag/commit/branch)</Label>
                  <Input
                    id="baseRef"
                    placeholder="v0.97.0"
                    value={formData.baseRef}
                    onChange={(e) => setFormData({ ...formData, baseRef: e.target.value })}
                    disabled={formData.useLatestTag}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="headRef">Head (commit/branch)</Label>
                  <Input
                    id="headRef"
                    placeholder="HEAD"
                    value={formData.headRef}
                    onChange={(e) => setFormData({ ...formData, headRef: e.target.value })}
                  />
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <strong>Note:</strong> This will start a long-running job that parses changes, generates release notes, 
                analyzes hotspots, and creates a test plan. You can monitor progress from the dashboard.
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Generation Options</h3>
              
              <div className="space-y-3">
                <Label>Normalize by</Label>
                <RadioGroup
                  value={formData.normalizeBy}
                  onValueChange={(value) => setFormData({ ...formData, normalizeBy: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pr" id="pr" />
                    <Label htmlFor="pr" className="cursor-pointer">PR (recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="commit" id="commit" />
                    <Label htmlFor="commit" className="cursor-pointer">Commit</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Output language</Label>
                <Select value={formData.outputLanguage} onValueChange={(value) => setFormData({ ...formData, outputLanguage: value })}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="bilingual">Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="strictMode"
                  checked={formData.strictMode}
                  onCheckedChange={(checked) => setFormData({ ...formData, strictMode: !!checked })}
                />
                <Label htmlFor="strictMode" className="cursor-pointer">
                  Strict mode: Commits without PR go to Needs Review
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Generation
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/releases/${releaseId}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
