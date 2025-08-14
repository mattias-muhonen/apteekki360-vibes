import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'fi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation keys and values
const translations = {
  en: {
    // Navigation
    'nav.assessment': 'Assessment',
    'nav.dashboard': 'Dashboard', 
    'nav.stories': 'Stories',
    'nav.products': 'Products',
    'nav.book_test': 'Book Test',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.welcome': 'Welcome',

    // Health Summary Section
    'health_summary.title': 'Health Summary',
    'health_summary.subtitle': 'Your current health status at a glance',
    'health_summary.overall_health': 'Overall Health Status',
    'health_summary.based_on_labs': 'Based on your latest lab results',
    'health_summary.chat_ai': 'Chat with AI about your results',
    'health_summary.book_consultation': 'Book Consultation',
    'health_summary.view_blood_panel': 'View Recommended Blood Panel',
    'health_summary.hide_blood_panel': 'Hide',
    'health_summary.getting_recommendation': 'Getting recommendation...',
    'health_summary.key_tests': 'Key Tests Included:',
    'health_summary.benefits': 'Benefits:',
    'health_summary.recommended': 'Recommended:',
    'health_summary.book_panel': 'Book This Panel',

    // Health Metrics Overview
    'metrics.title': 'Health Metrics Overview',
    'metrics.subtitle': 'Detailed view of your health metrics and trends',
    'metrics.no_data': 'No lab results available',
    'metrics.upload_first': 'Upload your first lab results to see your health metrics and get personalized insights.',
    'metrics.upload_results': 'Upload Lab Results',
    'metrics.excellent_health': 'Excellent Health Status',
    'metrics.all_normal': 'All your lab results are within normal ranges. Keep up the great work!',
    'metrics.abnormal_results': 'Results Requiring Attention',
    'metrics.discuss_ai': 'Discuss with AI',

    // Product Recommendations
    'products.title': 'Recommended Products',
    'products.subtitle': 'Personalized product recommendations based on your health data',
    'products.ai_selected': 'AI-selected products based on your lab results',
    'products.general_recommendations': 'General health and wellness product recommendations',
    'products.loading': 'Getting personalized recommendations...',
    'products.show_more': 'Show More Recommendations',
    'products.show_less': 'Show Less',
    'products.purchase': 'Purchase',
    'products.learn_more': 'Learn More',

    // Action Plans
    'plans.title': 'Your Recommended Action Plan',
    'plans.ai_selected': 'AI-selected plans based on your lab results that need attention',
    'plans.personalized_plans': 'Personalized health improvement plans based on your lab results and metrics',
    'plans.getting_recommendations': 'Getting personalized plan recommendations...',
    'plans.purchase_plan': 'Purchase Plan',
    'plans.view_all': 'View All Plans',

    // Lab Results
    'labs.title': 'Lab Results',
    'labs.subtitle': 'Your complete lab results history and analysis',
    'labs.no_results': 'No lab results yet',
    'labs.upload_first_lab': 'Upload your first lab results to start tracking your health metrics.',
    'labs.test': 'Test',
    'labs.result': 'Result',
    'labs.reference': 'Reference Range',
    'labs.status': 'Status',
    'labs.date': 'Date',
    'labs.edit': 'Edit',
    'labs.delete': 'Delete',
    'labs.discuss': 'Discuss with AI',

    // Chat
    'chat.title': 'AI Health Assistant',
    'chat.placeholder': 'Ask me about your health results...',
    'chat.send': 'Send',
    'chat.thinking': 'AI is thinking...',

    // Stories
    'stories.title': 'Success Stories',
    'stories.subtitle': 'Real people, real transformations. Read how our community members have improved their health and transformed their lives through personalized health insights and guidance.',
    'stories.their_journey': 'Their Journey',
    'stories.their_message': 'Their Message',
    'stories.verified': 'Verified Success Story',
    'stories.ready_title': 'Ready to Write Your Own Success Story?',
    'stories.ready_subtitle': 'Join thousands of people who have transformed their health with personalized insights and expert guidance.',
    'stories.start_journey': 'Start Your Health Journey',
    'stories.learn_more': 'Learn More',

    // Recommendations
    'recommendations.personalized_title': 'Personalized Recommendations',
    'recommendations.general_title': 'Recommended for You',
    'recommendations.personalized_subtitle': 'AI-selected products based on your lab results that need attention',
    'recommendations.general_subtitle': 'Personalized product suggestions based on your health metrics',
    'recommendations.loading': 'Getting personalized recommendations...',
    'recommendations.blood_test_monitoring': 'Blood Test Monitoring',
    'recommendations.blood_test_price': 'From 49,90 €',
    'recommendations.blood_test_description': 'Regular blood work monitoring is essential for tracking your health progress and catching potential issues early. Schedule comprehensive testing every 6-12 months to maintain optimal health.',
    'recommendations.based_on_label': 'Recommendations based on',
    'recommendations.default_description': 'Quality health product to support your wellness journey',
    'recommendations.schedule_test': 'Schedule Test',
    'recommendations.view_product': 'View Product',
    'recommendations.more': 'More recommendations',
    'recommendations.show_less': 'Show less',
    'recommendations.browse_catalog': 'Browse catalog',

    // Action Plans
    'action_plans.title': 'Your Recommended Action Plan',
    'action_plans.personalized_subtitle': 'AI-selected plans based on your lab results that need attention',
    'action_plans.general_subtitle': 'Personalized health improvement plans based on your lab results and metrics',
    'action_plans.loading': 'Getting personalized plan recommendations...',
    'action_plans.purchase': 'Purchase Plan',
    'action_plans.view_all': 'View All Plans',

    // Health Status
    'status.normal': 'Normal',
    'status.low': 'Low',
    'status.high': 'High',
    'status.critical': 'Critical',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
  },
  fi: {
    // Navigation
    'nav.assessment': 'Arviointi',
    'nav.dashboard': 'Hallintapaneeli',
    'nav.stories': 'Tarinat',
    'nav.products': 'Tuotteet',
    'nav.book_test': 'Varaa Testi',
    'nav.login': 'Kirjaudu',
    'nav.logout': 'Kirjaudu Ulos',
    'nav.welcome': 'Tervetuloa',

    // Health Summary Section
    'health_summary.title': 'Terveysyhteenveto',
    'health_summary.subtitle': 'Terveydentilasi yhdellä silmäyksellä',
    'health_summary.overall_health': 'Yleinen Terveydentila',
    'health_summary.based_on_labs': 'Perustuu viimeisimpiin laboratoriotuloksiisi',
    'health_summary.chat_ai': 'Keskustele AI:n kanssa tuloksistasi',
    'health_summary.book_consultation': 'Varaa Konsultaatio',
    'health_summary.view_blood_panel': 'Katso Suositeltuja Verikokeet',
    'health_summary.hide_blood_panel': 'Piilota',
    'health_summary.getting_recommendation': 'Haetaan suositusta...',
    'health_summary.key_tests': 'Tärkeimmät Testit:',
    'health_summary.benefits': 'Hyödyt:',
    'health_summary.recommended': 'Suositus:',
    'health_summary.book_panel': 'Varaa Tämä Paneeli',

    // Health Metrics Overview
    'metrics.title': 'Terveysmittareiden Yleiskatsaus',
    'metrics.subtitle': 'Yksityiskohtainen näkymä terveysmittareistasi ja trendeistä',
    'metrics.no_data': 'Ei laboratoriotuloksia saatavilla',
    'metrics.upload_first': 'Lataa ensimmäiset laboratoriotuloksesi nähdäksesi terveysmittarisi ja saadaksesi henkilökohtaisia näkemyksiä.',
    'metrics.upload_results': 'Lataa Laboratoriotuloksia',
    'metrics.excellent_health': 'Erinomainen Terveydentila',
    'metrics.all_normal': 'Kaikki laboratoriotuloksesi ovat normaaleissa rajoissa. Jatka hyvää työtä!',
    'metrics.abnormal_results': 'Huomiota Vaativat Tulokset',
    'metrics.discuss_ai': 'Keskustele AI:n Kanssa',

    // Product Recommendations
    'products.title': 'Suositellut Tuotteet',
    'products.subtitle': 'Henkilökohtaiset tuotesuositukset terveystietojesi perusteella',
    'products.ai_selected': 'AI:n valitsemat tuotteet laboratoriotulostesi perusteella',
    'products.general_recommendations': 'Yleiset terveys- ja hyvinvointituotteiden suositukset',
    'products.loading': 'Haetaan henkilökohtaisia suosituksia...',
    'products.show_more': 'Näytä Lisää Suosituksia',
    'products.show_less': 'Näytä Vähemmän',
    'products.purchase': 'Osta',
    'products.learn_more': 'Lue Lisää',

    // Action Plans
    'plans.title': 'Suositeltu Toimintasuunnitelmasi',
    'plans.ai_selected': 'AI:n valitsemat suunnitelmat laboratoriotulostesi perusteella, jotka vaativat huomiota',
    'plans.personalized_plans': 'Henkilökohtaiset terveyden parantamissuunnitelmat laboratoriotulostesi ja mittareidesi perusteella',
    'plans.getting_recommendations': 'Haetaan henkilökohtaisia suosituksia...',
    'plans.purchase_plan': 'Osta Suunnitelma',
    'plans.view_all': 'Näytä Kaikki Suunnitelmat',

    // Lab Results
    'labs.title': 'Laboratoriotulokset',
    'labs.subtitle': 'Täydellinen laboratoriotulosten historia ja analyysi',
    'labs.no_results': 'Ei laboratoriotuloksia vielä',
    'labs.upload_first_lab': 'Lataa ensimmäiset laboratoriotuloksesi aloittaaksesi terveysmittareidesi seurannan.',
    'labs.test': 'Testi',
    'labs.result': 'Tulos',
    'labs.reference': 'Viitearvo',
    'labs.status': 'Tila',
    'labs.date': 'Päivämäärä',
    'labs.edit': 'Muokkaa',
    'labs.delete': 'Poista',
    'labs.discuss': 'Keskustele AI:n Kanssa',

    // Chat
    'chat.title': 'AI Terveysavustaja',
    'chat.placeholder': 'Kysy minulta terveystuloksistasi...',
    'chat.send': 'Lähetä',
    'chat.thinking': 'AI miettii...',

    // Stories
    'stories.title': 'Menestystarinat',
    'stories.subtitle': 'Oikeita ihmisiä, oikeita muutoksia. Lue kuinka yhteisömme jäsenet ovat parantaneet terveyttään ja muuttaneet elämäänsä henkilökohtaisten terveysnäkemysten ja ohjauksen avulla.',
    'stories.their_journey': 'Heidän Matkansa',
    'stories.their_message': 'Heidän Viestinsä',
    'stories.verified': 'Varmennettu Menestystarina',
    'stories.ready_title': 'Valmis Kirjoittamaan Oman Menestytarinasi?',
    'stories.ready_subtitle': 'Liity tuhansien ihmisten joukkoon, jotka ovat muuttaneet terveytensä henkilökohtaisten näkemysten ja asiantuntija-avun kautta.',
    'stories.start_journey': 'Aloita Terveysmatkasi',
    'stories.learn_more': 'Lue Lisää',

    // Recommendations
    'recommendations.personalized_title': 'Henkilökohtaiset Suositukset',
    'recommendations.general_title': 'Suositeltu Sinulle',
    'recommendations.personalized_subtitle': 'AI:n valitsemat tuotteet laboratoriotilosten perusteella, jotka kaipaavat huomiota',
    'recommendations.general_subtitle': 'Henkilökohtaiset tuotesuositukset terveysmittareidesi perusteella',
    'recommendations.loading': 'Haetaan henkilökohtaisia suosituksia...',
    'recommendations.blood_test_monitoring': 'Verikokeiden Seuranta',
    'recommendations.blood_test_price': 'Alkaen 49,90 €',
    'recommendations.blood_test_description': 'Säännöllinen verikokeiden seuranta on olennaista terveytesi edistymisen seuraamisessa ja mahdollisten ongelmien varhaisessa havaitsemisessa. Ajoita kattava testaus 6-12 kuukauden välein optimaalisen terveyden ylläpitämiseksi.',
    'recommendations.based_on_label': 'Suositukset perustuvat',
    'recommendations.default_description': 'Laadukas terveystuote tukemaan hyvinvointimatkasi',
    'recommendations.schedule_test': 'Varaa Testi',
    'recommendations.view_product': 'Näytä Tuote',
    'recommendations.more': 'Lisää suosituksia',
    'recommendations.show_less': 'Näytä vähemmän',
    'recommendations.browse_catalog': 'Selaa luetteloa',

    // Action Plans
    'action_plans.title': 'Suositeltu Toimintasuunnitelma',
    'action_plans.personalized_subtitle': 'AI:n valitsemat suunnitelmat laboratoriotulostesi perusteella, jotka kaipaavat huomiota',
    'action_plans.general_subtitle': 'Henkilökohtaiset terveysparannussuunnitelmat laboratoriotulostesi ja mittareidesi perusteella',
    'action_plans.loading': 'Haetaan henkilökohtaisia suunnitelmasuosituksia...',
    'action_plans.purchase': 'Osta Suunnitelma',
    'action_plans.view_all': 'Näytä Kaikki Suunnitelmat',

    // Health Status
    'status.normal': 'Normaali',
    'status.low': 'Matala',
    'status.high': 'Korkea',
    'status.critical': 'Kriittinen',

    // Common
    'common.loading': 'Ladataan...',
    'common.error': 'Virhe',
    'common.save': 'Tallenna',
    'common.cancel': 'Peruuta',
    'common.close': 'Sulje',
    'common.edit': 'Muokkaa',
    'common.delete': 'Poista',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
