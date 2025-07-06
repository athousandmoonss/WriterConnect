import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostWithUser } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import CreatePost from "@/components/create-post";
import PostCard from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery<PostWithUser[]>({
    queryKey: ['/api/posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { content: string; tags: string[] }) => {
      return apiRequest('POST', '/api/posts', {
        userId: 1, // TODO: Get from auth context
        content: data.content,
        type: 'text',
        tags: data.tags,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      return apiRequest('POST', '/api/likes', {
        userId: 1, // TODO: Get from auth context
        postId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
    },
  });

  const handleCreatePost = (content: string, tags: string[]) => {
    createPostMutation.mutate({ content, tags });
  };

  const handleLike = (postId: number) => {
    likeMutation.mutate(postId);
  };

  const handleComment = (postId: number) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: number) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handleBookmark = (postId: number) => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark post:', postId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <div className="flex justify-between">
                      <div className="flex space-x-4">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex space-x-6">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
        
        <div className="lg:col-span-3">
          <CreatePost onCreatePost={handleCreatePost} />
          
          <div className="space-y-6">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-ink-500 mb-4">No posts yet. Be the first to share your writing!</p>
                  <p className="text-sm text-ink-400">
                    Follow other writers to see their posts in your feed.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
