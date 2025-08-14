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
    <Page>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {/* Today's Tasks Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
            <p className="text-gray-600">Complete these daily activities for optimal health progress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exercise Task */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-xl">🏃‍♂️</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Exercise</h3>
                      <p className="text-sm text-gray-600">30 minutes cardio</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">30 min moderate intensity</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Best time:</span>
                    <span className="font-medium">Morning (7-9 AM)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Calories:</span>
                    <span className="font-medium">~250-300 kcal</span>
                  </div>
                  <Button size="sm" className="w-full mt-4">
                    Start Workout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Task */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-xl">🥗</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Nutrition</h3>
                      <p className="text-sm text-gray-600">Balanced meal planning</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-green-600 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Protein goal:</span>
                    <span className="font-medium">120g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vegetables:</span>
                    <span className="font-medium">5 servings</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Water intake:</span>
                    <span className="font-medium">2.5 liters</span>
                  </div>
                  <Button size="sm" className="w-full mt-4">
                    Log Meals
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vitamins Task */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-xl">💊</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Vitamins</h3>
                      <p className="text-sm text-gray-600">Daily supplements</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-orange-600 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vitamin D3:</span>
                    <span className="font-medium">2000 IU</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Omega-3:</span>
                    <span className="font-medium">1000mg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Magnesium:</span>
                    <span className="font-medium">400mg</span>
                  </div>
                  <Button size="sm" className="w-full mt-4">
                    Mark as Taken
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Progress Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Today's Progress</h3>
                  <p className="text-sm text-gray-600">August 14, 2025</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">0/3</div>
                  <div className="text-sm text-gray-600">Tasks completed</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm">🏃‍♂️</span>
                  </div>
                  <div className="text-xs text-gray-600">Exercise</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm">🥗</span>
                  </div>
                  <div className="text-xs text-gray-600">Nutrition</div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm">💊</span>
                  </div>
                  <div className="text-xs text-gray-600">Vitamins</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '0%'}}></div>
              </div>
              
              <p className="text-sm text-gray-600 text-center">
                Complete all tasks to maintain your health plan momentum! 🎯
              </p>
            </CardContent>
          </Card>
        </section>


        {/* Active Plans Section */}
        <section className="space-y-6">

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

                      {/* Health Metrics Progress */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Cholesterol Progress */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <span>🩺</span>
                            Total Cholesterol
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Starting:</span>
                              <span className="font-medium text-red-600">240 mg/dL</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Current:</span>
                              <span className="font-medium text-orange-600">210 mg/dL</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Goal:</span>
                              <span className="font-medium text-green-600">&lt;200 mg/dL</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{width: '75%'}}></div>
                            </div>
                          </div>
                        </div>

                        {/* Blood Pressure Progress */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <span>💓</span>
                            Blood Pressure
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Starting:</span>
                              <span className="font-medium text-red-600">140/90</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Current:</span>
                              <span className="font-medium text-orange-600">125/80</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Goal:</span>
                              <span className="font-medium text-green-600">&lt;120/80</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{width: '70%'}}></div>
                            </div>
                          </div>
                        </div>

                        {/* Weight Progress */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <span>⚖️</span>
                            Weight
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Starting:</span>
                              <span className="font-medium text-gray-600">185 lbs</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Current:</span>
                              <span className="font-medium text-blue-600">178 lbs</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Goal:</span>
                              <span className="font-medium text-green-600">170 lbs</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '47%'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline and Milestones */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Plan Timeline</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Started:</span>
                            <div className="font-medium">{formatDate(plan.startDate)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Target Date:</span>
                            <div className="font-medium">{formatDate(plan.targetDate)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Days Remaining:</span>
                            <div className="font-medium text-blue-600">28 days</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Next Action */}
                      <div className={`${colors.border} border rounded-lg p-4`}>
                        <h4 className="font-medium text-gray-900 mb-2">Next Action Required</h4>
                        <p className="text-sm text-gray-700 mb-3">{plan.nextAction}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>📅</span>
                          <span>Scheduled for: Aug 20, 2025</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <Button size="sm" className="w-full">
                          View Detailed Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Page>
  );
};

export default Plan;
