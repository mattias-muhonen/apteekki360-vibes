import React from 'react';
import { stories } from '../../data/stories';
import Page from '../../components/Page';
import { useLanguage } from '../../contexts/LanguageContext';

const Stories: React.FC = () => {
  const { t, language } = useLanguage();
  
  return (
    <Page 
      title={t('stories.title')}
      subtitle={t('stories.subtitle')}
    >
      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <span className="text-blue-600 font-bold text-lg">
                    {story.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{story.name}</h3>
                  <p className="text-sm text-gray-600">{story.description[language]}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">{story.story[language]}</p>
              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 text-sm">
                "{story.message[language]}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('stories.ready_title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('stories.ready_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                {t('stories.start_journey')}
              </button>
              <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
                {t('stories.learn_more')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Stories;
