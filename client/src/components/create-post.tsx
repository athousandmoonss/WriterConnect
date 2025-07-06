import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Image, Tag, Quote } from "lucide-react";

interface CreatePostProps {
  onCreatePost?: (content: string, tags: string[]) => void;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = () => {
    if (content.trim()) {
      onCreatePost?.(content, tags);
      setContent("");
      setTags([]);
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-ink-200 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="Share your latest writing, thoughts, or inspiration..."
              className="w-full p-4 border border-ink-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-ink-600 hover:text-gold-600">
                  <Image className="mr-2 h-4 w-4" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-ink-600 hover:text-gold-600">
                  <Tag className="mr-2 h-4 w-4" />
                  Tags
                </Button>
                <Button variant="ghost" size="sm" className="text-ink-600 hover:text-gold-600">
                  <Quote className="mr-2 h-4 w-4" />
                  Quote
                </Button>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="bg-gold-500 text-white hover:bg-gold-600"
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
