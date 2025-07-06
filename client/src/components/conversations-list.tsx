import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ConversationWithParticipants } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';

interface ConversationsListProps {
  conversations: ConversationWithParticipants[];
  currentUserId: number;
  selectedConversationId?: number;
  onSelectConversation: (conversation: ConversationWithParticipants) => void;
}

export default function ConversationsList({ 
  conversations, 
  currentUserId, 
  selectedConversationId,
  onSelectConversation 
}: ConversationsListProps) {
  const getOtherParticipant = (conversation: ConversationWithParticipants) => {
    return conversation.participant1Id === currentUserId 
      ? conversation.participant2 
      : conversation.participant1;
  };

  const getTimeAgo = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <MessageCircle className="h-12 w-12 text-ink-400 mb-4" />
        <h3 className="text-lg font-medium text-ink-600 mb-2">No conversations yet</h3>
        <p className="text-ink-500 text-sm">Start a conversation with another writer to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const isSelected = selectedConversationId === conversation.id;
        
        return (
          <Card 
            key={conversation.id}
            className={`cursor-pointer transition-colors hover:bg-ink-50 ${
              isSelected ? 'border-gold-500 bg-gold-50' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={otherParticipant.avatar || undefined} />
                  <AvatarFallback>
                    {otherParticipant.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-ink-900 truncate">
                      {otherParticipant.fullName}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {conversation.unreadCount && conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      <span className="text-xs text-ink-500">
                        {conversation.lastMessageAt && getTimeAgo(conversation.lastMessageAt)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-ink-500 mt-1">@{otherParticipant.username}</p>
                  
                  {conversation.lastMessage && (
                    <p className="text-sm text-ink-600 mt-2 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}