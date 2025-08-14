import React, { useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '../../../components/ui';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatPanelProps {
  isChatMinimized: boolean;
  chatMessages: ChatMessage[];
  chatInput: string;
  isTyping: boolean;
  onToggleMinimized: () => void;
  onChatInputChange: (value: string) => void;
  onSendMessage: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  isChatMinimized,
  chatMessages,
  chatInput,
  isTyping,
  onToggleMinimized,
  onChatInputChange,
  onSendMessage
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="xl:col-span-1">
      <div className="fixed bottom-4 right-4 xl:fixed xl:bottom-4 xl:right-4 xl:w-80">
        <Card className={`w-80 xl:w-80 flex flex-col shadow-lg border-gray-200 transition-all duration-300 ${
          isChatMinimized ? 'h-14' : 'h-[700px]'
        }`}>
          <CardHeader className="flex-shrink-0 border-b border-gray-100 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  🤖 AI Health Assistant
                </CardTitle>
                {!isChatMinimized && (
                  <p className="text-sm text-gray-600 mt-1">Get instant insights about your health data</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimized}
                className="h-8 w-8 p-0 hover:bg-white/50"
              >
                {isChatMinimized ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Button>
            </div>
          </CardHeader>
        
          {!isChatMinimized && (
            <>
              {/* Chat Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 text-sm shadow-sm ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 rounded-lg px-4 py-2 text-sm border border-gray-200 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </CardContent>

              {/* Chat Input */}
              <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => onChatInputChange(e.target.value)}
                    placeholder="Ask about your health results..."
                    className="flex-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    onKeyPress={handleKeyPress}
                  />
                  <Button 
                    onClick={onSendMessage}
                    disabled={!chatInput.trim() || isTyping}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ChatPanel;
