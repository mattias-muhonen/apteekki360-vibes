import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent } from '../../../components/ui';

const ActionPlanSection: React.FC = () => {
  return (
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
  );
};

export default ActionPlanSection;
