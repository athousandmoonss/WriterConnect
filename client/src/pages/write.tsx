import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/sidebar";
import RichTextEditor from "@/components/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Write() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<string>("writing");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  // Portfolio-specific fields
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioDescription, setPortfolioDescription] = useState("");
  const [portfolioGenre, setPortfolioGenre] = useState("");
  const [portfolioLength, setPortfolioLength] = useState("");
  const [portfolioStatus, setPortfolioStatus] = useState<string>("draft");

  const createPostMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/posts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Success",
        description: "Post published successfully!",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/portfolio', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/user', 1] });
      toast({
        title: "Success",
        description: "Portfolio work added successfully!",
      });
      setLocation("/portfolio");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add portfolio work. Please try again.",
        variant: "destructive",
      });
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/posts', { ...data, type: 'draft' });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Draft saved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handlePublish = () => {
    if (type === 'portfolio') {
      if (!portfolioTitle.trim() || !portfolioGenre.trim()) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      createPortfolioMutation.mutate({
        userId: 1, // TODO: Get from auth context
        title: portfolioTitle,
        description: portfolioDescription,
        genre: portfolioGenre,
        length: portfolioLength,
        status: portfolioStatus,
      });
    } else {
      if (!content.trim()) {
        toast({
          title: "Error",
          description: "Please write some content before publishing.",
          variant: "destructive",
        });
        return;
      }
      
      createPostMutation.mutate({
        userId: 1, // TODO: Get from auth context
        title: title.trim() || null,
        content: content.trim(),
        type,
        tags: tags.length > 0 ? tags : null,
      });
    }
  };

  const handleSaveDraft = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write some content before saving.",
        variant: "destructive",
      });
      return;
    }
    
    saveDraftMutation.mutate({
      userId: 1, // TODO: Get from auth context
      title: title.trim() || null,
      content: content.trim(),
      type: 'draft',
      tags: tags.length > 0 ? tags : null,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-playfair text-2xl text-ink-700">
                Create New {type === 'portfolio' ? 'Portfolio Work' : 'Post'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Type Selection */}
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-ink-700">
                  Content Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="writing">Writing Sample</SelectItem>
                    <SelectItem value="text">Text Post</SelectItem>
                    <SelectItem value="portfolio">Portfolio Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {type === 'portfolio' ? (
                <>
                  {/* Portfolio Title */}
                  <div>
                    <Label htmlFor="portfolioTitle" className="text-sm font-medium text-ink-700">
                      Work Title *
                    </Label>
                    <Input
                      id="portfolioTitle"
                      value={portfolioTitle}
                      onChange={(e) => setPortfolioTitle(e.target.value)}
                      placeholder="Enter your work title..."
                      className="mt-2"
                    />
                  </div>

                  {/* Portfolio Description */}
                  <div>
                    <Label htmlFor="portfolioDescription" className="text-sm font-medium text-ink-700">
                      Description
                    </Label>
                    <Textarea
                      id="portfolioDescription"
                      value={portfolioDescription}
                      onChange={(e) => setPortfolioDescription(e.target.value)}
                      placeholder="Describe your work..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  {/* Portfolio Genre */}
                  <div>
                    <Label htmlFor="portfolioGenre" className="text-sm font-medium text-ink-700">
                      Genre *
                    </Label>
                    <Input
                      id="portfolioGenre"
                      value={portfolioGenre}
                      onChange={(e) => setPortfolioGenre(e.target.value)}
                      placeholder="e.g., Fiction, Poetry, Non-fiction..."
                      className="mt-2"
                    />
                  </div>

                  {/* Portfolio Length */}
                  <div>
                    <Label htmlFor="portfolioLength" className="text-sm font-medium text-ink-700">
                      Length
                    </Label>
                    <Input
                      id="portfolioLength"
                      value={portfolioLength}
                      onChange={(e) => setPortfolioLength(e.target.value)}
                      placeholder="e.g., 320 pages, 5000 words..."
                      className="mt-2"
                    />
                  </div>

                  {/* Portfolio Status */}
                  <div>
                    <Label htmlFor="portfolioStatus" className="text-sm font-medium text-ink-700">
                      Status
                    </Label>
                    <Select value={portfolioStatus} onValueChange={setPortfolioStatus}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  {/* Post Title */}
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-ink-700">
                      Title (Optional)
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your post title..."
                      className="mt-2"
                    />
                  </div>

                  {/* Content Editor */}
                  <div>
                    <Label htmlFor="content" className="text-sm font-medium text-ink-700 mb-2 block">
                      Content
                    </Label>
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Start writing your story..."
                      className="mt-2"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <Label htmlFor="tags" className="text-sm font-medium text-ink-700">
                      Tags
                    </Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add tags (press Enter to add)"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddTag}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-gold-100 text-gold-700 flex items-center gap-1"
                            >
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTag(tag)}
                                className="h-4 w-4 p-0 hover:bg-gold-200"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={saveDraftMutation.isPending || type === 'portfolio'}
                >
                  Save as Draft
                </Button>
                
                <div className="space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={createPostMutation.isPending || createPortfolioMutation.isPending}
                    className="bg-gold-500 text-white hover:bg-gold-600"
                  >
                    {type === 'portfolio' ? 'Add to Portfolio' : 'Publish'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
