import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

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
  
  const [userPlans, setUserPlans] = useState<UserPlan[]>([]);

  // Load user data
  useEffect(() => {
    if (user?.id) {
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
        }
      ]);
    }
  }, [user?.id]);

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
            <div className="grid grid-cols-1 gap-6">
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
                            <CardTitle className="text-xl">{plan.planTitle}</CardTitle>
                            <p className="text-sm text-gray-600">{plan.description}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(plan.status)}`}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Overall Progress</span>
                          <span>{plan.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${colors.bg.replace('-100', '-500')} transition-all duration-300`}
                            style={{ width: `${plan.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Detailed Progress Breakdown */}
                      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
                        <h4 className="font-semibold text-gray-900 mb-3">Plan Milestones</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Initial health assessment completed</p>
                              <p className="text-xs text-gray-600">Completed Dec 1, 2024</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">First blood test completed</p>
                              <p className="text-xs text-gray-600">Completed Dec 15, 2024</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">✓</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Consultation with cardiologist</p>
                              <p className="text-xs text-gray-600">Completed Jan 8, 2025</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full ${colors.bg.replace('-100', '-500')} flex items-center justify-center`}>
                              <span className="text-white text-sm font-bold">4</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">Second blood test</p>
                              <p className="text-xs text-gray-600">In progress</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">5</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-400">Follow-up consultation</p>
                              <p className="text-xs text-gray-500">Scheduled for Feb 15, 2025</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">6</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-400">Final assessment & recommendations</p>
                              <p className="text-xs text-gray-500">Scheduled for Mar 1, 2025</p>
                            </div>
                          </div>
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
                      
                      {/* Key Metrics Tracking */}
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Health Metrics</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">185</p>
                            <p className="text-gray-600">Total Cholesterol</p>
                            <p className="text-xs text-green-600">↓ from 220</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">95</p>
                            <p className="text-gray-600">LDL Cholesterol</p>
                            <p className="text-xs text-green-600">↓ from 140</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-900">65</p>
                            <p className="text-gray-600">HDL Cholesterol</p>
                            <p className="text-xs text-green-600">↑ from 45</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Next Action */}
                      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
                        <h4 className="font-medium text-gray-900 mb-2">Next Action Required</h4>
                        <p className="text-sm text-gray-700 mb-3">{plan.nextAction}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📅</span>
                          <span>Scheduled for: Feb 1, 2025</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <Button size="sm" className="w-full">
                          View Detailed Progress
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          Schedule Next Test
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          Contact Support
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
            <Link to="/dashboard" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Upload Lab Results</h3>
                  <p className="text-sm text-gray-600">Add new lab data to track progress</p>
                </CardContent>
              </Card>
            </Link>
            
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
            
            <Link to="/dashboard" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">AI Health Chat</h3>
                  <p className="text-sm text-gray-600">Get instant health insights</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </Page>
  );
};

export default Plan;
