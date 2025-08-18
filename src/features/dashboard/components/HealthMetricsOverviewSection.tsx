import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';
import OpenAI from 'openai';
import type { ProcessedResults } from './LabResultsSection';
import LabUpload from '../../lab-upload/LabUpload';

interface LabEntry {
  date: string;
  test: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  id?: string;
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

interface HealthMetricsOverviewSectionProps {
  healthSummary: HealthSummary;
  labResults: LabEntry[];
  onChatWithAI: () => void;
  onDiscussLabResultWithAI?: (labResult: LabEntry) => void;
  onLabResultsAdded: (results: ProcessedResults) => void;
}

const HealthMetricsOverviewSection: React.FC<HealthMetricsOverviewSectionProps> = ({
  healthSummary,
  labResults,
  onChatWithAI,
  onDiscussLabResultWithAI,
  onLabResultsAdded
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
        <h2 className="text-2xl font-bold text-gray-900">Health Metrics Overview</h2>
        <p className="text-gray-600">Actionable insights based on your latest lab results</p>
      </div>
      
      {/* Handle no lab results case */}
      {healthSummary.alertLevel === 'no-data' && (
        <Card className="border-l-4 border-l-gray-400 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-slate-50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-gray-600 font-bold">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Health Metrics Awaiting Lab Results</h3>
            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
              Upload your lab results to see detailed health metrics, trends, and personalized insights about your health status.
            </p>
            <div className="flex justify-center">
              <LabUpload onResultsAdded={onLabResultsAdded} />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Show "All is well" message when everything is normal */}
      {healthSummary.alertLevel === 'good' && (
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">All Your Health Metrics Look Great!</h3>
            <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
              Congratulations! All {labResults.filter(r => new Date(r.date).getTime() === Math.max(...labResults.map(lr => new Date(lr.date).getTime()))).length} of your latest lab results are within normal ranges. 
              This indicates excellent overall health and that your current lifestyle choices are working well for you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-3xl mb-2">❤️</div>
                <div className="font-semibold text-gray-900">Heart Health</div>
                <div className="text-sm text-gray-600">Cholesterol levels optimal</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-semibold text-gray-900">Energy & Metabolism</div>
                <div className="text-sm text-gray-600">Glucose & nutrients balanced</div>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="font-semibold text-gray-900">Organ Function</div>
                <div className="text-sm text-gray-600">Kidney & liver working well</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="sm" variant="outline" onClick={onChatWithAI} className="flex items-center gap-2">
                <span>💬</span>
                Chat with AI about maintaining health
              </Button>
              <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/catalog" className="flex items-center gap-2">
                  <span>🌿</span>
                  Explore Wellness Products
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show message when there are issues */}
      {(healthSummary.alertLevel === 'warning' || healthSummary.alertLevel === 'danger') && (
        <div className="space-y-6">
          <Card className="border-l-4 border-l-orange-500 shadow-sm bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Health Metrics Need Attention</h3>
                  <p className="text-gray-700">{healthSummary.summaryText}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <LabUpload onResultsAdded={onLabResultsAdded} />
                <Button size="sm" variant="outline" onClick={onChatWithAI} className="flex items-center gap-2">
                  <span>💬</span>
                  Chat with AI about your results
                </Button>
                <Button size="sm" asChild>
                  <Link to="/booking" className="flex items-center gap-2">
                    <span>📅</span>
                      Book Blood Panel
                  </Link>
                </Button>
                {hasAbnormalResults && isLoadingRecommendation && (
                  <Button size="sm" variant="outline" disabled className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Getting recommendation...
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blood Panel Recommendation Accordion */}
          {hasAbnormalResults && bloodPanelRecommendation && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader 
                className="pb-4 cursor-pointer hover:bg-blue-100/50 transition-colors rounded-t-lg"
                onClick={() => setShowRecommendation(!showRecommendation)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                    <span>🩸</span>
                    Recommended Blood Panel: {bloodPanelRecommendation.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-600">{bloodPanelRecommendation.price}</span>
                    <span className={`transform transition-transform duration-200 ${showRecommendation ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              {showRecommendation && (
                <CardContent className="space-y-4 animate-in slide-in-from-top-2 duration-200">
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
                      <span className="text-sm text-gray-600">Recommended: {bloodPanelRecommendation.frequency}</span>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Book This Panel
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Show individual abnormal results */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Lab Results Analysis</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {labResults
                .filter(result => result.status !== 'Normal')
                .map((result, index) => {
                  // Get color based on status
                  const getMetricColor = (status: string) => {
                    switch (status) {
                      case 'Low': return 'yellow';
                      case 'High': return 'orange';
                      case 'Critical': return 'red';
                      default: return 'gray';
                    }
                  };

                  // Get actionable insight based on test name and status
                  const getActionableInsight = (testName: string, status: string) => {
                    const test = testName.toLowerCase();
                    if (test.includes('cholesterol')) {
                      return status === 'High' ? 'Consider heart-healthy diet and exercise' : 'Ensure adequate healthy fats in diet';
                    }
                    if (test.includes('glucose')) {
                      return status === 'High' ? 'Focus on blood sugar management' : 'Ensure regular balanced meals';
                    }
                    if (test.includes('vitamin d')) {
                      return status === 'Low' ? 'Consider sun exposure and supplementation' : 'Monitor levels regularly';
                    }
                    if (test.includes('hemoglobin')) {
                      return status === 'Low' ? 'Consider iron-rich foods' : 'Stay well hydrated';
                    }
                    return status === 'High' ? 'Consult healthcare provider for guidance' : 
                           status === 'Low' ? 'Consider lifestyle modifications' :
                           'Seek immediate medical attention';
                  };

                  const color = getMetricColor(result.status);

                  return (
                    <Card key={index} className="h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                      <CardHeader className="pb-3 px-4 pt-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm font-semibold leading-tight text-gray-900">{result.test}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 flex-1 flex flex-col">
                        <div className="text-2xl font-bold mb-2 text-gray-900">{result.result}</div>
                        
                        {/* Reference Range */}
                        <div className="text-xs text-gray-500 mb-3">
                          Reference: {result.referenceRange}
                        </div>
                        
                        {/* Actionable Insight */}
                        <div className="text-xs text-gray-600 mb-4 leading-relaxed flex-1">
                          {getActionableInsight(result.test, result.status)}
                        </div>

                        {/* Simple trend chart placeholder */}
                        <div className="h-8 mb-4 relative">
                          <svg className="w-full h-full" viewBox="0 0 100 32" preserveAspectRatio="none">
                            {(() => {
                              // Get historical data for this metric
                              const metricData = labResults
                                .filter(r => r.test === result.test)
                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                .map(r => parseFloat(r.result))
                                .filter(val => !isNaN(val));

                              if (metricData.length < 2) {
                                // Fallback to static bars if not enough data
                                const bars = [60, 70, 80, 85];
                                return bars.map((height, idx) => (
                                  <rect
                                    key={idx}
                                    x={idx * 25}
                                    y={32 - (height * 32 / 100)}
                                    width="20"
                                    height={height * 32 / 100}
                                    className={`${
                                      color === 'yellow' ? 'fill-yellow-500' :
                                      color === 'orange' ? 'fill-orange-500' :
                                      color === 'red' ? 'fill-red-500' : 'fill-gray-500'
                                    }`}
                                    rx="1"
                                  />
                                ));
                              }

                              // Create trend line from actual data
                              const minVal = Math.min(...metricData);
                              const maxVal = Math.max(...metricData);
                              const range = maxVal - minVal || 1;
                              
                              const points = metricData.map((val, idx) => {
                                const x = (idx / (metricData.length - 1)) * 100;
                                const y = 32 - ((val - minVal) / range * 24 + 4); // 4px padding top/bottom
                                return `${x},${y}`;
                              }).join(' ');

                              return (
                                <>
                                  {/* Area under the curve */}
                                  <polygon
                                    points={`0,32 ${points} 100,32`}
                                    className={`${
                                      color === 'yellow' ? 'fill-yellow-200' :
                                      color === 'orange' ? 'fill-orange-200' :
                                      color === 'red' ? 'fill-red-200' : 'fill-gray-200'
                                    }`}
                                    fillOpacity="0.3"
                                  />
                                  {/* Trend line */}
                                  <polyline
                                    points={points}
                                    fill="none"
                                    stroke={`${
                                      color === 'yellow' ? '#f59e0b' :
                                      color === 'orange' ? '#f97316' :
                                      color === 'red' ? '#ef4444' : '#6b7280'
                                    }`}
                                    strokeWidth="2"
                                    className="drop-shadow-sm"
                                  />
                                  {/* Data points */}
                                  {metricData.map((val, idx) => {
                                    const x = (idx / (metricData.length - 1)) * 100;
                                    const y = 32 - ((val - minVal) / range * 24 + 4);
                                    return (
                                      <circle
                                        key={idx}
                                        cx={x}
                                        cy={y}
                                        r="2"
                                        className={`${
                                          color === 'yellow' ? 'fill-yellow-500' :
                                          color === 'orange' ? 'fill-orange-500' :
                                          color === 'red' ? 'fill-red-500' : 'fill-gray-500'
                                        }`}
                                      />
                                    );
                                  })}
                                </>
                              );
                            })()}
                          </svg>
                        </div>

                        {/* Trend Indicator */}
                        <div className="flex items-center justify-center mb-4">
                          <span className={`text-xs font-medium flex items-center px-3 py-1 rounded-full ${
                            result.status === 'High' ? 'text-red-700 bg-red-100' : 
                            result.status === 'Low' ? 'text-yellow-700 bg-yellow-100' : 
                            'text-red-700 bg-red-100'
                          }`}>
                            {result.status === 'High' ? '↗️ Above Range' : 
                             result.status === 'Low' ? '↘️ Below Range' : 
                             '⚠️ Critical'}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 mt-auto">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs h-8 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-medium"
                            onClick={() => onDiscussLabResultWithAI ? onDiscussLabResultWithAI(result) : onChatWithAI()}
                          >
                            💬 Discuss with AI
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HealthMetricsOverviewSection;
