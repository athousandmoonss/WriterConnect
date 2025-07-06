import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PortfolioWork } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, BookOpen, Calendar, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Portfolio() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: portfolioWorks, isLoading } = useQuery<PortfolioWork[]>({
    queryKey: ['/api/portfolio/user', 1], // TODO: Get user ID from auth context
    queryFn: async () => {
      const response = await fetch('/api/portfolio/user/1');
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio works');
      }
      return response.json();
    },
  });

  const createWorkMutation = useMutation({
    mutationFn: async (data: Partial<PortfolioWork>) => {
      return apiRequest('POST', '/api/portfolio', {
        userId: 1, // TODO: Get from auth context
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/user', 1] });
      toast({
        title: "Success",
        description: "Portfolio work added successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add portfolio work. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateWork = () => {
    // TODO: Open create work modal
    console.log('Create new portfolio work');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-ink-700">Portfolio</h1>
              <p className="text-ink-500 mt-1">Showcase your writing works</p>
            </div>
            <Button
              onClick={handleCreateWork}
              className="bg-gold-500 text-white hover:bg-gold-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Work
            </Button>
          </div>
          
          {portfolioWorks && portfolioWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {portfolioWorks.map((work) => (
                <Card key={work.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="font-playfair text-ink-700">
                        {work.title}
                      </CardTitle>
                      <Badge className={getStatusColor(work.status)}>
                        {work.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-ink-500 capitalize">{work.genre}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {work.coverImage ? (
                        <div className="bg-gradient-to-br from-ink-800 to-ink-900 rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <BookOpen className="h-6 w-6 text-gold-400" />
                          </div>
                          <h3 className="text-white font-playfair font-semibold">
                            {work.title}
                          </h3>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-ink-800 to-ink-900 rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <BookOpen className="h-6 w-6 text-gold-400" />
                          </div>
                          <h3 className="text-white font-playfair font-semibold">
                            {work.title}
                          </h3>
                        </div>
                      )}
                      
                      {work.description && (
                        <p className="text-sm text-ink-600 line-clamp-3">
                          {work.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        {work.length && (
                          <div className="flex justify-between">
                            <span className="text-ink-500">Length:</span>
                            <span className="text-ink-700">{work.length}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-ink-500">Genre:</span>
                          <span className="text-ink-700 capitalize">{work.genre}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-ink-500">Created:</span>
                          <span className="text-ink-700">
                            {formatDistanceToNow(new Date(work.createdAt!), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-ink-200">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-ink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-ink-400" />
                </div>
                <h3 className="font-playfair text-xl font-semibold text-ink-700 mb-2">
                  No Portfolio Works Yet
                </h3>
                <p className="text-ink-500 mb-6">
                  Start building your portfolio by adding your writing works, published pieces, or works in progress.
                </p>
                <Button
                  onClick={handleCreateWork}
                  className="bg-gold-500 text-white hover:bg-gold-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Work
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
