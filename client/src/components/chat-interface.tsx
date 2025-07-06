import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConversationWithParticipants, MessageWithSender } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { Send, ArrowLeft } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface ChatInterfaceProps {
  conversation: ConversationWithParticipants;
  messages: MessageWithSender[];
  currentUserId: number;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function ChatInterface({ 
  conversation, 
  messages, 
  currentUserId, 
  onSendMessage, 
  onBack,
  isLoading = false
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { settings, speak } = useAccessibility();

  const otherParticipant = conversation.participant1Id === currentUserId 
    ? conversation.participant2 
    : conversation.participant1;

  const getTimeAgo = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && !isLoading) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReadMessage = (message: MessageWithSender) => {
    const messageText = `${message.sender.fullName} says: ${message.content}`;
    speak(messageText);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="border-b border-ink-200 p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Avatar className="w-10 h-10">
            <AvatarImage src={otherParticipant.avatar || undefined} />
            <AvatarFallback>
              {otherParticipant.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <CardTitle className="text-lg">{otherParticipant.fullName}</CardTitle>
            <p className="text-sm text-ink-500">@{otherParticipant.username}</p>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-ink-500 py-8">
              <p>Start a conversation with {otherParticipant.fullName}!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-gold-500 text-white'
                          : 'bg-ink-100 text-ink-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs ${
                          isOwnMessage ? 'text-gold-100' : 'text-ink-500'
                        }`}>
                          {getTimeAgo(message.createdAt!)}
                        </span>
                        
                        {settings.textToSpeech && !isOwnMessage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReadMessage(message)}
                            className={`h-6 w-6 p-0 ml-2 ${
                              isOwnMessage 
                                ? 'text-gold-100 hover:text-white' 
                                : 'text-ink-500 hover:text-ink-700'
                            }`}
                          >
                            <span className="text-xs">🔊</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {!isOwnMessage && (
                      <div className="flex items-center space-x-2 mt-1 order-1">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={message.sender.avatar || undefined} />
                          <AvatarFallback className="text-xs">
                            {message.sender.fullName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-ink-500">{message.sender.fullName}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Message Input */}
      <div className="border-t border-ink-200 p-4">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${otherParticipant.fullName}...`}
            className="flex-1 resize-none"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}