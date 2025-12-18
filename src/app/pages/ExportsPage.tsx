import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Download, ExternalLink, CheckCircle2 } from 'lucide-react';

const mockTimeline = [
  { id: 1, event: 'Draft created', user: 'john-dev', time: '2 hours ago', type: 'create' },
  { id: 2, event: 'Generated outputs', user: 'System', time: '2 hours ago', type: 'generate' },
  { id: 3, event: 'Edited release notes', user: 'sarah-pm', time: '1 hour ago', type: 'edit' },
  { id: 4, event: 'Generated test plan', user: 'System', time: '30 mins ago', type: 'generate' },
  { id: 5, event: 'Exported to PR #12350', user: 'mike-lead', time: '10 mins ago', type: 'export' },
];

export function ExportsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-gray-900 mb-2">Exports & History</h1>
        <p className="text-gray-600">Track draft changes and export history</p>
      </div>

      {/* Export Targets */}
      <div>
        <h2 className="text-gray-900 mb-4">Export Targets</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">Markdown</h3>
              <Download className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Export all outputs as formatted markdown files</p>
            <Button variant="outline" className="w-full">Download</Button>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">JSON</h3>
              <Download className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Export structured data for automation</p>
            <Button variant="outline" className="w-full">Download</Button>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">GitHub PR</h3>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <p className="text-sm text-gray-600">Posted to microsoft/PowerToys#12350</p>
            <Button variant="outline" className="w-full gap-2">
              Open PR
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>

      {/* Draft Timeline */}
      <div>
        <h2 className="text-gray-900 mb-4">Draft Timeline</h2>
        <Card className="p-6">
          <div className="space-y-4">
            {mockTimeline.map((item, idx) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.type === 'export' ? 'bg-purple-100' :
                    item.type === 'generate' ? 'bg-blue-100' :
                    item.type === 'edit' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {item.type === 'export' && <CheckCircle2 className="h-4 w-4 text-purple-700" />}
                    {item.type === 'generate' && <Download className="h-4 w-4 text-blue-700" />}
                  </div>
                  {idx < mockTimeline.length - 1 && (
                    <div className="flex-1 w-0.5 bg-gray-200 my-1" style={{ minHeight: '32px' }} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-gray-900">{item.event}</div>
                  <div className="text-sm text-gray-600">
                    {item.user} • {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Exports */}
      <div>
        <h2 className="text-gray-900 mb-4">Recent Exports</h2>
        <div className="space-y-2">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <div className="text-gray-900">Release Notes & Test Plan</div>
              <div className="text-sm text-gray-600">Exported to PR #12350 • 10 mins ago</div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              View PR
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <div className="text-gray-900">Markdown Bundle</div>
              <div className="text-sm text-gray-600">Downloaded • 1 hour ago</div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Re-download
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
