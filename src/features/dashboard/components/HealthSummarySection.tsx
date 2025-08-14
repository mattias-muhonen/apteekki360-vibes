import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import LabUpload from '../../lab-upload/LabUpload';
import OpenAI from 'openai';

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

interface BloodPanelRecommendation {
  name: string;
  description: string;
  price: string;
  keyTests: string[];
  frequency: string;
  benefits: string[];
}

interface HealthSummarySectionProps {
  healthSummary: HealthSummary;
  onLabResultsAdded: (results: ProcessedResults) => void;
  onChatWithAI: () => void;
  labResults?: LabResult[];
}

const HealthSummarySection: React.FC<HealthSummarySectionProps> = ({
  healthSummary,
  onLabResultsAdded,
  onChatWithAI,
  labResults = []
}) => {
  const [bloodPanelRecommendation, setBloodPanelRecommendation] = useState<BloodPanelRecommendation | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  // Check if there are any abnormal results
  const hasAbnormalResults = labResults.some(result => result.status !== 'Normal');

  useEffect(() => {
    if (hasAbnormalResults) {
      getBloodPanelRecommendation();
    }
  }, [hasAbnormalResults, labResults]);

  const getBloodPanelRecommendation = async () => {
    if (!hasAbnormalResults) return;

    setIsLoadingRecommendation(true);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const abnormalResults = labResults.filter(result => result.status !== 'Normal');
      const labSummary = abnormalResults.map(result => 
        `${result.test}: ${result.result} (${result.status}, reference: ${result.referenceRange})`
      ).join('\n');

      const prompt = `Based on these abnormal lab results:
${labSummary}

Create a specific blood panel recommendation as a product. Respond in this exact JSON format:
{
  "name": "specific panel name (e.g., 'Comprehensive Metabolic Monitoring Panel', 'Cardiac Risk Assessment Panel')",
  "description": "detailed description of what this panel monitors and why it's important for these specific results",
  "price": "price in euros (e.g., '189 €')",
  "keyTests": ["test1", "test2", "test3", "test4", "test5"],
  "frequency": "recommended frequency (e.g., 'Every 3 months', 'Every 6 months')",
  "benefits": ["benefit1", "benefit2", "benefit3"]
}

Make the panel name specific and medical-sounding, not generic. Include 5 key tests that would be most relevant for monitoring these abnormal values.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a medical expert recommending specific blood panels for monitoring abnormal lab values. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      });

      const aiResponse = response.choices[0]?.message?.content?.trim();
      
      if (aiResponse) {
        try {
          const recommendation = JSON.parse(aiResponse) as BloodPanelRecommendation;
          setBloodPanelRecommendation(recommendation);
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          setFallbackRecommendation();
        }
      } else {
        setFallbackRecommendation();
      }

    } catch (error) {
      console.error('Error getting blood panel recommendation:', error);
      setFallbackRecommendation();
    } finally {
      setIsLoadingRecommendation(false);
    }
  };

  const setFallbackRecommendation = () => {
    setBloodPanelRecommendation({
      name: "Comprehensive Health Monitoring Panel",
      description: "A targeted blood panel designed to monitor and track the specific health markers that showed abnormal values in your recent tests. This panel helps ensure your health improvements are progressing as expected.",
      price: "149 €",
      keyTests: ["Complete Blood Count", "Comprehensive Metabolic Panel", "Lipid Profile", "Thyroid Function", "Inflammatory Markers"],
      frequency: "Every 3 months",
      benefits: ["Track improvement progress", "Early detection of changes", "Personalized health insights"]
    });
  };

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
            {hasAbnormalResults && bloodPanelRecommendation && (
              <Button 
                size="sm" 
                variant="default" 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowRecommendation(!showRecommendation)}
              >
                <span>🩸</span>
                {showRecommendation ? 'Hide' : 'View'} Recommended Blood Panel
              </Button>
            )}
            {hasAbnormalResults && isLoadingRecommendation && (
              <Button size="sm" variant="outline" disabled className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Getting recommendation...
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

          {/* Blood Panel Recommendation */}
          {hasAbnormalResults && bloodPanelRecommendation && showRecommendation && (
            <div className="mt-6 border-t pt-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <span>🩸</span>
                    {bloodPanelRecommendation.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {bloodPanelRecommendation.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Tests Included:</h4>
                      <ul className="space-y-1">
                        {bloodPanelRecommendation.keyTests.map((test, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            {test}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                      <ul className="space-y-1">
                        {bloodPanelRecommendation.benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-blue-200">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-blue-600">{bloodPanelRecommendation.price}</span>
                      <span className="text-sm text-gray-600">Recommended: {bloodPanelRecommendation.frequency}</span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Book This Panel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default HealthSummarySection;
