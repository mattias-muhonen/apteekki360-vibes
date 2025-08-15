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
        <p className="text-gray-600">Track your health journey and discover trends in your laboratory test results over time</p>
      </div>
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          {/* Encouragement section when there are results */}
          {groupedLabResults.length > 0 && (
            <div className="">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📈</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Unlock Powerful Health Trends
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      You have {groupedLabResults.length} test result{groupedLabResults.length > 1 ? 's' : ''} uploaded.
                      Upload more results to see meaningful health trends and get more accurate AI-powered insights.
                    </p>
                    <LabUpload onResultsAdded={onLabResultsAdded} variant="prominent" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {groupedLabResults.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-dashed border-blue-200">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Health Journey</h3>
                <p className="text-gray-600 text-base mb-4 max-w-md mx-auto">
                  Upload your lab results to unlock powerful health insights and track your progress over time.
                </p>
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <span>✨</span>
                    <span>AI-powered health analysis</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>📊</span>
                    <span>Personalized trend tracking</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span>🎯</span>
                    <span>Actionable health recommendations</span>
                  </div>
                </div>
                <LabUpload onResultsAdded={onLabResultsAdded} variant="prominent" />
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
