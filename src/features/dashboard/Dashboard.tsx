import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import LabUpload from '../lab-upload/LabUpload';
import { products } from '../../products';
import type { Product } from '../../products';

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
}

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

const Dashboard = () => {
  // Initial lab results data
  const [labResults, setLabResults] = useState<LabEntry[]>([
    {
      date: "Dec 15, 2024",
      test: "Total Cholesterol",
      result: "185 mg/dL",
      referenceRange: "<200 mg/dL",
      status: "Normal"
    },
    {
      date: "Dec 15, 2024",
      test: "HDL Cholesterol", 
      result: "58 mg/dL",
      referenceRange: ">40 mg/dL",
      status: "Normal"
    },
    {
      date: "Dec 15, 2024",
      test: "LDL Cholesterol",
      result: "110 mg/dL", 
      referenceRange: "<100 mg/dL",
      status: "High"
    },
    {
      date: "Dec 15, 2024",
      test: "Triglycerides",
      result: "85 mg/dL",
      referenceRange: "<150 mg/dL", 
      status: "Normal"
    },
    {
      date: "Dec 15, 2024",
      test: "Vitamin D",
      result: "32 ng/mL", 
      referenceRange: "30-100 ng/mL",
      status: "Normal"
    },
    {
      date: "Nov 20, 2024",
      test: "Total Cholesterol",
      result: "195 mg/dL",
      referenceRange: "<200 mg/dL", 
      status: "Normal"
    }
  ]);

  // Accordion state for lab results
  const [expandedAccordions, setExpandedAccordions] = useState<string[]>([]);

  // Calculate dynamic health metrics based on lab results
  const healthMetrics = useMemo(() => {
    const metrics: HealthMetric[] = [];
    
    // Group results by test type to track trends
    const testGroups: { [key: string]: LabEntry[] } = {};
    labResults.forEach(result => {
      if (!testGroups[result.test]) {
        testGroups[result.test] = [];
      }
      testGroups[result.test].push(result);
    });

    // Create metrics for key tests
    Object.entries(testGroups).forEach(([testName, results]) => {
      if (results.length > 0) {
        const latest = results[0]; // Most recent result
        const previous = results[1]; // Previous result for trend
        
        let trend = "No change";
        let trendDirection: 'up' | 'down' | 'stable' = 'stable';
        
        if (previous) {
          const latestValue = parseFloat(latest.result);
          const previousValue = parseFloat(previous.result);
          
          if (!isNaN(latestValue) && !isNaN(previousValue)) {
            const change = ((latestValue - previousValue) / previousValue) * 100;
            if (Math.abs(change) > 1) {
              trend = `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
              trendDirection = change > 0 ? 'up' : 'down';
            }
          }
        }

        const getMetricColor = (status: string) => {
          switch (status) {
            case 'Normal': return 'green';
            case 'Low': return 'yellow';
            case 'High': return 'orange';
            case 'Critical': return 'red';
            default: return 'gray';
          }
        };

        const getActionableInsight = (testName: string, status: string) => {
          switch (testName.toLowerCase()) {
            case 'total cholesterol':
              return status === 'High' ? 'Consider dietary changes and increase fiber intake' :
                     status === 'Low' ? 'Ensure adequate healthy fats in diet' :
                     'Maintain current heart-healthy lifestyle';
            case 'hdl cholesterol':
              return status === 'Low' ? 'Increase exercise and omega-3 rich foods' :
                     'Keep up regular physical activity';
            case 'ldl cholesterol':
              return status === 'High' ? 'Reduce saturated fats and increase soluble fiber' :
                     'Continue healthy dietary habits';
            case 'triglycerides':
              return status === 'High' ? 'Limit sugar and refined carbs, increase exercise' :
                     'Maintain balanced diet and activity level';
            case 'vitamin d':
              return status === 'Low' ? 'Consider vitamin D3 supplement and sun exposure' :
                     status === 'High' ? 'Monitor supplement dosage' :
                     'Maintain current vitamin D levels';
            default:
              return status === 'Normal' ? 'Continue current health practices' :
                     status === 'High' ? 'Consult healthcare provider for guidance' :
                     'Consider lifestyle modifications or supplementation';
          }
        };

        const getActionButton = (testName: string, status: string) => {
          if (status === 'High' || status === 'Low' || status === 'Critical') {
            switch (testName.toLowerCase()) {
              case 'total cholesterol':
              case 'ldl cholesterol':
              case 'triglycerides':
                return { text: 'Heart Health Tips', action: '/catalog?category=heart' };
              case 'vitamin d':
                return { text: 'Shop Vitamin D', action: '/catalog?search=vitamin+d' };
              default:
                return { text: 'Learn More', action: '/catalog' };
            }
          }
          return undefined;
        };

        metrics.push({
          title: testName,
          value: latest.result,
          status: latest.status === 'Normal' ? 'Normal Range' : latest.status,
          trend,
          trendDirection,
          color: getMetricColor(latest.status),
          chartHeight: [60, 70, 80, 85],
          actionableInsight: getActionableInsight(testName, latest.status),
          actionButton: getActionButton(testName, latest.status)
        });
      }
    });

    // Ensure we have at least 4 metrics, add calculated ones if needed
    if (metrics.length < 4) {
      // Add overall health score based on status distribution
      const statusCounts = labResults.reduce((acc, result) => {
        acc[result.status] = (acc[result.status] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const totalTests = labResults.length;
      const normalCount = statusCounts['Normal'] || 0;
      const healthScore = totalTests > 0 ? (normalCount / totalTests * 10).toFixed(1) : '0.0';

      metrics.push({
        title: 'Overall Health Score',
        value: `${healthScore}/10`,
        status: normalCount / totalTests > 0.8 ? 'Excellent' : normalCount / totalTests > 0.6 ? 'Good' : 'Needs Attention',
        trend: '+5%',
        trendDirection: 'up',
        color: normalCount / totalTests > 0.8 ? 'green' : normalCount / totalTests > 0.6 ? 'yellow' : 'orange',
        chartHeight: [50, 60, 70, 72],
        actionableInsight: normalCount / totalTests > 0.8 
          ? 'Great job! Keep maintaining your healthy lifestyle'
          : normalCount / totalTests > 0.6 
          ? 'Focus on improving areas marked as High or Low'
          : 'Priority: Address abnormal results with healthcare provider',
        actionButton: normalCount / totalTests <= 0.6 
          ? { text: 'Book Consultation', action: '/booking' }
          : { text: 'View Products', action: '/catalog' }
      });

      // Add Risk Assessment metric
      const highRiskCount = statusCounts['High'] || 0;
      const criticalCount = statusCounts['Critical'] || 0;
      const riskLevel = criticalCount > 0 ? 'Critical' : highRiskCount > 0 ? 'Moderate' : 'Low';
      
      metrics.push({
        title: 'Risk Assessment',
        value: riskLevel,
        status: riskLevel === 'Low' ? 'Good' : riskLevel === 'Moderate' ? 'Monitor' : 'Action Needed',
        trend: highRiskCount > 0 ? '-2%' : '+3%',
        trendDirection: highRiskCount > 0 ? 'down' : 'up',
        color: riskLevel === 'Low' ? 'green' : riskLevel === 'Moderate' ? 'yellow' : 'red',
        chartHeight: [65, 55, 60, 58],
        actionableInsight: riskLevel === 'Low' 
          ? 'All biomarkers within healthy ranges'
          : riskLevel === 'Moderate' 
          ? 'Some elevated markers require attention'
          : 'Immediate intervention recommended for critical values',
        actionButton: riskLevel !== 'Low' 
          ? { text: 'Consult Doctor', action: '/booking' }
          : undefined
      });

      // Add Lab Compliance metric
      const recentTests = labResults.filter(result => {
        const testDate = new Date(result.date);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return testDate >= threeMonthsAgo;
      }).length;

      metrics.push({
        title: 'Lab Tracking',
        value: `${recentTests} tests`,
        status: recentTests >= 5 ? 'Active' : recentTests >= 2 ? 'Moderate' : 'Inactive',
        trend: `+${recentTests}`,
        trendDirection: 'up',
        color: recentTests >= 5 ? 'green' : recentTests >= 2 ? 'yellow' : 'orange',
        chartHeight: [40, 55, 65, Math.min(75, 40 + recentTests * 7)],
        actionableInsight: recentTests >= 5 
          ? 'Excellent monitoring - stay consistent with testing'
          : recentTests >= 2 
          ? 'Good tracking - consider more frequent testing'
          : 'Schedule regular lab work for better health monitoring',
        actionButton: recentTests < 5 
          ? { text: 'Upload Labs', action: 'upload' }
          : undefined
      });
    }

    return metrics.slice(0, 4); // Show only first 4 metrics
  }, [labResults]);

  // Generate health summary and product recommendations
  const healthSummary = useMemo(() => {
    const statusCounts = labResults.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const totalTests = labResults.length;
    const normalCount = statusCounts['Normal'] || 0;
    const highCount = statusCounts['High'] || 0;
    const lowCount = statusCounts['Low'] || 0;
    const criticalCount = statusCounts['Critical'] || 0;

    // Generate summary text
    let summaryText = '';
    let alertLevel: 'good' | 'warning' | 'danger' = 'good';

    if (criticalCount > 0) {
      summaryText = `You have ${criticalCount} critical result${criticalCount > 1 ? 's' : ''} that require immediate attention.`;
      alertLevel = 'danger';
    } else if (highCount > 0) {
      summaryText = `${normalCount} of ${totalTests} results are normal. ${highCount} elevated marker${highCount > 1 ? 's' : ''} need${highCount === 1 ? 's' : ''} attention.`;
      alertLevel = 'warning';
    } else if (lowCount > 0) {
      summaryText = `${normalCount} of ${totalTests} results are normal. ${lowCount} marker${lowCount > 1 ? 's are' : ' is'} below optimal range.`;
      alertLevel = 'warning';
    } else {
      summaryText = `Excellent! All ${totalTests} lab results are within normal ranges.`;
      alertLevel = 'good';
    }

    // Generate product recommendations based on lab results
    const recommendations: Product[] = [];
    
    // Look for specific health issues and recommend products
    labResults.forEach(result => {
      if (result.status === 'High' || result.status === 'Low') {
        switch (result.test.toLowerCase()) {
          case 'vitamin d':
            if (result.status === 'Low') {
              // Find stress-related supplements (ashwagandha helps with vitamin absorption)
              const stressProduct = products.find(p => p.name.toLowerCase().includes('harmonia'));
              if (stressProduct && !recommendations.find(r => r.name === stressProduct.name)) {
                recommendations.push(stressProduct);
              }
            }
            break;
          case 'total cholesterol':
          case 'ldl cholesterol':
          case 'triglycerides':
            if (result.status === 'High') {
              // Find stress management products that can help with heart health
              const stressProduct = products.find(p => p.name.toLowerCase().includes('stress'));
              if (stressProduct && !recommendations.find(r => r.name === stressProduct.name)) {
                recommendations.push(stressProduct);
              }
            }
            break;
        }
      }
    });

    // Add general wellness products if no specific recommendations
    if (recommendations.length === 0) {
      const generalWellness = products.find(p => p.name.toLowerCase().includes('harmonia'));
      if (generalWellness) recommendations.push(generalWellness);
    }

    // Add sleep-related products for overall health
    const sleepProduct = products.find(p => p.name.toLowerCase().includes('uni') || p.name.toLowerCase().includes('valeriaana'));
    if (sleepProduct && !recommendations.find(r => r.name === sleepProduct.name) && recommendations.length < 3) {
      recommendations.push(sleepProduct);
    }

    return {
      summaryText,
      alertLevel,
      recommendations: recommendations.slice(0, 3) // Max 3 recommendations
    };
  }, [labResults]);

  // Group lab results by date and calculate status for each date
  const groupedLabResults = useMemo(() => {
    const grouped: { [date: string]: LabEntry[] } = {};
    
    labResults.forEach(result => {
      if (!grouped[result.date]) {
        grouped[result.date] = [];
      }
      grouped[result.date].push(result);
    });

    // Convert to array and calculate overall status for each date
    return Object.entries(grouped)
      .map(([date, results]) => {
        const statusCounts = results.reduce((acc, result) => {
          acc[result.status] = (acc[result.status] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        const hasCritical = statusCounts['Critical'] > 0;
        const hasHigh = statusCounts['High'] > 0;
        const hasLow = statusCounts['Low'] > 0;
        const normalCount = statusCounts['Normal'] || 0;

        let overallStatus: 'Normal' | 'Low' | 'High' | 'Critical' = 'Normal';
        let statusText = `${normalCount}/${results.length} Normal`;

        if (hasCritical) {
          overallStatus = 'Critical';
          statusText = `${statusCounts['Critical']} Critical`;
        } else if (hasHigh) {
          overallStatus = 'High';
          statusText = `${statusCounts['High']} High`;
        } else if (hasLow) {
          overallStatus = 'Low';
          statusText = `${statusCounts['Low']} Low`;
        }

        return {
          date,
          results,
          overallStatus,
          statusText,
          totalTests: results.length
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date descending
  }, [labResults]);

  const toggleAccordion = (date: string) => {
    setExpandedAccordions(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleLabResultsAdded = (processedResults: ProcessedResults) => {
    // Convert the processed results to our lab entry format
    const newEntries: LabEntry[] = processedResults.results.map(result => ({
      date: processedResults.date,
      test: result.test,
      result: result.result,
      referenceRange: result.referenceRange,
      status: result.status
    }));

    // Add new results to the top of the list
    setLabResults(prev => [...newEntries, ...prev]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal':
        return 'bg-green-100 text-green-800';
      case 'Low':
        return 'bg-yellow-100 text-yellow-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
  <Page 
    title="Health Dashboard" 
    subtitle="Track your progress and monitor key health metrics over time."
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Health Summary Section */}
      <section className="mb-8">
        <Card className={`border-l-4 ${
          healthSummary.alertLevel === 'good' ? 'border-l-green-500' :
          healthSummary.alertLevel === 'warning' ? 'border-l-yellow-500' :
          'border-l-red-500'
        }`}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                healthSummary.alertLevel === 'good' ? 'bg-green-100' :
                healthSummary.alertLevel === 'warning' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <span className={`text-lg ${
                  healthSummary.alertLevel === 'good' ? 'text-green-600' :
                  healthSummary.alertLevel === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {healthSummary.alertLevel === 'good' ? '✓' :
                   healthSummary.alertLevel === 'warning' ? '⚠️' : '⚠️'}
                </span>
              </div>
              <div>
                <CardTitle className="text-lg">Health Summary</CardTitle>
                <p className="text-gray-600 text-sm">Based on your latest lab results</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800 mb-4">{healthSummary.summaryText}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link to="/chat">Chat with AI about your results</Link>
              </Button>
              {healthSummary.alertLevel !== 'good' && (
                <>
                  <Button size="sm" asChild>
                    <Link to="/booking">Book Consultation</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/catalog">View Supplements</Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Product Recommendations Section */}
      {healthSummary.recommendations.length > 0 && (
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Recommended for You</h2>
            <p className="text-gray-600 text-sm">Personalized product suggestions based on your health metrics</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthSummary.recommendations.map((product, index) => (
              <Card key={index} className="h-fit hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {product.image_url && (
                    <div className="aspect-square w-full mb-3 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                    {product.description ? 
                      product.description.substring(0, 120) + '...' : 
                      'Quality health product to support your wellness journey'
                    }
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">{product.price}</span>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/catalog?search=${encodeURIComponent(product.name)}`}>
                        View Product
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
      {/* Health Metrics Overview */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Metrics Overview</h2>
          <p className="text-gray-600">Actionable insights based on your latest lab results</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {healthMetrics.map((metric, index) => (
            <Card key={index} className="h-fit">
              <CardHeader className="pb-2 px-3 pt-3 sm:px-4 sm:pt-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xs sm:text-sm font-medium leading-tight">{metric.title}</CardTitle>
                  <span className={`text-xs sm:text-sm font-medium flex items-center ${
                    metric.trendDirection === 'up' ? 'text-green-600' : 
                    metric.trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trendDirection === 'up' ? '↗️' : 
                     metric.trendDirection === 'down' ? '↘️' : '➡️'} {metric.trend}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-1">{metric.value}</div>
                <div className={`text-xs sm:text-sm mb-2 ${
                  metric.color === 'green' ? 'text-green-600' :
                  metric.color === 'yellow' ? 'text-yellow-600' :
                  metric.color === 'orange' ? 'text-orange-600' :
                  metric.color === 'red' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.status}
                </div>
                
                {/* Actionable Insight */}
                <div className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {metric.actionableInsight}
                </div>

                {/* Mini Chart */}
                <div className="flex items-end space-x-1 h-6 sm:h-8 mb-3">
                  {metric.chartHeight.map((height, chartIndex) => (
                    <div 
                      key={chartIndex}
                      className={`w-2 flex-1 ${
                        metric.color === 'green' ? 'bg-green-600' :
                        metric.color === 'yellow' ? 'bg-yellow-600' :
                        metric.color === 'orange' ? 'bg-orange-600' :
                        metric.color === 'red' ? 'bg-red-600' : 'bg-gray-600'
                      }`}
                      style={{height: `${height}%`}}
                    />
                  ))}
                </div>

                {/* Action Button */}
                {metric.actionButton && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-7 sm:h-8"
                    asChild={metric.actionButton.action !== 'upload'}
                  >
                    {metric.actionButton.action === 'upload' ? (
                      <span className="cursor-pointer">{metric.actionButton.text}</span>
                    ) : (
                      <Link to={metric.actionButton.action}>
                        {metric.actionButton.text}
                      </Link>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Lab Results Section */}
      <section>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Lab Results History</CardTitle>
              </div>
              <div className="flex gap-2">
                <LabUpload onResultsAdded={handleLabResultsAdded} />
                <Button variant="outline" size="sm">
                  + Add Manual Result
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {groupedLabResults.map((dateGroup) => {
                const isExpanded = expandedAccordions.includes(dateGroup.date);
                return (
                  <Card key={dateGroup.date} className="border border-gray-200">
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleAccordion(dateGroup.date)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold text-lg">{dateGroup.date}</h3>
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
                      <CardContent className="pt-0">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-2 text-sm font-medium text-gray-700">Test</th>
                                <th className="text-left py-2 text-sm font-medium text-gray-700">Result</th>
                                <th className="text-left py-2 text-sm font-medium text-gray-700">Reference Range</th>
                                <th className="text-left py-2 text-sm font-medium text-gray-700">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {dateGroup.results.map((result, index) => (
                                <tr key={index}>
                                  <td className="py-3 text-sm text-gray-900">{result.test}</td>
                                  <td className="py-3 text-sm font-medium text-gray-900">{result.result}</td>
                                  <td className="py-3 text-sm text-gray-600">{result.referenceRange}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                                      {result.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  </Page>
  );
};

export default Dashboard;
