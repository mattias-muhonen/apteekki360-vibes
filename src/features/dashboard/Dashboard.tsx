import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../../components/ui';
import LabUpload from '../lab-upload/LabUpload';
import { products } from '../../products';
import type { Product } from '../../products';
import { generateAIHealthResponse } from '../../services/openai';

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

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([
    {
      id: '1',
      text: 'Hello! I\'m your AI health assistant. I can help you understand your lab results and provide personalized health insights. What would you like to know about your health data?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

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

  // Chat functionality
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleDiscussMetricWithAI = async (metric: HealthMetric) => {
    // Ensure chat is visible when triggered
    setIsChatMinimized(false);
    
    const prompt = `Tell me about ${metric.title}: Current value is ${metric.value} with status ${metric.status}. Explain what ${metric.title} measures and its effects on health. ${metric.status !== 'Normal Range' && metric.status !== 'Normal' && metric.status !== 'Good' && metric.status !== 'Excellent' && metric.status !== 'Active' ? 'Since this value is not optimal, please provide a short suggestion on how to improve it.' : ''}`;

    // Add the prompt as a user message
    const userMessage = {
      id: Date.now().toString(),
      text: prompt,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponseText = await generateAIHealthResponse(
        prompt,
        labResults,
        chatMessages
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      const fallbackResponse = generateMetricFallbackResponse(metric);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateMetricFallbackResponse = (metric: HealthMetric) => {
    const isNormal = metric.status === 'Normal Range' || metric.status === 'Normal' || metric.status === 'Good' || metric.status === 'Excellent' || metric.status === 'Active';
    
    switch (metric.title.toLowerCase()) {
      case 'total cholesterol':
        return `Total cholesterol measures the overall amount of cholesterol in your blood. It's important for cell membrane structure but elevated levels increase cardiovascular disease risk. Your current level is ${metric.value} (${metric.status}). ${!isNormal ? 'To improve: Focus on heart-healthy foods like oats, nuts, fish, and reduce saturated fats. Regular exercise helps significantly.' : 'Keep maintaining your current healthy lifestyle!'}`;
      
      case 'hdl cholesterol':
        return `HDL (High-Density Lipoprotein) is "good" cholesterol that helps remove other cholesterol from arteries, protecting against heart disease. Your level is ${metric.value} (${metric.status}). ${!isNormal ? 'To improve: Increase aerobic exercise, consume omega-3 rich foods like salmon and walnuts, and maintain a healthy weight.' : 'Excellent! Your HDL levels are protective for cardiovascular health.'}`;
      
      case 'ldl cholesterol':
        return `LDL (Low-Density Lipoprotein) is "bad" cholesterol that can build up in arteries, increasing heart disease risk. Your level is ${metric.value} (${metric.status}). ${!isNormal ? 'To improve: Reduce saturated and trans fats, increase soluble fiber (oats, beans), and consider plant sterols. Regular cardio exercise is very effective.' : 'Great job maintaining healthy LDL levels!'}`;
      
      case 'triglycerides':
        return `Triglycerides are blood fats that provide energy. High levels increase risk of heart disease and pancreatitis. Your level is ${metric.value} (${metric.status}). ${!isNormal ? 'To improve: Limit simple carbs and sugar, reduce alcohol, increase omega-3 fatty acids, and maintain regular physical activity.' : 'Your triglyceride levels are in a healthy range.'}`;
      
      case 'vitamin d':
        return `Vitamin D is crucial for bone health, immune function, and mood regulation. It helps calcium absorption and supports muscle strength. Your level is ${metric.value} (${metric.status}). ${!isNormal ? 'To improve: Increase safe sun exposure, consume fatty fish, fortified foods, or consider vitamin D3 supplements after consulting your doctor.' : 'Your vitamin D levels support optimal bone and immune health.'}`;
      
      case 'overall health score':
        return `Your Overall Health Score (${metric.value}) reflects the percentage of your lab results within normal ranges. This gives a snapshot of your current health status. ${!isNormal ? 'To improve: Focus on addressing the specific abnormal results through targeted lifestyle changes and follow up with your healthcare provider.' : 'Excellent overall health! Continue your current healthy practices.'}`;
      
      case 'risk assessment':
        return `Risk Assessment evaluates your potential health risks based on abnormal lab values. Your current risk level is ${metric.value}. ${!isNormal ? 'To reduce risk: Address elevated markers promptly through diet, exercise, stress management, and medical consultation as needed.' : 'Low risk indicates your biomarkers are within healthy ranges - keep up the good work!'}`;
      
      case 'lab tracking':
        return `Lab Tracking monitors how consistently you monitor your health through regular testing. You have ${metric.value} showing ${metric.status} monitoring. ${!isNormal ? 'To improve: Schedule regular lab work every 3-6 months for optimal health monitoring and early detection of potential issues.' : 'Excellent health monitoring habits! Regular testing helps catch issues early.'}`;
      
      default:
        return `${metric.title} shows a value of ${metric.value} with status ${metric.status}. This metric is important for tracking your overall health progress. ${!isNormal ? 'Since this value needs attention, consider discussing with your healthcare provider for personalized improvement strategies.' : 'Your levels are within a healthy range - continue your current approach!'}`;
    }
  };

  const handleChatWithAI = async () => {
    // Ensure chat is visible when triggered
    setIsChatMinimized(false);
    
    // Create a summary of lab results
    const labSummary = labResults.map(result => 
      `${result.test}: ${result.result} (${result.status}, ref: ${result.referenceRange}) - ${result.date}`
    ).join('\n');

    const prompt = `Explain these results shortly in clear simple language:\n\n${labSummary}`;

    // Add the prompt as a user message
    const userMessage = {
      id: Date.now().toString(),
      text: prompt,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponseText = await generateAIHealthResponse(
        prompt,
        labResults,
        chatMessages
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      const fallbackResponse = generateFallbackResponse(prompt, labResults);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    try {
      // Use OpenAI to generate response
      const aiResponseText = await generateAIHealthResponse(
        chatInput,
        labResults,
        chatMessages
      );

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback to local response
      const fallbackResponse = generateFallbackResponse(chatInput, labResults);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateFallbackResponse = (input: string, labData: LabEntry[]) => {
    const lowerInput = input.toLowerCase();
    
    // Analyze lab results to provide context
    const highResults = labData.filter(r => r.status === 'High');
    const lowResults = labData.filter(r => r.status === 'Low');
    const normalResults = labData.filter(r => r.status === 'Normal');

    if (lowerInput.includes('cholesterol')) {
      const cholesterolResults = labData.filter(r => r.test.toLowerCase().includes('cholesterol'));
      if (cholesterolResults.length > 0) {
        const ldl = cholesterolResults.find(r => r.test.includes('LDL'));
        if (ldl && ldl.status === 'High') {
          return `I see your LDL cholesterol is ${ldl.result}, which is ${ldl.status.toLowerCase()}. This is above the reference range of ${ldl.referenceRange}. I recommend focusing on heart-healthy foods like oats, nuts, and fish, while reducing saturated fats. Regular exercise can also help improve these levels.`;
        }
        return `Your cholesterol levels show: ${cholesterolResults.map(r => `${r.test}: ${r.result} (${r.status})`).join(', ')}. Overall, this is manageable with lifestyle adjustments.`;
      }
    }

    if (lowerInput.includes('vitamin d')) {
      const vitaminD = labData.find(r => r.test.toLowerCase().includes('vitamin d'));
      if (vitaminD) {
        return `Your Vitamin D level is ${vitaminD.result}, which is ${vitaminD.status.toLowerCase()}. ${vitaminD.status === 'Low' ? 'Consider increasing sun exposure and vitamin D3 supplementation.' : 'Your levels are good - keep maintaining your current habits.'}`;
      }
    }

    if (lowerInput.includes('results') || lowerInput.includes('summary')) {
      return `Based on your latest labs from ${labData[0]?.date}, you have ${normalResults.length} normal results${highResults.length > 0 ? `, ${highResults.length} elevated marker${highResults.length > 1 ? 's' : ''}` : ''}${lowResults.length > 0 ? `, and ${lowResults.length} low marker${lowResults.length > 1 ? 's' : ''}` : ''}. ${highResults.length > 0 ? 'Focus on addressing the elevated markers through lifestyle changes.' : 'Great job maintaining healthy levels!'}`;
    }

    if (lowerInput.includes('recommend') || lowerInput.includes('advice')) {
      if (highResults.length > 0) {
        return `Given your elevated ${highResults.map(r => r.test).join(' and ')}, I recommend: 1) Dietary modifications focusing on heart-healthy foods, 2) Regular physical activity, 3) Stress management techniques, and 4) Consider consulting with your healthcare provider for a comprehensive plan.`;
      }
      return `Your lab results look good overall! Continue your current healthy habits. Regular monitoring, balanced nutrition, adequate sleep, and staying active are key to maintaining optimal health.`;
    }

    // Default responses
    const responses = [
      `I can help you understand your lab results better. You currently have ${normalResults.length} normal results and ${highResults.length + lowResults.length} that need attention. What specific aspect would you like to discuss?`,
      `Based on your health data, I can provide insights about your cholesterol, vitamin levels, and overall health trends. What questions do you have?`,
      `I'm here to help you make sense of your lab results and provide actionable health advice. Feel free to ask about any specific test or health concern.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content - Left Side */}
        <div className="xl:col-span-3 space-y-8">{/* Health Summary Section */}
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
              <Button size="sm" variant="outline" onClick={handleChatWithAI}>
                Chat with AI about your results
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

                {/* Action Buttons */}
                <div className="space-y-2">
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-xs h-7 sm:h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleDiscussMetricWithAI(metric)}
                  >
                    Discuss with AI
                  </Button>
                </div>
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

        {/* Chat Panel - Right Side */}
        <div className="xl:col-span-1">
          <div className="fixed bottom-0 right-4 xl:fixed xl:bottom-0 xl:right-4 xl:w-80">
            <Card className={`w-80 xl:w-80 flex flex-col shadow-lg transition-all duration-300 ${
              isChatMinimized ? 'h-12' : 'h-[700px]'
            }`}>
              <CardHeader className="flex-shrink-0 border-b p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">AI Health Assistant</CardTitle>
                    {!isChatMinimized && (
                      <p className="text-sm text-gray-600">Get instant insights about your health data</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatMinimized(!isChatMinimized)}
                    className="h-6 w-6 p-0"
                  >
                    {isChatMinimized ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Button>
                </div>
              </CardHeader>
            
            {!isChatMinimized && (
              <>
                {/* Chat Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.isUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 rounded-lg px-3 py-2 text-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </CardContent>

                {/* Chat Input */}
                <div className="flex-shrink-0 border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about your health results..."
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isTyping}
                      size="sm"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  </Page>
  );
};

export default Dashboard;
