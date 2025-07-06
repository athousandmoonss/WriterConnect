import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import AccessibilityToolbar from "@/components/accessibility-toolbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Portfolio from "@/pages/portfolio";
import Profile from "@/pages/profile";
import Write from "@/pages/write";
import Messages from "@/pages/messages";
import Accessibility from "@/pages/accessibility";
import Header from "@/components/header";

function Router() {
  return (
    <div className="min-h-screen bg-ink-50">
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/portfolio" component={Portfolio} />
          <Route path="/profile/:id?" component={Profile} />
          <Route path="/write" component={Write} />
          <Route path="/messages" component={Messages} />
          <Route path="/accessibility" component={Accessibility} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <AccessibilityToolbar />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityProvider>
          <Toaster />
          <Router />
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
