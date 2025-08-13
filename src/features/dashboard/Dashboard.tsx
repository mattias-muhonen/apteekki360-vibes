import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../../components/ui';
import LabUpload from '../lab-upload/LabUpload';
import { products } from '../../products';
import type { Product } from '../../products';
import { generateAIHealthResponse } from '../../services/openai';
import { useAuth } from '../../contexts/AuthContext';
import UserDataService from '../../services/userDataService';
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
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Health Summary</h2>
              <p className="text-gray-600">Your current health status at a glance</p>
            </div>
            <Card className={`border-l-4 shadow-sm hover:shadow-md transition-shadow ${
              healthSummary.alertLevel === 'good' ? 'border-l-green-500' :
              healthSummary.alertLevel === 'warning' ? 'border-l-yellow-500' :
              'border-l-red-500'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    healthSummary.alertLevel === 'good' ? 'bg-green-100' :
                    healthSummary.alertLevel === 'warning' ? 'bg-yellow-100' :
                    'bg-red-100'
                  }`}>
                    <span className={`text-xl ${
                      healthSummary.alertLevel === 'good' ? 'text-green-600' :
                      healthSummary.alertLevel === 'warning' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {healthSummary.alertLevel === 'good' ? '✓' :
                       healthSummary.alertLevel === 'warning' ? '⚠️' : '⚠️'}
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
                  <Button size="sm" variant="outline" onClick={handleChatWithAI} className="flex items-center gap-2">
                    <span>💬</span>
                    Chat with AI about your results
                  </Button>
                  {healthSummary.alertLevel !== 'good' && (
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

          {/* Product Recommendations Section */}
          {healthSummary.recommendations.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                <p className="text-gray-600">Personalized product suggestions based on your health metrics</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {healthSummary.recommendations.slice(0, 3).map((product, index) => (
                    <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white">
                      <CardContent className="p-4 flex flex-col h-full">
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
                        <p className="text-xs text-gray-600 mb-3 line-clamp-3 leading-relaxed flex-1">
                          {product.description ? 
                            product.description.substring(0, 120) + '...' : 
                            'Quality health product to support your wellness journey'
                          }
                        </p>
                        <div className="flex items-center justify-between mt-auto">
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
                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link to="/catalog">More products</Link>
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* Your Recommended Action Plan Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Your Recommended Action Plan</h2>
              <p className="text-gray-600">Personalized health improvement plans based on your lab results and metrics</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Healthy Nutrition Plan */}
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white border-green-200">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">🥗</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">Healthy Nutrition Plan</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">
                      A comprehensive nutrition guide tailored to your health metrics. Includes meal plans, portion control, and nutrient timing to optimize your biomarkers and energy levels.
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-green-600">€49.99</span>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Purchase Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Cut Sugar & Carbs Plan */}
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white border-orange-200">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">🚫</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">Cut Sugar & Carbs</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">
                      Strategic carbohydrate reduction plan to improve insulin sensitivity and metabolic health. Perfect for addressing elevated glucose and triglyceride levels.
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-orange-600">€39.99</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Purchase Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Increase Testosterone Levels Plan */}
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white border-blue-200">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <span className="text-2xl">💪</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">Increase Testosterone Levels</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">
                      Natural testosterone optimization through targeted nutrition, exercise protocols, and lifestyle modifications. Includes sleep optimization and stress management techniques.
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-blue-600">€59.99</span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Purchase Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>

              </div>
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link to="/plans">View All Plans</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Health Metrics Overview */}
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
                    <Button size="sm" variant="outline" onClick={handleChatWithAI} className="flex items-center gap-2">
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
                            onClick={() => handleDiscussMetricWithAI(metric)}
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

          {/* Lab Results Section */}
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
                    <LabUpload onResultsAdded={handleLabResultsAdded} />
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <span>➕</span>
                      Add Manual Result
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {groupedLabResults.map((dateGroup) => {
                    const isExpanded = expandedAccordions.includes(dateGroup.date);
                    return (
                      <Card key={dateGroup.date} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader 
                          className="cursor-pointer hover:bg-gray-50 transition-colors p-4"
                          onClick={() => toggleAccordion(dateGroup.date)}
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
                                            onClick={() => handleDeleteLabResult(result.id!)}
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
          <div className="fixed bottom-4 right-4 xl:fixed xl:bottom-4 xl:right-4 xl:w-80">
            <Card className={`w-80 xl:w-80 flex flex-col shadow-lg border-gray-200 transition-all duration-300 ${
              isChatMinimized ? 'h-14' : 'h-[700px]'
            }`}>
              <CardHeader className="flex-shrink-0 border-b border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      🤖 AI Health Assistant
                    </CardTitle>
                    {!isChatMinimized && (
                      <p className="text-sm text-gray-600 mt-1">Get instant insights about your health data</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatMinimized(!isChatMinimized)}
                    className="h-8 w-8 p-0 hover:bg-white/50"
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
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-2 text-sm shadow-sm ${
                          message.isUser
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-900 rounded-lg px-4 py-2 text-sm border border-gray-200 shadow-sm">
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
                <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-white">
                  <div className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about your health results..."
                      className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
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
                      className="bg-blue-600 hover:bg-blue-700"
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
