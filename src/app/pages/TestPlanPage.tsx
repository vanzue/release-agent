import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Copy, FileText } from 'lucide-react';

const mockTestCases = [
  {
    area: 'FancyZones',
    cases: [
      { id: 1, text: 'Verify zone editor opens and saves layouts', checked: false, priority: 'Must', source: '#12345' },
      { id: 2, text: 'Test Win10 vs Win11 behavior consistency', checked: false, priority: 'Must', source: '#12344' },
      { id: 3, text: 'Verify keyboard shortcuts work correctly', checked: false, priority: 'Must', source: '#12345' },
      { id: 4, text: 'Exploratory: Test with ultra-wide monitors', checked: false, priority: 'Exploratory', source: 'hotspot-1' },
    ],
  },
  {
    area: 'Command Palette',
    cases: [
      { id: 5, text: 'Verify search performance improvements', checked: false, priority: 'Recommended', source: '#12343' },
      { id: 6, text: 'Test plugin loading and unloading', checked: false, priority: 'Must', source: '#12342' },
    ],
  },
];

export function TestPlanPage() {
  const [testCases, setTestCases] = useState(mockTestCases);

  const toggleCase = (areaIdx: number, caseIdx: number) => {
    setTestCases((prev) => {
      const newCases = [...prev];
      newCases[areaIdx].cases[caseIdx].checked = !newCases[areaIdx].cases[caseIdx].checked;
      return newCases;
    });
  };

  const totalCases = testCases.reduce((sum, area) => sum + area.cases.length, 0);
  const mustTestCount = testCases.reduce(
    (sum, area) => sum + area.cases.filter((c) => c.priority === 'Must').length,
    0
  );
  const checkedCount = testCases.reduce(
    (sum, area) => sum + area.cases.filter((c) => c.checked).length,
    0
  );

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      Must: 'bg-red-100 text-red-700 border-red-200',
      Recommended: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Exploratory: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Manual Test Plan</h1>
              <p className="text-gray-600">
                {checkedCount} of {totalCases} test cases completed
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Export Markdown
              </Button>
              <Button variant="outline" className="gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Post to Tracking Issue
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {testCases.map((section, areaIdx) => (
              <div key={section.area}>
                <h2 className="text-gray-900 mb-4">## {section.area}</h2>
                <div className="space-y-3">
                  {section.cases.map((testCase, caseIdx) => (
                    <Card key={testCase.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`case-${testCase.id}`}
                          checked={testCase.checked}
                          onCheckedChange={() => toggleCase(areaIdx, caseIdx)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <Textarea
                            defaultValue={testCase.text}
                            className="min-h-[40px]"
                          />
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getPriorityColor(testCase.priority)}>
                              {testCase.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">from {testCase.source}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-gray-200 p-6 bg-gray-50">
        <h3 className="text-gray-900 mb-4">Summary</h3>
        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total cases</span>
              <span className="text-gray-900">{totalCases}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Must-test</span>
              <span className="text-gray-900">{mustTestCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Areas covered</span>
              <span className="text-gray-900">{testCases.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Completed</span>
              <span className="text-gray-900">
                {checkedCount} / {totalCases}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Progress</div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${(checkedCount / totalCases) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
