import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConversationsList from '@/components/conversations-list';
import ChatInterface from '@/components/chat-interface';
import { ConversationWithParticipants, MessageWithSender, User } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { MessageCircle, Search, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithParticipants | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock current user ID - in a real app, this would come from auth context
  const currentUserId = 1;

  // Fetch conversations
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['/api/conversations', currentUserId],
    queryFn: ({ queryKey }) => {
      const [, userId] = queryKey;
      return fetch(`/api/conversations?userId=${userId}`).then(res => res.json());
    },
  });

  // Fetch messages for selected conversation
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/conversations', selectedConversation?.id, 'messages'],
    queryFn: ({ queryKey }) => {
      const [, conversationId] = queryKey;
      return fetch(`/api/conversations/${conversationId}/messages`).then(res => res.json());
    },
    enabled: !!selectedConversation,
  });

  // Search users for new conversations
  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ['/api/users/search', searchQuery],
    queryFn: ({ queryKey }) => {
      const [, query] = queryKey;
      return fetch(`/api/users/search?q=${encodeURIComponent(query)}`).then(res => res.json());
    },
    enabled: searchQuery.length > 2,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (data: { participant1Id: number; participant2Id: number }) => {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (newConversation) => {
      setSelectedConversation(newConversation);
      setShowUserSearch(false);
      setSearchQuery('');
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { conversationId: number; senderId: number; content: string }) => {
      const response = await fetch(`/api/conversations/${data.conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: data.senderId, content: data.content }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/conversations', selectedConversation?.id, 'messages'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/conversations'] 
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  // Mark messages as read when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetch(`/api/conversations/${selectedConversation.id}/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      });
    }
  }, [selectedConversation, currentUserId, queryClient]);

  const handleSelectConversation = (conversation: ConversationWithParticipants) => {
    setSelectedConversation(conversation);
  };

  const handleStartConversation = (user: User) => {
    createConversationMutation.mutate({
      participant1Id: currentUserId,
      participant2Id: user.id,
    });
  };

  const handleSendMessage = (content: string) => {
    if (selectedConversation) {
      sendMessageMutation.mutate({
        conversationId: selectedConversation.id,
        senderId: currentUserId,
        content,
      });
    }
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Conversations List */}
          <div className={`lg:col-span-1 ${selectedConversation ? 'hidden lg:block' : ''}`}>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Messages
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUserSearch(!showUserSearch)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {showUserSearch && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search writers to message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
                    </div>
                    
                    {searchQuery.length > 2 && (
                      <div className="max-h-40 overflow-y-auto border rounded-md">
                        {searchLoading ? (
                          <div className="p-3 text-center text-ink-500">Searching...</div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((user: User) => (
                            <button
                              key={user.id}
                              onClick={() => handleStartConversation(user)}
                              className="w-full p-3 text-left hover:bg-ink-50 border-b last:border-b-0 flex items-center space-x-2"
                              disabled={createConversationMutation.isPending}
                            >
                              <span className="font-medium">{user.fullName}</span>
                              <span className="text-ink-500 text-sm">@{user.username}</span>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-ink-500">No writers found</div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden">
                {conversationsLoading ? (
                  <div className="text-center py-8">Loading conversations...</div>
                ) : (
                  <ConversationsList
                    conversations={conversations}
                    currentUserId={currentUserId}
                    selectedConversationId={selectedConversation?.id}
                    onSelectConversation={handleSelectConversation}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className={`lg:col-span-2 ${!selectedConversation ? 'hidden lg:block' : ''}`}>
            <Card className="h-full">
              {selectedConversation ? (
                <ChatInterface
                  conversation={selectedConversation}
                  messages={messages}
                  currentUserId={currentUserId}
                  onSendMessage={handleSendMessage}
                  onBack={handleBack}
                  isLoading={sendMessageMutation.isPending}
                />
              ) : (
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-ink-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-ink-600 mb-2">Welcome to Messages</h3>
                    <p className="text-ink-500">
                      Select a conversation to start chatting with fellow writers
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}