import { useQuery } from "@tanstack/react-query";
import { User, Post } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Users, 
  BookOpen, 
  Heart,
  MessageCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "wouter";

export default function Profile() {
  const { id } = useParams<{ id?: string }>();
  const userId = id ? parseInt(id) : 1; // Default to current user

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
  });

  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts/user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/posts/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }
      return response.json();
    },
  });

  if (userLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="h-8 w-16 mx-auto mb-2" />
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="font-playfair text-xl font-semibold text-ink-700 mb-2">
                  User Not Found
                </h3>
                <p className="text-ink-500">
                  The user you're looking for doesn't exist or has been removed.
                </p>
              </CardContent>
            </Card>
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
          {/* Profile Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face`} />
                    <AvatarFallback className="text-xl">
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-2xl font-playfair font-bold text-ink-700">
                      {user.fullName}
                    </h1>
                    <p className="text-ink-500 text-lg">@{user.username}</p>
                    {user.credentials && (
                      <p className="text-ink-600 font-medium">{user.credentials}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline">Message</Button>
                  <Button className="bg-gold-500 text-white hover:bg-gold-600">
                    Follow
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {user.bio && (
                <p className="text-ink-600 mb-4 leading-relaxed">{user.bio}</p>
              )}
              
              {user.writingGenres && user.writingGenres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.writingGenres.map((genre, index) => (
                    <Badge key={index} variant="secondary" className="bg-gold-100 text-gold-700">
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ink-700">{user.followerCount}</div>
                  <div className="text-sm text-ink-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ink-700">{user.followingCount}</div>
                  <div className="text-sm text-ink-500">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ink-700">{user.postCount}</div>
                  <div className="text-sm text-ink-500">Posts</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Profile Content */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="space-y-6">
              {postsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="space-y-2 mb-4">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                        <div className="flex justify-between">
                          <div className="flex space-x-4">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-12" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-6">
                        {post.title && (
                          <h3 className="font-playfair font-semibold text-lg text-ink-700 mb-2">
                            {post.title}
                          </h3>
                        )}
                        
                        <p className="text-ink-600 mb-4 line-clamp-3">
                          {post.content}
                        </p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-gold-100 text-gold-700">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm text-ink-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Heart className="mr-1 h-4 w-4" />
                              {post.likeCount}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="mr-1 h-4 w-4" />
                              {post.commentCount}
                            </span>
                          </div>
                          <span>
                            {formatDistanceToNow(new Date(post.createdAt!), { addSuffix: true })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-ink-400 mx-auto mb-4" />
                    <h3 className="font-playfair text-lg font-semibold text-ink-700 mb-2">
                      No Posts Yet
                    </h3>
                    <p className="text-ink-500">
                      This user hasn't shared any posts yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="portfolio">
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-ink-400 mx-auto mb-4" />
                  <h3 className="font-playfair text-lg font-semibold text-ink-700 mb-2">
                    Portfolio Coming Soon
                  </h3>
                  <p className="text-ink-500">
                    Portfolio showcase will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="about">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-ink-700 mb-2">About</h3>
                      <p className="text-ink-600">
                        {user.bio || "This user hasn't added a bio yet."}
                      </p>
                    </div>
                    
                    {user.writingGenres && user.writingGenres.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-ink-700 mb-2">Writing Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {user.writingGenres.map((genre, index) => (
                            <Badge key={index} variant="secondary" className="bg-gold-100 text-gold-700">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-semibold text-ink-700 mb-2">Member Since</h3>
                      <p className="text-ink-600 flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Recently joined
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
