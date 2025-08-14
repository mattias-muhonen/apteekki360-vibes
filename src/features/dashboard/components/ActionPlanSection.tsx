import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent } from '../../../components/ui';
import OpenAI from 'openai';
import { plans } from '../../../plans';
import type { Plan } from '../../../plans';
import { useLanguage } from '../../../contexts/LanguageContext';

interface LabEntry {
  date: string;
  test: string;
  result: string;
  referenceRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  id?: string;
}

interface ActionPlanSectionProps {
  labResults?: LabEntry[];
}

const ActionPlanSection: React.FC<ActionPlanSectionProps> = ({
  labResults = []
}) => {
  const { t } = useLanguage();
  const [aiRecommendedPlans, setAiRecommendedPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter abnormal lab results
  const abnormalLabResults = labResults.filter(result => result.status !== 'Normal');

  useEffect(() => {
    if (abnormalLabResults.length > 0) {
      getAIPlansRecommendations();
    } else {
      // Show default plans when no abnormal results
      setAiRecommendedPlans(plans.slice(0, 3));
    }
  }, [abnormalLabResults.length]);

  const getAIPlansRecommendations = async () => {
    if (abnormalLabResults.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      // Create a detailed prompt with lab results and available plans
      const labSummary = abnormalLabResults.map(result => 
        `${result.test}: ${result.result} (${result.status}, reference: ${result.referenceRange})`
      ).join('\n');

      const planTitles = plans.map(p => p.title).join('\n');

      const prompt = `Based on these abnormal lab results:
${labSummary}

From this list of available health plans, recommend exactly 3 plans that would be most beneficial:
${planTitles}

Respond with only the exact plan titles, one per line, no additional text or formatting. Choose plans that are most relevant to addressing these specific lab abnormalities.`;

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
        
        // Find the actual plan objects
        const recommendedPlans = recommendedPlanTitles
          .map(title => plans.find(p => p.title === title))
          .filter((plan): plan is Plan => plan !== undefined)
          .slice(0, 3); // Ensure we only get 3 plans

        setAiRecommendedPlans(recommendedPlans);
      } else {
        throw new Error('No recommendations received');
      }

    } catch (error) {
      console.error('Error getting AI plan recommendations:', error);
      setError('Unable to get personalized recommendations');
      
      // Fallback to manual recommendations based on common issues
      const fallbackPlans = getFallbackPlans(abnormalLabResults);
      setAiRecommendedPlans(fallbackPlans);
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackPlans = (abnormalResults: LabEntry[]): Plan[] => {
    const recommendations: Plan[] = [];
    
    // Check for specific conditions and recommend relevant plans
    for (const result of abnormalResults) {
      const testLower = result.test.toLowerCase();
      
      if (testLower.includes('cholesterol') && result.status === 'High') {
        const heartPlan = plans.find(p => p.title === 'Heart Health Plan');
        if (heartPlan && !recommendations.find(r => r.title === heartPlan.title)) {
          recommendations.push(heartPlan);
        }
      }
      
      if (testLower.includes('testosterone') && result.status === 'Low') {
        const testoPlan = plans.find(p => p.title === 'Testosterone Plan');
        if (testoPlan && !recommendations.find(r => r.title === testoPlan.title)) {
          recommendations.push(testoPlan);
        }
      }
      
      if (testLower.includes('vitamin d') && result.status === 'Low') {
        const energyPlan = plans.find(p => p.title === 'Energy Plan');
        if (energyPlan && !recommendations.find(r => r.title === energyPlan.title)) {
          recommendations.push(energyPlan);
        }
      }
    }
    
    // Add default plans if we need more
    const defaultPlans = ['Longevity & Healthspan Plan', 'Monitoring Health Issue(s) Plan', 'Hormone Health Plan'];
    
    for (const planTitle of defaultPlans) {
      if (recommendations.length >= 3) break;
      const plan = plans.find(p => p.title === planTitle);
      if (plan && !recommendations.find(r => r.title === plan.title)) {
        recommendations.push(plan);
      }
    }
    
    return recommendations.slice(0, 3);
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
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">{t('action_plans.title')}</h2>
        <p className="text-gray-600">
          {abnormalLabResults.length > 0 
            ? t('action_plans.personalized_subtitle')
            : t('action_plans.general_subtitle')
          }
        </p>
      </div>

      {isLoading && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">{t('action_plans.loading')}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}

      {aiRecommendedPlans.length > 0 && !isLoading && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiRecommendedPlans.map((plan, index) => {
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
                      <Button size="sm" className={`${colors.bg.replace('bg-', 'bg-').replace('-100', '-600')} hover:${colors.bg.replace('bg-', 'bg-').replace('-100', '-700')}`}>
                        {t('action_plans.purchase')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-6">
            <Button variant="outline" asChild>
              <Link to="/plans">{t('action_plans.view_all')}</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ActionPlanSection;
