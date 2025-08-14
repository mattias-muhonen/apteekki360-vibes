import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import LabUpload from '../../lab-upload/LabUpload';

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

interface HealthSummary {
  alertLevel: 'good' | 'warning' | 'danger' | 'no-data';
  summaryText: string;
}

interface HealthSummarySectionProps {
  healthSummary: HealthSummary;
  onLabResultsAdded: (results: ProcessedResults) => void;
  onChatWithAI: () => void;
}

const HealthSummarySection: React.FC<HealthSummarySectionProps> = ({
  healthSummary,
  onLabResultsAdded,
  onChatWithAI
}) => {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Health Summary</h2>
        <p className="text-gray-600">Your current health status at a glance</p>
      </div>
      <Card className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${
        healthSummary.alertLevel === 'good' ? 'border-l-green-500' :
        healthSummary.alertLevel === 'warning' ? 'border-l-yellow-500' :
        healthSummary.alertLevel === 'no-data' ? 'border-l-gray-400' :
        'border-l-red-500'
      }`}>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              healthSummary.alertLevel === 'good' ? 'bg-green-100' :
              healthSummary.alertLevel === 'warning' ? 'bg-yellow-100' :
              healthSummary.alertLevel === 'no-data' ? 'bg-gray-100' :
              'bg-red-100'
            }`}>
              <span className={`text-xl ${
                healthSummary.alertLevel === 'good' ? 'text-green-600' :
                healthSummary.alertLevel === 'warning' ? 'text-yellow-600' :
                healthSummary.alertLevel === 'no-data' ? 'text-gray-600' :
                'text-red-600'
              }`}>
                {healthSummary.alertLevel === 'good' ? '✓' :
                 healthSummary.alertLevel === 'warning' ? '⚠️' : 
                 healthSummary.alertLevel === 'no-data' ? '?' : '⚠️'}
              </span>
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Overall Health Status</CardTitle>
              <p className="text-gray-600 text-sm mt-1">Based on your latest lab results</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-800 mb-6 leading-relaxed">{healthSummary.summaryText}</p>
          <div className="flex flex-wrap gap-3">
            <LabUpload onResultsAdded={onLabResultsAdded} />
            {healthSummary.alertLevel !== 'no-data' && (
              <Button size="sm" variant="outline" onClick={onChatWithAI} className="flex items-center gap-2">
                <span>💬</span>
                Chat with AI about your results
              </Button>
            )}
            {healthSummary.alertLevel !== 'good' && healthSummary.alertLevel !== 'no-data' && (
              <Button size="sm" asChild>
                <Link to="/booking" className="flex items-center gap-2">
                  <span>📅</span>
                  Book Consultation
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default HealthSummarySection;
