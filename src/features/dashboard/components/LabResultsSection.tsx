import React from 'react';
import { Button, Card, CardContent, CardHeader } from '../../../components/ui';
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
                    <LabUpload onResultsAdded={onLabResultsAdded} />
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
                <LabUpload onResultsAdded={onLabResultsAdded} />
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
                      {/* Mobile-optimized layout: Title and info in first row, status and buttons in second row */}
                      <div className="space-y-3">
                        {/* First row: Date and test count */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">{dateGroup.date}</h3>
                            <p className="text-sm text-gray-600">{dateGroup.totalTests} test{dateGroup.totalTests !== 1 ? 's' : ''}</p>
                          </div>
                          {/* Expand icon - always visible */}
                          <svg
                            className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        
                        {/* Second row: Status badge - full width on mobile */}
                        <div className="flex justify-start">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dateGroup.overallStatus)}`}>
                            {dateGroup.statusText}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="pt-0 p-4">
                        {/* Mobile-optimized layout - no table, card-based approach */}
                        <div className="space-y-4">
                          {dateGroup.results.map((result, index) => (
                            <div key={result.id || index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                              {/* Top row: Test name and actions */}
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-medium text-gray-900 text-sm flex-1 min-w-0">
                                  <span className="truncate block">{result.test}</span>
                                </h4>
                                {result.id && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDeleteLabResult(result.id!)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 p-2 ml-2 flex-shrink-0"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              
                              {/* Bottom row: Result, range, and status */}
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">Result:</span>
                                  <span className="font-semibold text-gray-900">{result.result}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">Range:</span>
                                  <span className="text-gray-700">{result.referenceRange}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                                    {result.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Mobile-optimized delete all button */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteDateGroup(dateGroup.date)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Delete All Results from {dateGroup.date}</span>
                            <span className="sm:hidden">Delete All Results</span>
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
