import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../../components/ui';

interface HealthMetric {
  title: string;
  value: string;
  status: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'stable';
  color: string;
  chartHeight: number[];
  actionableInsight: string;
  actionButton?: {
    text: string;
    action: string;
  };
}

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

interface HealthMetricsOverviewSectionProps {
  healthSummary: HealthSummary;
  healthMetrics: HealthMetric[];
  labResults: LabEntry[];
  onChatWithAI: () => void;
  onDiscussMetricWithAI: (metric: HealthMetric) => void;
}

const HealthMetricsOverviewSection: React.FC<HealthMetricsOverviewSectionProps> = ({
  healthSummary,
  healthMetrics,
  labResults,
  onChatWithAI,
  onDiscussMetricWithAI
}) => {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Health Metrics Overview</h2>
        <p className="text-gray-600">Actionable insights based on your latest lab results</p>
      </div>
      
      {/* Show "All is well" message when everything is normal */}
      {healthSummary.alertLevel === 'good' ? (
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
      ) : (
        /* Show detailed metrics when there are issues */
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthMetrics.map((metric, index) => (
              <Card key={index} className="h-full flex flex-col border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3 px-4 pt-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-semibold leading-tight text-gray-900">{metric.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4 flex-1 flex flex-col">
                  <div className="text-2xl font-bold mb-2 text-gray-900">{metric.value}</div>
                  <div className={`text-sm font-medium mb-3 ${
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'yellow' ? 'text-yellow-600' :
                    metric.color === 'orange' ? 'text-orange-600' :
                    metric.color === 'red' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.status}
                  </div>
                  
                  {/* Actionable Insight */}
                  <div className="text-xs text-gray-600 mb-4 leading-relaxed flex-1">
                    {metric.actionableInsight}
                  </div>

                  {/* Dynamic Trend Chart */}
                  <div className="h-8 mb-4 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 32" preserveAspectRatio="none">
                      {(() => {
                        // Get historical data for this metric
                        const metricData = labResults
                          .filter(result => result.test === metric.title)
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map(result => parseFloat(result.result))
                          .filter(val => !isNaN(val));

                        if (metricData.length < 2) {
                          // Fallback to static bars if not enough data
                          const bars = [60, 70, 80, 85];
                          return bars.map((height, index) => (
                            <rect
                              key={index}
                              x={index * 25}
                              y={32 - (height * 32 / 100)}
                              width="20"
                              height={height * 32 / 100}
                              className={`${
                                metric.color === 'green' ? 'fill-green-500' :
                                metric.color === 'yellow' ? 'fill-yellow-500' :
                                metric.color === 'orange' ? 'fill-orange-500' :
                                metric.color === 'red' ? 'fill-red-500' : 'fill-gray-500'
                              }`}
                              rx="1"
                            />
                          ));
                        }

                        // Create trend line from actual data
                        const minVal = Math.min(...metricData);
                        const maxVal = Math.max(...metricData);
                        const range = maxVal - minVal || 1;
                        
                        const points = metricData.map((val, index) => {
                          const x = (index / (metricData.length - 1)) * 100;
                          const y = 32 - ((val - minVal) / range * 24 + 4); // 4px padding top/bottom
                          return `${x},${y}`;
                        }).join(' ');

                        return (
                          <>
                            {/* Area under the curve */}
                            <polygon
                              points={`0,32 ${points} 100,32`}
                              className={`${
                                metric.color === 'green' ? 'fill-green-200' :
                                metric.color === 'yellow' ? 'fill-yellow-200' :
                                metric.color === 'orange' ? 'fill-orange-200' :
                                metric.color === 'red' ? 'fill-red-200' : 'fill-gray-200'
                              }`}
                              fillOpacity="0.3"
                            />
                            {/* Trend line */}
                            <polyline
                              points={points}
                              fill="none"
                              stroke={`${
                                metric.color === 'green' ? '#10b981' :
                                metric.color === 'yellow' ? '#f59e0b' :
                                metric.color === 'orange' ? '#f97316' :
                                metric.color === 'red' ? '#ef4444' : '#6b7280'
                              }`}
                              strokeWidth="2"
                              className="drop-shadow-sm"
                            />
                            {/* Data points */}
                            {metricData.map((val, index) => {
                              const x = (index / (metricData.length - 1)) * 100;
                              const y = 32 - ((val - minVal) / range * 24 + 4);
                              return (
                                <circle
                                  key={index}
                                  cx={x}
                                  cy={y}
                                  r="2"
                                  className={`${
                                    metric.color === 'green' ? 'fill-green-500' :
                                    metric.color === 'yellow' ? 'fill-yellow-500' :
                                    metric.color === 'orange' ? 'fill-orange-500' :
                                    metric.color === 'red' ? 'fill-red-500' : 'fill-gray-500'
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
                      metric.trendDirection === 'up' ? 'text-green-700 bg-green-100' : 
                      metric.trendDirection === 'down' ? 'text-red-700 bg-red-100' : 'text-gray-700 bg-gray-100'
                    }`}>
                      {metric.trendDirection === 'up' ? '↗️' : 
                       metric.trendDirection === 'down' ? '↘️' : '➡️'} {metric.trend}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-auto">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs h-8 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-medium"
                      onClick={() => onDiscussMetricWithAI(metric)}
                    >
                      💬 Discuss with AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HealthMetricsOverviewSection;
