import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, you'd want to call this from your backend
});

export interface LabEntry {
    date: string;
    test: string;
    result: string;
    referenceRange: string;
    status: 'Normal' | 'Low' | 'High' | 'Critical';
}

export interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

/**
 * Generate AI response for health-related chat
 * @param userMessage - The user's input message
 * @param labResults - User's lab results for context
 * @param chatHistory - Previous messages for context
 * @returns Promise<string> - AI response
 */
export async function generateAIHealthResponse(
    userMessage: string,
    labResults: LabEntry[],
    chatHistory: ChatMessage[] = []
): Promise<string> {
    try {
        // Build context from lab results
        const labSummary = buildLabSummary(labResults);
        
        // Build conversation history
        const conversationHistory = chatHistory
            .slice(-6) // Keep last 6 messages for context
            .map(msg => ({
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.text
            }));

        const systemPrompt = `You are a knowledgeable health AI assistant for Health360, a men's health platform. Your role is to:

1. Analyze and explain lab results in simple, understandable terms
2. Provide actionable health advice based on the data
3. Recommend lifestyle changes, supplements, or when to consult healthcare providers
4. Be encouraging and supportive while being medically accurate
5. Always emphasize that you're providing educational information, not medical diagnosis

Current Lab Results Summary:
${labSummary}

Guidelines:
- Be conversational and empathetic
- Explain medical terms in simple language
- Focus on actionable advice
- Reference specific lab values when relevant
- Suggest consulting healthcare providers for concerning results
- Keep responses concise but informative (2-3 paragraphs max)
- Don't provide specific medical diagnoses or prescribe treatments
- Don't try to do any styling with Markdown or similar, just use new lines

User's health data context: This user has ${labResults.length} recent lab results. Focus on their specific values and trends when providing advice.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory,
            { role: 'user', content: userMessage }
        ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 500,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        });

        const aiResponse = response.choices[0]?.message?.content;
        
        if (!aiResponse) {
            throw new Error('No response from OpenAI API');
        }

        return aiResponse;

    } catch (error) {
        console.error('Error generating AI response:', error);
        
        // Fallback response based on lab results
        return generateFallbackResponse(userMessage, labResults);
    }
}

/**
 * Build a summary of lab results for AI context
 */
function buildLabSummary(labResults: LabEntry[]): string {
    if (labResults.length === 0) {
        return 'No lab results available.';
    }

    const groupedByDate = labResults.reduce((acc, result) => {
        if (!acc[result.date]) {
            acc[result.date] = [];
        }
        acc[result.date].push(result);
        return acc;
    }, {} as { [date: string]: LabEntry[] });

    const summaryParts = Object.entries(groupedByDate).map(([date, results]) => {
        const resultDetails = results.map(r => 
            `${r.test}: ${r.result} (${r.status}, ref: ${r.referenceRange})`
        ).join(', ');

        return `${date}: ${resultDetails}`;
    });

    return summaryParts.join('\n');
}

/**
 * Generate fallback response when OpenAI is unavailable
 */
function generateFallbackResponse(userMessage: string, labResults: LabEntry[]): string {
    const lowerInput = userMessage.toLowerCase();
    
    // Analyze lab results for context
    const highResults = labResults.filter(r => r.status === 'High');
    const lowResults = labResults.filter(r => r.status === 'Low');
    const normalResults = labResults.filter(r => r.status === 'Normal');

    if (lowerInput.includes('cholesterol')) {
        const cholesterolResults = labResults.filter(r => r.test.toLowerCase().includes('cholesterol'));
        if (cholesterolResults.length > 0) {
            const ldl = cholesterolResults.find(r => r.test.includes('LDL'));
            if (ldl && ldl.status === 'High') {
                return `I see your LDL cholesterol is ${ldl.result}, which is ${ldl.status.toLowerCase()}. This is above the reference range of ${ldl.referenceRange}. I recommend focusing on heart-healthy foods like oats, nuts, and fish, while reducing saturated fats. Regular exercise can also help improve these levels. Consider discussing this with your healthcare provider for a comprehensive plan.`;
            }
            return `Your cholesterol levels show: ${cholesterolResults.map(r => `${r.test}: ${r.result} (${r.status})`).join(', ')}. Overall, this is manageable with lifestyle adjustments.`;
        }
    }

    if (lowerInput.includes('vitamin d')) {
        const vitaminD = labResults.find(r => r.test.toLowerCase().includes('vitamin d'));
        if (vitaminD) {
            return `Your Vitamin D level is ${vitaminD.result}, which is ${vitaminD.status.toLowerCase()}. ${vitaminD.status === 'Low' ? 'Consider increasing sun exposure, vitamin D3 supplementation (2000-4000 IU daily), and foods rich in vitamin D like fatty fish.' : 'Your levels are good - keep maintaining your current habits with adequate sun exposure and nutrition.'}`;
        }
    }

    if (lowerInput.includes('results') || lowerInput.includes('summary')) {
        return `Based on your latest labs from ${labResults[0]?.date}, you have ${normalResults.length} normal results${highResults.length > 0 ? `, ${highResults.length} elevated marker${highResults.length > 1 ? 's' : ''}` : ''}${lowResults.length > 0 ? `, and ${lowResults.length} low marker${lowResults.length > 1 ? 's' : ''}` : ''}. ${highResults.length > 0 ? 'Focus on addressing the elevated markers through lifestyle changes and consider consulting your healthcare provider.' : 'Great job maintaining healthy levels!'}`;
    }

    if (lowerInput.includes('recommend') || lowerInput.includes('advice')) {
        if (highResults.length > 0) {
            return `Given your elevated ${highResults.map(r => r.test).join(' and ')}, I recommend: 1) Dietary modifications focusing on heart-healthy foods, 2) Regular physical activity (aim for 150 minutes moderate exercise weekly), 3) Stress management techniques, and 4) Regular monitoring. Please consult with your healthcare provider for a personalized treatment plan.`;
        }
        return `Your lab results look good overall! Continue your current healthy habits. Key recommendations: maintain regular monitoring, focus on balanced nutrition with plenty of vegetables and lean proteins, get adequate sleep (7-9 hours), stay physically active, and manage stress effectively.`;
    }

    // Default responses
    const responses = [
        `I can help you understand your lab results better. You currently have ${normalResults.length} normal results and ${highResults.length + lowResults.length} that need attention. What specific aspect would you like to discuss?`,
        `Based on your health data, I can provide insights about your cholesterol, vitamin levels, and overall health trends. What questions do you have?`,
        `I'm here to help you make sense of your lab results and provide actionable health advice. Feel free to ask about any specific test or health concern.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

export default { generateAIHealthResponse };
