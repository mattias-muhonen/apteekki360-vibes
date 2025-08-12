import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Chat.css';

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

  const chatScript = [
    {
      question: "Hello! I'm your AI health assistant. I'm here to help you understand your health concerns and provide personalized recommendations. What brings you here today? Are you experiencing fatigue, low energy, concerns about testosterone, sleep issues, or something else?",
      field: 'primaryConcern',
      keywords: {
        fatigue: ['tired', 'fatigue', 'exhausted', 'energy', 'sleepy'],
        testosterone: ['testosterone', 'low t', 'libido', 'sex drive', 'muscle'],
        sleep: ['sleep', 'insomnia', 'rest', 'sleeping'],
        stress: ['stress', 'anxiety', 'overwhelmed', 'pressure']
      }
    },
    {
      question: "Thank you for sharing that. To provide more accurate recommendations, could you tell me your age? This helps me understand your health context better.",
      field: 'age',
      keywords: {}
    },
    {
      question: "How would you describe your sleep quality lately? Are you getting restful sleep, having trouble falling asleep, waking up frequently, or feeling tired despite sleeping?",
      field: 'sleepQuality',
      keywords: {
        poor: ['bad', 'poor', 'terrible', 'awful', 'trouble'],
        fair: ['okay', 'fair', 'average', 'sometimes'],
        good: ['good', 'well', 'fine', 'restful']
      }
    },
    {
      question: "On a scale from very low to very high, how would you rate your current energy levels throughout the day? Do you feel energetic, moderately tired, or completely drained?",
      field: 'energyLevel',
      keywords: {
        low: ['low', 'tired', 'drained', 'exhausted', 'weak'],
        moderate: ['okay', 'moderate', 'fair', 'average'],
        high: ['high', 'good', 'energetic', 'strong']
      }
    },
    {
      question: "How would you describe your current stress levels? Are you feeling overwhelmed, managing well, or somewhere in between? Stress can significantly impact your overall health.",
      field: 'stressLevel',
      keywords: {
        high: ['high', 'overwhelmed', 'stressed', 'anxious', 'pressure'],
        moderate: ['moderate', 'manageable', 'some', 'occasional'],
        low: ['low', 'calm', 'relaxed', 'minimal']
      }
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start with the first question
    addMessage(chatScript[0].question, false);
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

  const analyzeResponse = (response: string, step: number) => {
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

    // Keyword analysis for other fields
    for (const [category, keywords] of Object.entries(currentQuestion.keywords)) {
      for (const keyword of keywords) {
        if (response.toLowerCase().includes(keyword)) {
          analyzedValue = category;
          break;
        }
      }
      if (analyzedValue !== response) break;
    }

    // Update health profile
    setHealthProfile(prev => ({
      ...prev,
      [currentQuestion.field]: analyzedValue
    }));

    return analyzedValue;
  };

  const generateSummary = () => {
    const { primaryConcern, age, sleepQuality, energyLevel, stressLevel } = healthProfile;
    
    let riskLevel = 'Low';
    let recommendations = [];
    
    // Determine risk level based on responses
    if (energyLevel.includes('low') || sleepQuality.includes('poor') || stressLevel.includes('high')) {
      riskLevel = 'Moderate to High';
      recommendations = [
        'Comprehensive testosterone panel testing',
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
      recommendations,
      summary: `Based on your responses, you're a ${age}-year-old dealing with ${primaryConcern}. Your current energy levels are ${energyLevel}, sleep quality is ${sleepQuality}, and stress levels are ${stressLevel}.`
    };
  };

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    addMessage(input, true);
    
    // Analyze the response
    analyzeResponse(input, currentStep);
    
    setInput('');

    // Simulate AI typing and response
    simulateTyping(() => {
      if (currentStep < chatScript.length - 1) {
        // Move to next question
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        addMessage(chatScript[nextStep].question, false);
      } else {
        // Assessment complete
        setIsComplete(true);
        const summary = generateSummary();
        
        const summaryMessage = `
Thank you for completing the assessment! Here's your health analysis:

${summary.summary}

**Risk Assessment**: ${summary.riskLevel} risk for hormonal imbalances and energy issues.

**Recommended Next Steps**:
${summary.recommendations.map(rec => `• ${rec}`).join('\n')}

To get your detailed results and personalized product recommendations, you can view them as a guest or create a free account to save your progress and track improvements over time.
        `;
        
        addMessage(summaryMessage, false);
      }
    });
  };

  const suggestedResponses = () => {
    if (currentStep === 0) {
      return ['I feel tired all the time', 'Low energy and motivation', 'Sleep problems', 'Stress and anxiety'];
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
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Health Assessment</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / chatScript.length) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {isComplete ? 'Complete' : `Question ${currentStep + 1} of ${chatScript.length}`}
        </span>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.isUser ? 'user' : 'ai'}`}>
            <div className="message-content">
              <pre className="message-text">{message.text}</pre>
              <span className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {!isComplete && (
        <div className="chat-input-section">
          {suggestedResponses().length > 0 && (
            <div className="suggested-responses">
              {suggestedResponses().map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => setInput(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="chat-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response here..."
              className="chat-input"
              disabled={isTyping}
            />
            <button type="submit" className="send-button" disabled={!input.trim() || isTyping}>
              Send
            </button>
          </form>
        </div>
      )}

      {isComplete && (
        <div className="chat-actions">
          <Link to="/recommendations" className="action-button primary">
            View Detailed Results
          </Link>
          <Link to="/auth" className="action-button secondary">
            Create Account to Save Results
          </Link>
        </div>
      )}
    </div>
  );
};

export default Chat;
