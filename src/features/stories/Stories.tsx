import React from 'react';
import { stories } from '../../data/stories';
import type { Story } from '../../data/stories';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui';
import Page from '../../components/Page';

const Stories: React.FC = () => {
  return (
    <Page 
      title="Success Stories"
      subtitle="Real people, real transformations. Read how our community members have improved their health and transformed their lives through personalized health insights and guidance."
    >
      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story: Story, index: number) => (
            <StoryCard key={index} story={story} />
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Write Your Own Success Story?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of people who have transformed their health with personalized insights and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Start Your Health Journey
              </button>
              <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {story.name.charAt(0)}
            </span>
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {story.name}
            </CardTitle>
            <p className="text-sm text-gray-600">{story.description}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
              Their Journey
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {story.story}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
              Their Message
            </h3>
            <blockquote className="text-gray-700 italic leading-relaxed">
              "{story.message}"
            </blockquote>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center text-green-600">
            <span className="text-sm font-medium">Verified Success Story</span>
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Stories;
