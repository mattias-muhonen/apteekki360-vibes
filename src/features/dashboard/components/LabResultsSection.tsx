import React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import LabUpload from '../../lab-upload/LabUpload';
import { Trash2 } from 'lucide-react';

interface LabResult {
  test: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  unit?: string;
}

interface ProcessedResults {
  date: string;
  results: LabResult[];
  confidence: number;
}

interface LabEntry {
  date: string;
  test: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  id?: string;
}

interface GroupedLabResults {
  date: string;
  results: LabEntry[];
  totalTests: number;
  overallStatus: 'Normal' | 'Low' | 'High' | 'Critical';
  statusText: string;
}

interface LabResultsSectionProps {
  groupedLabResults: GroupedLabResults[];
  expandedAccordions: string[];
  onLabResultsAdded: (results: ProcessedResults) => void;
  onToggleAccordion: (date: string) => void;
  onDeleteLabResult: (id: string) => void;
  onDeleteDateGroup: (date: string) => void;
  getStatusColor: (status: string) => string;
}

const LabResultsSection: React.FC<LabResultsSectionProps> = ({
  groupedLabResults,
  expandedAccordions,
  onLabResultsAdded,
  onToggleAccordion,
  onDeleteLabResult,
  onDeleteDateGroup,
  getStatusColor
}) => {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Lab Results History</h2>
        <p className="text-gray-600">Complete history of your laboratory test results</p>
      </div>
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Test Results</CardTitle>
              <p className="text-gray-600 text-sm mt-1">Upload new results or view historical data</p>
            </div>
            <div className="flex gap-3">
              <LabUpload onResultsAdded={onLabResultsAdded} />
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <span>➕</span>
                Add Manual Result
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {groupedLabResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No results to show</p>
                <p className="text-gray-300 text-sm mt-2">Upload lab images to see your results here</p>
              </div>
            ) : (
              groupedLabResults.map((dateGroup) => {
                const isExpanded = expandedAccordions.includes(dateGroup.date);
                return (
                  <Card key={dateGroup.date} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50 transition-colors p-4"
                      onClick={() => onToggleAccordion(dateGroup.date)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{dateGroup.date}</h3>
                            <p className="text-sm text-gray-600">{dateGroup.totalTests} test{dateGroup.totalTests !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dateGroup.overallStatus)}`}>
                            {dateGroup.statusText}
                          </span>
                          <svg 
                            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="pt-0 p-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 text-sm font-semibold text-gray-900">Test</th>
                                <th className="text-left py-3 text-sm font-semibold text-gray-900">Result</th>
                                <th className="text-left py-3 text-sm font-semibold text-gray-900">Reference Range</th>
                                <th className="text-left py-3 text-sm font-semibold text-gray-900">Status</th>
                                <th className="text-left py-3 text-sm font-semibold text-gray-900">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {dateGroup.results.map((result, index) => (
                                <tr key={result.id || index} className="hover:bg-gray-50">
                                  <td className="py-3 text-sm text-gray-900 font-medium">{result.test}</td>
                                  <td className="py-3 text-sm font-semibold text-gray-900">{result.result}</td>
                                  <td className="py-3 text-sm text-gray-600">{result.referenceRange}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                                      {result.status}
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    {result.id && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDeleteLabResult(result.id!)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteDateGroup(dateGroup.date)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete All Results from {dateGroup.date}
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default LabResultsSection;
