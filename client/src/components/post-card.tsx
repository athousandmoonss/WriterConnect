import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Volume2,
  VolumeX
} from "lucide-react";
import { PostWithUser } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface PostCardProps {
  post: PostWithUser;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onBookmark?: (postId: number) => void;
}

export default function PostCard({ post, onLike, onComment, onShare, onBookmark }: PostCardProps) {
  const { settings, speak, stopSpeaking, isSpeaking } = useAccessibility();
  
  const getTimeAgo = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleReadPost = () => {
    const postText = `${post.title ? post.title + '. ' : ''}${post.content}`;
    speak(postText);
  };

  const renderPortfolioContent = () => {
    if (post.type === 'portfolio') {
      return (
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div className="bg-gradient-to-b from-ink-900 to-ink-800 rounded-xl p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gold-400/20 to-transparent"></div>
            <div className="relative z-10">
              <h4 className="font-playfair text-2xl font-bold text-white mb-2">
                {post.title}
              </h4>
              <p className="text-ink-200 text-sm mb-4">A Portfolio Work</p>
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-ink-600 leading-relaxed text-sm">
              {post.content.substring(0, 200)}...
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Genre:</span>
                <span className="text-ink-700">Fiction</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-500">Status:</span>
                <span className="text-green-600 font-medium">Published</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="prose prose-ink max-w-none mb-4">
        <p className="text-ink-600 leading-relaxed">
          {post.content}
        </p>
      </div>
    );
  };

  return (
    <Card className="bg-white shadow-sm border border-ink-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`} />
              <AvatarFallback>
                {post.user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-ink-700">{post.user.fullName}</h4>
              <p className="text-sm text-ink-500">
                {post.user.credentials} • {getTimeAgo(post.createdAt!)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-ink-400 hover:text-ink-600">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          {post.title && (
            <h3 className="font-playfair font-semibold text-xl text-ink-700 mb-3">
              {post.title}
            </h3>
          )}
          
          {renderPortfolioContent()}
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-gold-100 text-gold-700">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-ink-200">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike?.(post.id)}
              className={`flex items-center space-x-2 ${
                post.isLiked ? 'text-red-500' : 'text-ink-600 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{post.likeCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="flex items-center space-x-2 text-ink-600 hover:text-gold-600"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{post.commentCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="flex items-center space-x-2 text-ink-600 hover:text-gold-600"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </Button>
            
            {settings.textToSpeech && (
              <Button
                variant="ghost"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : handleReadPost}
                className="flex items-center space-x-2 text-ink-600 hover:text-gold-600"
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
                <span className="text-sm">{isSpeaking ? 'Stop' : 'Read'}</span>
              </Button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark?.(post.id)}
            className="text-ink-600 hover:text-gold-600"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
