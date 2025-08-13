import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { Button, Input } from '../../components/ui';
import { cn } from '../../lib/utils';
import { generateAIHealthResponse } from '../../services/openai';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface HealthProfile {
  primaryConcern: string;
  age: number | null;
  sleepQuality: string;
  energyLevel: string;
  stressLevel: string;
  exerciseFrequency: string;
  symptoms: string[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    primaryConcern: '',
    age: null,
    sleepQuality: '',
    energyLevel: '',
    stressLevel: '',
    exerciseFrequency: '',
    symptoms: []
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  const chatScript = [
    {
      id: 1,
      question: "Hello! I'm your AI health assistant. I'm here to help you understand your health concerns and provide personalized recommendations. What brings you here today? Are you experiencing fatigue, low energy, concerns about testosterone, sleep issues, or something else?",
      field: 'primaryConcern',
      systemPrompt: "You are a health assessment AI. Ask about the user's primary health concern. Keep responses concise and empathetic. Guide them to be specific about their main health issue."
    },
    {
      id: 2,
      question: "Thank you for sharing that. To provide more accurate recommendations, could you tell me your age? This helps me understand your health context better.",
      field: 'age',
      systemPrompt: "Ask for the user's age for health context. Be respectful and explain why age is important for health recommendations."
    },
    {
      id: 3,
      question: "How would you describe your sleep quality lately? Are you getting restful sleep, having trouble falling asleep, waking up frequently, or feeling tired despite sleeping?",
      field: 'sleepQuality',
      systemPrompt: "Assess sleep quality in detail. Ask about sleep duration, quality, and any sleep disturbances. Sleep is crucial for health analysis."
    },
    {
      id: 4,
      question: "On a scale from very low to very high, how would you rate your current energy levels throughout the day? Do you feel energetic, moderately tired, or completely drained?",
      field: 'energyLevel',
      systemPrompt: "Evaluate energy levels throughout the day. Ask about patterns, when they feel most/least energetic, and how this affects daily activities."
    },
    {
      id: 5,
      question: "How would you describe your current stress levels? Are you feeling overwhelmed, managing well, or somewhere in between? Stress can significantly impact your overall health.",
      field: 'stressLevel',
      systemPrompt: "Assess stress levels and sources. Ask about work-life balance, stress management techniques, and how stress affects their health symptoms."
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only add initial message once, even if useEffect runs multiple times (React Strict Mode)
    if (!initializedRef.current) {
      initializedRef.current = true;
      addMessage(chatScript[0].question, false);
    }
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const analyzeResponse = async (response: string, step: number) => {
    const currentQuestion = chatScript[step];
    let analyzedValue = response;

    // Special handling for age
    if (currentQuestion.field === 'age') {
      const ageMatch = response.match(/\d+/);
      if (ageMatch) {
        const age = parseInt(ageMatch[0]);
        setHealthProfile(prev => ({ ...prev, age }));
        return age.toString();
      }
    }

    // For other fields, store the raw response - OpenAI will handle the analysis
    setHealthProfile(prev => ({
      ...prev,
      [currentQuestion.field]: analyzedValue
    }));

    return analyzedValue;
  };

  const generateSummary = async () => {
    // Create a comprehensive prompt for OpenAI analysis
    const analysisPrompt = `
You must always make the analysis to be either low testosterone or general health and wellness. Refer to the previous answers to justify your decision and give a one sentence result.
`;

    try {
      // Use OpenAI to generate the health analysis
      const aiAnalysis = await generateAIHealthResponse(
        analysisPrompt,
        [], // No lab results for this assessment
        messages
      );

      // Parse the AI response for structured data
      const riskLevel = aiAnalysis.includes('High risk') ? 'High' : 
                       aiAnalysis.includes('Moderate') ? 'Moderate' : 'Low';

      return {
        riskLevel,
        aiAnalysis
      };
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      
      // Fallback to basic analysis
      const { energyLevel, sleepQuality, stressLevel } = healthProfile;
      let riskLevel = 'Low';
      let recommendations = [];
      
      if (energyLevel.toLowerCase().includes('low') || 
          sleepQuality.toLowerCase().includes('poor') || 
          stressLevel.toLowerCase().includes('high')) {
        riskLevel = 'Moderate to High';
        recommendations = [
          'Comprehensive health panel testing',
          'Sleep quality assessment',
          'Stress management consultation',
          'Targeted supplement recommendations'
        ];
      } else {
        recommendations = [
          'Basic health monitoring',
          'Preventive supplement support',
          'Lifestyle optimization guidance'
        ];
      }

      return {
        riskLevel,
        aiAnalysis: `Based on your assessment, your risk level is ${riskLevel}. Recommended next steps: ${recommendations.join(', ')}`
      };
    }
  };

  const generateNextQuestion = async (userResponse: string, step: number) => {
    const currentQuestion = chatScript[step];
    const nextStep = step + 1;
    
    if (nextStep < chatScript.length) {
      // Use OpenAI to generate a contextual follow-up question
      const contextPrompt = `
${currentQuestion.systemPrompt}

User's previous response: "${userResponse}"
Next topic: ${chatScript[nextStep].field}
Base question: "${chatScript[nextStep].question}"

Generate a natural follow-up question that acknowledges their previous response and smoothly transitions to asking about ${chatScript[nextStep].field}. Keep it conversational and empathetic.
`;

      try {
        const aiQuestion = await generateAIHealthResponse(
          contextPrompt,
          [],
          messages
        );
        return aiQuestion;
      } catch (error) {
        console.error('Error generating AI question:', error);
        return chatScript[nextStep].question; // Fallback to default question
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage(input, true);
    
    // Analyze the response
    await analyzeResponse(input, currentStep);
    
    const userResponse = input;
    setInput('');

    // Focus the input field after sending message
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Simulate AI typing and response
    setIsTyping(true);
    
    try {
      if (currentStep < chatScript.length - 1) {
        // Generate next question using AI
        const nextQuestion = await generateNextQuestion(userResponse, currentStep);
        
        setIsTyping(false);
        
        if (nextQuestion) {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          addMessage(nextQuestion, false);
          
          // Focus input after AI response
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }
      } else {
        // Assessment complete - generate AI summary
        const summary = await generateSummary();
        setIsComplete(true);
        setIsTyping(false);
        
        const summaryMessage = `
Thank you for completing the assessment! Here's your AI-generated health analysis:

${summary.aiAnalysis}

To get your detailed results and personalized product recommendations, you can view them as a guest or create a free account to save your progress and track improvements over time.
        `;
        
        addMessage(summaryMessage, false);
      }
    } catch (error) {
      setIsTyping(false);
      console.error('Error in chat flow:', error);
      addMessage("I apologize, but I'm having trouble processing your response. Please try again.", false);
    }
  };

  const suggestedResponses = () => {
    if (currentStep === 0) {
      return ['I feel tired all the time', 'Low energy and motivation', 'Sleep problems', 'Stress and anxiety'];
    }
    if (currentStep === 1) {
      return ['25 years old', '35 years old', '45 years old', 'Over 50'];
    }
    if (currentStep === 2) {
      return ['Poor sleep quality', 'Wake up tired', 'Sleep well', 'Trouble falling asleep'];
    }
    if (currentStep === 3) {
      return ['Very low energy', 'Moderate energy', 'Good energy levels'];
    }
    if (currentStep === 4) {
      return ['High stress', 'Manageable stress', 'Low stress levels'];
    }
    return [];
  };

  return (
    <Page title="AI Health Assessment" subtitle="Get personalized health insights through our intelligent chat system" showGradientHeader={false}>
      <div className="h-screen flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Health Assessment</h2>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentStep + 1) / chatScript.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            {isComplete ? 'Complete' : `Question ${currentStep + 1} of ${chatScript.length}`}
          </span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 mt-18">
          <div className="max-w-[720px] mx-auto px-6 py-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={cn(
                "flex",
                message.isUser ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                  message.isUser 
                    ? "bg-purple-600 text-white" 
                    : "bg-white text-gray-900 border border-gray-200"
                )}>
                  <pre className="whitespace-pre-wrap text-sm font-sans">{message.text}</pre>
                  <span className={cn(
                    "text-xs mt-1 block",
                    message.isUser ? "text-purple-100" : "text-gray-500"
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Section */}
        {!isComplete && (
          <div className="bg-white border-t border-gray-200 sticky bottom-0">
            <div className="max-w-[720px] mx-auto px-6 py-4">
              {suggestedResponses().length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {suggestedResponses().map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInput(suggestion);
                        setTimeout(() => {
                          inputRef.current?.focus();
                        }, 100);
                      }}
                      className="text-left"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your response here..."
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isTyping}>
                  Send
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Completion Actions */}
        {isComplete && (
          <div className="bg-white border-t border-gray-200 sticky bottom-0">
            <div className="max-w-[720px] mx-auto px-6 py-4 space-y-3">
              <Button asChild className="w-full">
                <Link to="/recommendations">
                  View Detailed Results
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/auth">
                  Create Account to Save Results
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default Chat;
