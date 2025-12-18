import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, RefreshCw, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '../components/ui/utils';

const mockChanges = [
  {
    id: 1,
    title: 'Add new keyboard shortcut for FancyZones snap assist',
    number: 12345,
    author: 'john-dev',
    files: 3,
    additions: 210,
    deletions: 85,
    area: 'FancyZones',
    type: 'New',
    risk: 'Medium',
    labels: ['feature', 'ui'],
    signals: ['Input hook', 'Global hotkey'],
  },
  {
    id: 2,
    title: 'Fix crash when switching between multiple zones',
    number: 12344,
    author: 'sarah-eng',
    files: 2,
    additions: 45,
    deletions: 12,
    area: 'FancyZones',
    type: 'Fix',
    risk: 'High',
    labels: ['bug', 'crash'],
    signals: ['Crash handler', 'Multi-threading'],
  },
  {
    id: 3,
    title: 'Update Command Palette search algorithm',
    number: 12343,
    author: 'mike-pm',
    files: 5,
    additions: 180,
    deletions: 95,
    area: 'CmdPal',
    type: 'Change',
    risk: 'Low',
    labels: ['enhancement'],
    signals: ['Search index'],
  },
];

export function ChangesPage() {
  const [selectedChange, setSelectedChange] = useState(mockChanges[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const getAreaColor = (area: string) => {
    const colors: Record<string, string> = {
      FancyZones: 'bg-purple-100 text-purple-700 border-purple-200',
      CmdPal: 'bg-blue-100 text-blue-700 border-blue-200',
      Workspaces: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[area] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getRiskColor = (risk: string) => {
    const colors: Record<string, string> = {
      High: 'bg-red-100 text-red-700 border-red-200',
      Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Low: 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[risk] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search PR title, labels, files..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            All Areas
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            Type: All
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-gray-50">
            Risk: All
          </Badge>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Changes List */}
        <div className="w-2/5 border-r border-gray-200 overflow-auto bg-gray-50">
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-3">
              {mockChanges.length} changes (by PR)
            </div>
            
            <div className="space-y-2">
              {mockChanges.map((change) => (
                <Card
                  key={change.id}
                  className={cn(
                    'p-4 cursor-pointer transition-all hover:shadow-md',
                    selectedChange?.id === change.id ? 'ring-2 ring-blue-500 bg-white' : 'bg-white hover:bg-gray-50'
                  )}
                  onClick={() => setSelectedChange(change)}
                >
                  <div className="space-y-2">
                    <h4 className="text-gray-900 line-clamp-2">{change.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>#{change.number}</span>
                      <span>•</span>
                      <span>{change.author}</span>
                      <span>•</span>
                      <span>{change.files} files</span>
                      <span>•</span>
                      <span className="text-green-600">+{change.additions}</span>
                      <span className="text-red-600">-{change.deletions}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={getAreaColor(change.area)}>
                        {change.area}
                      </Badge>
                      <Badge variant="outline" className={getRiskColor(change.risk)}>
                        {change.risk}
                      </Badge>
                      {change.labels.map((label) => (
                        <Badge key={label} variant="outline" className="bg-gray-100 text-gray-700">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Change Details */}
        <div className="flex-1 overflow-auto bg-white">
          {selectedChange && (
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-gray-900">{selectedChange.title}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getAreaColor(selectedChange.area)}>
                      {selectedChange.area}
                    </Badge>
                    <Badge variant="outline" className={getRiskColor(selectedChange.risk)}>
                      Risk: {selectedChange.risk}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  Open PR
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="signals">Signals</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4 mt-4">
                  <div>
                    <h4 className="text-gray-900 mb-2">Change Summary</h4>
                    <p className="text-gray-700">
                      This PR introduces a new keyboard shortcut system for FancyZones snap assist feature. 
                      The implementation uses Win+Shift+Z as the default hotkey to activate the snap assist overlay.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-2">Impact</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Adds new global hotkey registration</li>
                      <li>Modifies FancyZones core activation logic</li>
                      <li>Updates settings UI to configure shortcut</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="mt-4">
                  <div className="space-y-2">
                    <div className="font-mono text-sm p-3 rounded-lg bg-gray-50 border border-gray-200">
                      src/modules/fancyzones/FancyZonesLib/FancyZones.cpp
                      <span className="text-green-600 ml-2">+125</span>
                      <span className="text-red-600 ml-1">-40</span>
                    </div>
                    <div className="font-mono text-sm p-3 rounded-lg bg-gray-50 border border-gray-200">
                      src/modules/fancyzones/FancyZonesLib/Settings.cpp
                      <span className="text-green-600 ml-2">+55</span>
                      <span className="text-red-600 ml-1">-25</span>
                    </div>
                    <div className="font-mono text-sm p-3 rounded-lg bg-gray-50 border border-gray-200">
                      src/modules/fancyzones/editor/FancyZonesEditor/MainWindow.xaml
                      <span className="text-green-600 ml-2">+30</span>
                      <span className="text-red-600 ml-1">-20</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="signals" className="mt-4">
                  <div className="space-y-3">
                    <h4 className="text-gray-900">Risk Signals</h4>
                    {selectedChange.signals.map((signal) => (
                      <Card key={signal} className="p-4 bg-amber-50 border-amber-200">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                          <div className="flex-1">
                            <div className="text-gray-900">{signal}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Found in FancyZones.cpp:145, Settings.cpp:78
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
