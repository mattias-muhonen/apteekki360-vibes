import { useState, useMemo, useRef, useEffect } from 'react';
import Page from '../../components/Page';
import { products } from '../../products';
import type { Product } from '../../products';
import { generateAIHealthResponse } from '../../services/openai';
import { useAuth } from '../../contexts/AuthContext';
import UserDataService from '../../services/userDataService';

// Import section components
import HealthSummarySection from './components/HealthSummarySection';
import ProductRecommendationsSection from './components/ProductRecommendationsSection';
import ActionPlanSection from './components/ActionPlanSection';
import HealthMetricsOverviewSection from './components/HealthMetricsOverviewSection';
import LabResultsSection from './components/LabResultsSection';
import ChatPanel from './components/ChatPanel';

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
  id?: string; // Add unique identifier for deletion
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
  const { user } = useAuth();
  const userDataService = UserDataService.getInstance();
  
  // Lab results data from userDataService
  const [labResults, setLabResults] = useState<LabEntry[]>([]);

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

  // Load user lab results from userDataService
  useEffect(() => {
    if (user?.id) {
      const userData = userDataService.getUserData(user.id);
      setLabResults(userData.labResults);
    }
  }, [user?.id, userDataService]);

  // Function to handle lab result deletion
  const handleDeleteLabResult = (resultId: string) => {
    if (user?.id && resultId) {
      userDataService.deleteLabResult(user.id, resultId);
      const updatedData = userDataService.getUserData(user.id);
      setLabResults(updatedData.labResults);
    }
  };

  // Function to delete all lab results for a specific date
  const handleDeleteDateGroup = (date: string) => {
    if (user?.id) {
      // Get current lab results
      const userData = userDataService.getUserData(user.id);
      // Filter out all results from the specified date
      const filteredResults = userData.labResults.filter(result => result.date !== date);
      // Update the lab results
      userDataService.updateLabResults(user.id, filteredResults);
      // Refresh the display
      setLabResults(filteredResults);
    }
  };

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

    // Sort each group by date (most recent first)
    Object.keys(testGroups).forEach(testName => {
      testGroups[testName].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    // Priority tests to show first
    const priorityTests = [
      'Total Cholesterol',
      'LDL Cholesterol', 
      'HDL Cholesterol',
      'Triglycerides',
      'Glucose (fasting)',
      'Hemoglobin',
      'Creatinine'
    ];

    // Create metrics for priority tests first
    priorityTests.forEach(testName => {
      const results = testGroups[testName];
      if (results && results.length > 0) {
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
            case 'glucose (fasting)':
              return status === 'High' ? 'Focus on blood sugar management through diet and exercise' :
                     status === 'Low' ? 'Ensure regular meals and balanced nutrition' :
                     'Excellent glucose control - keep it up';
            case 'hemoglobin':
              return status === 'Low' ? 'Consider iron-rich foods and vitamin C for absorption' :
                     status === 'High' ? 'Stay well hydrated and monitor with doctor' :
                     'Good oxygen carrying capacity';
            case 'creatinine':
              return status === 'High' ? 'Focus on kidney health - stay hydrated and limit protein' :
                     status === 'Low' ? 'Maintain adequate protein intake' :
                     'Excellent kidney function';
            default:
              return status === 'Normal' ? 'Continue current health practices' :
                     status === 'High' ? 'Consult healthcare provider for guidance' :
                     'Consider lifestyle modifications or supplementation';
          }
        };

        const getActionButton = (testName: string, status: string) => {
          if (status === 'High' || status === 'Low' || status === 'Critical') {
            switch (testName.toLowerCase()) {
              case 'ldl cholesterol':
                return undefined; // No button for LDL Cholesterol
              case 'glucose (fasting)':
                return { text: 'Blood Sugar Tips', action: '/catalog?search=glucose' };
              case 'hemoglobin':
                return { text: 'Iron Support', action: '/catalog?search=iron' };
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

    // If we have less than 4 metrics, add calculated ones
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
    }

    return metrics.slice(0, 4); // Show only first 4 metrics
  }, [labResults]);

  // Generate health summary and product recommendations
  const healthSummary = useMemo(() => {
    // Handle case when there are no lab results
    if (labResults.length === 0) {
      return {
        summaryText: 'Summary can be provided when lab results are uploaded.',
        alertLevel: 'no-data' as const,
        recommendations: []
      };
    }

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

    // Add stress management products if we still need more
    const stressManagementProduct = products.find(p => p.name.toLowerCase().includes('bertils') || p.name.toLowerCase().includes('no stress'));
    if (stressManagementProduct && !recommendations.find(r => r.name === stressManagementProduct.name) && recommendations.length < 3) {
      recommendations.push(stressManagementProduct);
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
    if (!user?.id) return;

    // Convert the processed results to our lab entry format (without IDs, userDataService will add them)
    const newEntries: Omit<LabEntry, 'id'>[] = processedResults.results.map(result => ({
      date: processedResults.date,
      test: result.test,
      result: result.result,
      referenceRange: result.referenceRange,
      status: result.status
    }));

    // Add new results using userDataService
    userDataService.addLabResults(user.id, newEntries);
    
    // Refresh the lab results from userDataService
    const updatedData = userDataService.getUserData(user.id);
    setLabResults(updatedData.labResults);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Content - Left Side */}
        <div className="xl:col-span-3 space-y-12">
          
          {/* Health Summary Section */}
          <HealthSummarySection 
            healthSummary={healthSummary}
            onLabResultsAdded={handleLabResultsAdded}
            onChatWithAI={handleChatWithAI}
          />

          {/* Product Recommendations Section */}
          {healthSummary.recommendations.length > 0 && (
            <ProductRecommendationsSection recommendations={healthSummary.recommendations} />
          )}

          {/* Your Recommended Action Plan Section */}
          <ActionPlanSection />

 {/* Health Metrics Overview */}
          <HealthMetricsOverviewSection 
            healthSummary={healthSummary}
            healthMetrics={healthMetrics}
            labResults={labResults}
            onChatWithAI={handleChatWithAI}
            onDiscussMetricWithAI={handleDiscussMetricWithAI}
          />

          {/* Lab Results Section */}
          <LabResultsSection 
            groupedLabResults={groupedLabResults}
            expandedAccordions={expandedAccordions}
            onLabResultsAdded={handleLabResultsAdded}
            onToggleAccordion={toggleAccordion}
            onDeleteLabResult={handleDeleteLabResult}
            onDeleteDateGroup={handleDeleteDateGroup}
            getStatusColor={getStatusColor}
          />
        </div>

        {/* Chat Panel - Right Side */}
        <ChatPanel 
          isChatMinimized={isChatMinimized}
          chatMessages={chatMessages}
          chatInput={chatInput}
          isTyping={isTyping}
          onToggleMinimized={() => setIsChatMinimized(!isChatMinimized)}
          onChatInputChange={setChatInput}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  </Page>
  );
};

export default Dashboard;
