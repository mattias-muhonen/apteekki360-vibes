import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import UserDataService from '../../services/userDataService';
import { plans } from '../../plans';
import type { Plan as PlanType } from '../../plans';
import OpenAI from 'openai';

interface LabEntry {
  date: string;
  test: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  id?: string;
}

interface UserPlan {
  id: string;
  planTitle: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  targetDate: string;
  nextAction: string;
  description: string;
}

const Plan: React.FC = () => {
  const { user } = useAuth();
  const userDataService = UserDataService.getInstance();
  
  const [labResults, setLabResults] = useState<LabEntry[]>([]);
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);
  const [recommendedPlans, setRecommendedPlans] = useState<PlanType[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  // Load user data
  useEffect(() => {
    if (user?.id) {
      const userData = userDataService.getUserData(user.id);
      setLabResults(userData.labResults);
      
      // Mock user plans for now - in a real app these would come from the backend
      setUserPlans([
        {
          id: '1',
          planTitle: 'Heart Health Plan',
          progress: 65,
          status: 'active',
          startDate: '2024-12-01',
          targetDate: '2025-03-01',
          nextAction: 'Complete second blood test',
          description: 'Monitoring cardiovascular health and cholesterol levels'
        },
        {
          id: '2', 
          planTitle: 'Energy Plan',
          progress: 30,
          status: 'active',
          startDate: '2024-12-15',
          targetDate: '2025-04-15',
          nextAction: 'Schedule consultation call',
          description: 'Addressing fatigue and optimizing energy levels'
        }
      ]);
    }
  }, [user?.id, userDataService]);

  // Get AI recommendations based on lab results
  useEffect(() => {
    const abnormalResults = labResults.filter(result => result.status !== 'Normal');
    if (abnormalResults.length > 0) {
      getAIRecommendations(abnormalResults);
    } else {
      // Show popular plans when no abnormal results
      setRecommendedPlans(plans.slice(0, 3));
    }
  }, [labResults]);

  const getAIRecommendations = async (abnormalResults: LabEntry[]) => {
    setIsLoadingRecommendations(true);
    
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const labSummary = abnormalResults.map(result => 
        `${result.test}: ${result.result} (${result.status}, reference: ${result.referenceRange})`
      ).join('\n');

      const planTitles = plans.map(p => p.title).join('\n');

      const prompt = `Based on these abnormal lab results:
${labSummary}

From this list of available health plans, recommend exactly 3 plans that would be most beneficial:
${planTitles}

Respond with only the exact plan titles, one per line, no additional text or formatting.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a health expert recommending action plans based on lab results. Respond only with exact plan titles from the provided list, one per line.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      const aiResponse = response.choices[0]?.message?.content?.trim();
      
      if (aiResponse) {
        const recommendedPlanTitles = aiResponse.split('\n').map(title => title.trim()).filter(title => title);
        
        const recommendedPlanObjects = recommendedPlanTitles
          .map(title => plans.find(p => p.title === title))
          .filter((plan): plan is PlanType => plan !== undefined)
          .slice(0, 3);

        setRecommendedPlans(recommendedPlanObjects);
      } else {
        setRecommendedPlans(plans.slice(0, 3));
      }

    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setRecommendedPlans(plans.slice(0, 3));
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const getPlanIcon = (title: string): string => {
    if (title.includes('Heart')) return '❤️';
    if (title.includes('Weight')) return '⚖️';
    if (title.includes('Energy')) return '⚡';
    if (title.includes('Sleep')) return '😴';
    if (title.includes('Testosterone') || title.includes('Performance')) return '💪';
    if (title.includes('Focus') || title.includes('Mood')) return '🧠';
    if (title.includes('Hormone')) return '🧬';
    if (title.includes('Longevity')) return '🌟';
    if (title.includes('Monitoring')) return '📊';
    return '🎯';
  };

  const getPlanColor = (title: string): { bg: string; border: string; text: string } => {
    if (title.includes('Heart')) return { bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-600' };
    if (title.includes('Weight')) return { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-600' };
    if (title.includes('Energy')) return { bg: 'bg-yellow-100', border: 'border-yellow-200', text: 'text-yellow-600' };
    if (title.includes('Sleep')) return { bg: 'bg-indigo-100', border: 'border-indigo-200', text: 'text-indigo-600' };
    if (title.includes('Testosterone') || title.includes('Performance')) return { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-600' };
    if (title.includes('Focus') || title.includes('Mood')) return { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-600' };
    if (title.includes('Hormone')) return { bg: 'bg-pink-100', border: 'border-pink-200', text: 'text-pink-600' };
    if (title.includes('Longevity')) return { bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-600' };
    if (title.includes('Monitoring')) return { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-600' };
    return { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-600' };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <Page title="My Health Plan" subtitle="Track your personalized health journey and discover new plans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Active Plans Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">My Active Plans</h2>
            <p className="text-gray-600">Track progress on your current health improvement plans</p>
          </div>

          {userPlans.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-gray-400">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No Active Plans Yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start your health journey by choosing a personalized plan based on your lab results and health goals.
                </p>
                <Button size="lg" asChild>
                  <Link to="/catalog">Browse Available Plans</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userPlans.map((plan) => {
                const colors = getPlanColor(plan.planTitle);
                return (
                  <Card key={plan.id} className={`hover:shadow-lg transition-all duration-200 ${colors.border}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center`}>
                            <span className="text-2xl">{getPlanIcon(plan.planTitle)}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{plan.planTitle}</CardTitle>
                            <p className="text-sm text-gray-600">{plan.description}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${colors.bg.replace('-100', '-500')}`}
                            style={{ width: `${plan.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Timeline */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Started:</span>
                          <p className="font-medium">{formatDate(plan.startDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Target:</span>
                          <p className="font-medium">{formatDate(plan.targetDate)}</p>
                        </div>
                      </div>
                      
                      {/* Next Action */}
                      <div className={`${colors.bg} ${colors.border} border rounded-lg p-3`}>
                        <h4 className="font-medium text-gray-900 mb-1">Next Action</h4>
                        <p className="text-sm text-gray-700">{plan.nextAction}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Update Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Recommended Plans Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Plans</h2>
            <p className="text-gray-600">
              {labResults.filter(r => r.status !== 'Normal').length > 0 
                ? 'AI-selected plans based on your lab results that need attention'
                : 'Popular health improvement plans to enhance your wellbeing'
              }
            </p>
          </div>

          {isLoadingRecommendations ? (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3 text-gray-600">Getting personalized recommendations...</span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedPlans.map((plan, index) => {
                  const colors = getPlanColor(plan.title);
                  return (
                    <Card key={index} className={`h-full flex flex-col hover:shadow-lg transition-all duration-200 hover:scale-105 bg-white ${colors.border}`}>
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center mb-4`}>
                          <span className="text-2xl">{getPlanIcon(plan.title)}</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-900">{plan.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-1">
                          {plan.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className={`text-lg font-bold ${colors.text}`}>{plan.price}</span>
                          <Button size="sm" className={`${colors.bg.replace('-100', '-600')} hover:${colors.bg.replace('-100', '-700')} text-white`}>
                            Start Plan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" asChild>
                  <Link to="/catalog">View All Available Plans</Link>
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Common actions to manage your health plans</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Upload Lab Results</h3>
                <p className="text-sm text-gray-600">Add new lab data to track progress</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Schedule Consultation</h3>
                <p className="text-sm text-gray-600">Book a call with health experts</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Set Goals</h3>
                <p className="text-sm text-gray-600">Define your health targets</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">AI Health Chat</h3>
                <p className="text-sm text-gray-600">Get instant health insights</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Page>
  );
};

export default Plan;
