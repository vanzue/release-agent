import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Progress } from '../components/ui/progress';
import { ChevronDown } from 'lucide-react';

const mockHotspots = [
  { id: 1, rank: 1, area: 'FancyZones', score: 850, drivers: ['Installer', 'Hotkey', 'Settings'], changes: 12 },
  { id: 2, rank: 2, area: 'Command Palette', score: 720, drivers: ['Perf', 'UI'], changes: 8 },
  { id: 3, rank: 3, area: 'Workspaces', score: 650, drivers: ['Settings', 'Multi-monitor'], changes: 5 },
  { id: 4, rank: 4, area: 'PowerToys Run', score: 480, drivers: ['Search'], changes: 7 },
];

export function HotspotsPage() {
  const [selectedHotspot, setSelectedHotspot] = useState(mockHotspots[0]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Manual Test Hotspots</h1>
          <p className="text-gray-600">Ranked by risk signals, touched areas, and change scope.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Adjust Scoring</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Generate Test Plan</Button>
        </div>
      </div>

      {/* Hotspot Rankings */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Area / Feature</TableHead>
              <TableHead className="w-48">Score</TableHead>
              <TableHead>Drivers</TableHead>
              <TableHead className="w-24">Changes</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHotspots.map((hotspot) => (
              <TableRow
                key={hotspot.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedHotspot(hotspot)}
              >
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    #{hotspot.rank}
                  </Badge>
                </TableCell>
                <TableCell>{hotspot.area}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Progress value={(hotspot.score / 1000) * 100} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-700 w-12">{hotspot.score}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {hotspot.drivers.map((driver) => (
                      <Badge key={driver} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                        {driver}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{hotspot.changes}</TableCell>
                <TableCell>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Hotspot Details */}
      {selectedHotspot && (
        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-gray-900 mb-1">{selectedHotspot.area}</h2>
            <p className="text-gray-600">Score: {selectedHotspot.score} | {selectedHotspot.changes} changes</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-900 mb-3">Risk Drivers</h3>
              <div className="space-y-2">
                {selectedHotspot.drivers.map((driver, idx) => (
                  <div key={driver} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-700">{driver}</div>
                    <Badge variant="outline" className="ml-auto text-xs">+{150 - idx * 20}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-gray-900 mb-3">Contributing PRs</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                  #12345: Add new keyboard shortcut
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                  #12344: Fix crash on zone switch
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                  #12340: Update settings UI
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 mb-3">Suggested Test Focus</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Test keyboard shortcut registration and deregistration</li>
              <li>Verify zone switching behavior under various scenarios</li>
              <li>Check settings persistence after restart</li>
              <li>Test multi-monitor configurations</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}
