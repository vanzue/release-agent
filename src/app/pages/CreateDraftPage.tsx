import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Progress } from '../components/ui/progress';
import { useDraft } from '../context/DraftContext';

export function CreateDraftPage() {
  const navigate = useNavigate();
  const { draft, generateDraft } = useDraft();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    repo: 'microsoft/PowerToys',
    targetBranch: 'release/0.97',
    useLatestTag: true,
    baseRef: 'v0.97.0',
    headRef: 'HEAD',
    normalizeBy: 'pr',
    outputLanguage: 'english',
    strictMode: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    generateDraft(formData);

    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        navigate('/changes');
      }, 500);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Create a Draft</h1>
        <p className="text-gray-600">
          Select a branch and change range. We'll normalize changes by PR and generate release outputs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Section A: Target */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Target</h3>
              
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
                <Label htmlFor="targetBranch">Target branch</Label>
                <Input
                  id="targetBranch"
                  placeholder="release/0.97"
                  value={formData.targetBranch}
                  onChange={(e) => setFormData({ ...formData, targetBranch: e.target.value })}
                />
              </div>

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
            </div>

            <div className="border-t border-gray-200" />

            {/* Section B: Range */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Range</h3>
              
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

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                Resolved range: <span className="font-mono text-gray-900">v0.97.0..release/0.97 @ a3f7c2d</span>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Section C: Options */}
            <div className="space-y-4">
              <h3 className="text-gray-900">Options</h3>
              
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

        {isGenerating && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Generating draft...</span>
                  <span className="text-gray-900">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isGenerating ? 'Generating...' : 'Generate Draft'}
          </Button>
          <Button type="button" variant="outline" disabled={isGenerating}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
