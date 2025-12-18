import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Lock, Trash2, Sparkles } from 'lucide-react';

const mockNotes = [
  {
    id: 1,
    area: 'FancyZones',
    items: [
      { id: 101, text: 'Added new keyboard shortcut for snap assist (Win+Shift+Z)', pr: 12345, locked: false },
      { id: 102, text: 'Fixed crash when switching between multiple zones', pr: 12344, locked: false },
    ],
  },
  {
    id: 2,
    area: 'CmdPal',
    items: [
      { id: 201, text: 'Improved search algorithm performance', pr: 12343, locked: false },
    ],
  },
];

export function ReleaseNotesPage() {
  const [notes, setNotes] = useState(mockNotes);

  return (
    <div className="h-full flex">
      {/* Left: Outline */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
        <h3 className="text-gray-900 mb-3">Areas</h3>
        <div className="space-y-1">
          {notes.map((section) => (
            <div
              key={section.id}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              {section.area} ({section.items.length})
            </div>
          ))}
        </div>
      </div>

      {/* Middle: Items List */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-gray-900">Release Notes</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Add Item</Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Sparkles className="h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {notes.map((section) => (
            <div key={section.id}>
              <h2 className="text-gray-900 mb-4">{section.area}</h2>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <Card key={item.id} className="p-4 space-y-3">
                    <Textarea
                      defaultValue={item.text}
                      className="min-h-[60px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Source: #{item.pr}</span>
                        <Badge variant="outline">FancyZones</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">Exclude</Button>
                        <Button variant="ghost" size="sm">
                          <Lock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Preview */}
      <div className="w-96 border-l border-gray-200 p-6 bg-gray-50 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Preview</h3>
          <Button variant="outline" size="sm">Copy</Button>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm space-y-4 font-mono">
          <div>
            <div className="font-semibold text-gray-900 mb-2">## FancyZones</div>
            <div className="space-y-1 text-gray-700">
              <div>• Added new keyboard shortcut for snap assist (Win+Shift+Z)</div>
              <div>• Fixed crash when switching between multiple zones</div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-900 mb-2">## Command Palette</div>
            <div className="space-y-1 text-gray-700">
              <div>• Improved search algorithm performance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
