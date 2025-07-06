import { Search, Home, Users, Bookmark, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search query:", searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b border-ink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-playfair font-bold text-ink-700">
              <span className="text-gold-500 mr-2">✒️</span>
              Inkwell
            </h1>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search writers, stories, or topics..."
                className="w-full pl-10 pr-4 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-ink-400" />
            </div>
          </form>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm"
                className={`text-ink-600 hover:text-gold-600 ${location === '/' ? 'text-gold-600' : ''}`}
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm" className="text-ink-600 hover:text-gold-600">
              <Users className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-ink-600 hover:text-gold-600">
              <Bookmark className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-ink-600 hover:text-gold-600">
              <Bell className="h-5 w-5" />
            </Button>
            
            {/* Profile Menu */}
            <Link href="/profile">
              <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-gold-500 transition-all">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
