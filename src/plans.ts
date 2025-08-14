export interface Plan {
  title: string;
  description: string;
  price: string;
}

export const plans: Plan[] = [
  {
    title: "Longevity & Healthspan Plan",
    description: "A detailed plan focusing on key biomarkers associated with a long and healthy life. This plan includes two blood tests (e.g., telomere length, inflammatory markers), and a consultation with a professional to interpret your results and create a personalized strategy for aging well.",
    price: "399 €"
  },
  {
    title: "Weight Loss Plan",
    description: "A scientifically-backed weight loss plan designed to help you reach your goals. It includes two blood tests to check metabolism-related markers (e.g., thyroid hormones, insulin sensitivity), and a professional consultation to develop a sustainable diet and exercise regimen.",
    price: "349 €"
  },
  {
    title: "Heart Health Plan",
    description: "A proactive plan to support and monitor your cardiovascular system. This includes two blood tests to assess key heart health indicators (e.g., cholesterol panel, hs-CRP), and a consultation with a professional to discuss lifestyle changes and preventative measures.",
    price: "379 €"
  },
  {
    title: "Energy Plan",
    description: "A plan to pinpoint and address the root causes of fatigue. It features two blood tests to check for common deficiencies (e.g., iron, Vitamin B12, Vitamin D), and a professional consultation to create a strategy for boosting your energy levels naturally.",
    price: "299 €"
  },
  {
    title: "Focus & Mood Plan",
    description: "A plan to support cognitive function and emotional balance. This includes two blood tests to analyze markers related to brain health (e.g., neurotransmitter precursors, thyroid function), and a consultation with a professional to develop a personalized approach to improve your focus and mood.",
    price: "319 €"
  },
  { 
    title: "Performance Plan",
    description: "An advanced plan for athletes and fitness enthusiasts looking to optimize their physical performance. It includes two blood tests to measure relevant markers (e.g., testosterone, cortisol, creatine kinase), and a professional consultation to fine-tune your training and recovery protocols.",
    price: "449 €"
  },
  {
    title: "Testosterone Plan",
    description: "A focused plan to help you understand and manage your hormone levels. This plan includes two blood tests to measure total and free testosterone, and a consultation with a professional to discuss your results and strategies to support healthy hormone production.",
    price: "359 €"
  },
  {
    title: "Sleep Plan",
    description: "A plan designed to help you improve sleep quality and quantity. It includes two blood tests to check for hormonal imbalances or deficiencies that can impact sleep (e.g., melatonin, cortisol), and a professional consultation to develop a personalized plan for better rest.",
    price: "299 €"
  },
  {
    title: "Hormone Health Plan",
    description: "A comprehensive plan for understanding and balancing key hormones in your body. This includes two blood tests for a broad hormone panel (e.g., thyroid, cortisol, sex hormones), and a professional consultation to interpret the results and create a tailored action plan.",
    price: "429 €"
  },
  {
    title: "Monitoring Health Issue(s) Plan",
    description: "A specialized plan for tracking and managing specific health conditions. The plan is customized and includes two targeted blood tests relevant to your condition and a professional consultation to monitor your progress and adjust the plan as needed.",
    price: "Custom price, based on the issue being monitored."
  }
];