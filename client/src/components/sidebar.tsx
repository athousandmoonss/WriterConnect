import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FolderOpen, 
  PenTool, 
  User, 
  TrendingUp 
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Feed", icon: Home },
    { path: "/portfolio", label: "Portfolio", icon: FolderOpen },
    { path: "/write", label: "Write", icon: PenTool },
    { path: "/profile", label: "Profile", icon: User },
  ];

  const trendingTopics = [
    "#CreativeWriting",
    "#Poetry",
    "#ShortStories",
    "#WritingTips",
    "#BookClub"
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <Card className="bg-white shadow-sm border border-ink-200">
        <CardContent className="p-6">
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive 
                        ? "bg-gold-500 text-white hover:bg-gold-600" 
                        : "text-ink-600 hover:text-gold-600 hover:bg-gold-50"
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="bg-white shadow-sm border border-ink-200">
        <CardContent className="p-6">
          <h3 className="font-playfair font-semibold text-ink-700 mb-4 flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending Topics
          </h3>
          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <Button
                key={topic}
                variant="ghost"
                className="w-full justify-start p-0 h-auto text-sm text-ink-600 hover:text-gold-600"
              >
                {topic}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Writer Stats */}
      <Card className="bg-white shadow-sm border border-ink-200">
        <CardContent className="p-6">
          <h3 className="font-playfair font-semibold text-ink-700 mb-4">Your Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-ink-600">Followers</span>
              <span className="font-semibold text-ink-700">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-ink-600">Posts</span>
              <span className="font-semibold text-ink-700">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-ink-600">Likes</span>
              <span className="font-semibold text-ink-700">3,456</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
