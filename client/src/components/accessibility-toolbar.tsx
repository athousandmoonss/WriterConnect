import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Type, 
  Volume2, 
  VolumeX, 
  Palette,
  Settings
} from 'lucide-react';

export default function AccessibilityToolbar() {
  const { settings, updateSettings, speak, stopSpeaking, isSpeaking } = useAccessibility();

  const handleReadPage = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      const textContent = mainContent.textContent || '';
      const cleanText = textContent.replace(/\s+/g, ' ').trim();
      speak(cleanText);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="shadow-lg bg-background/90 backdrop-blur-sm"
          >
            <Accessibility className="h-4 w-4" />
            <span className="sr-only">Accessibility Options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Accessibility Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => updateSettings({ isEnabled: !settings.isEnabled })}
          >
            {settings.isEnabled ? (
              <Eye className="h-4 w-4 mr-2" />
            ) : (
              <EyeOff className="h-4 w-4 mr-2" />
            )}
            {settings.isEnabled ? 'Disable' : 'Enable'} Accessibility
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => updateSettings({ 
              highContrast: !settings.highContrast,
              colorScheme: !settings.highContrast ? 'highContrast' : 'default'
            })}
          >
            <Palette className="h-4 w-4 mr-2" />
            {settings.highContrast ? 'Disable' : 'Enable'} High Contrast
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => updateSettings({ 
              largeText: !settings.largeText,
              fontSize: !settings.largeText ? 'large' : 'normal'
            })}
          >
            <Type className="h-4 w-4 mr-2" />
            {settings.largeText ? 'Normal' : 'Large'} Text
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => updateSettings({ 
              colorScheme: settings.colorScheme === 'dyslexiaFriendly' ? 'default' : 'dyslexiaFriendly'
            })}
          >
            <Eye className="h-4 w-4 mr-2" />
            {settings.colorScheme === 'dyslexiaFriendly' ? 'Disable' : 'Enable'} Dyslexia Mode
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => updateSettings({ 
              colorScheme: settings.colorScheme === 'lowLight' ? 'default' : 'lowLight'
            })}
          >
            <Settings className="h-4 w-4 mr-2" />
            {settings.colorScheme === 'lowLight' ? 'Disable' : 'Enable'} Low Light Mode
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => updateSettings({ textToSpeech: !settings.textToSpeech })}
          >
            {settings.textToSpeech ? (
              <Volume2 className="h-4 w-4 mr-2" />
            ) : (
              <VolumeX className="h-4 w-4 mr-2" />
            )}
            {settings.textToSpeech ? 'Disable' : 'Enable'} Text-to-Speech
          </DropdownMenuItem>
          
          {settings.textToSpeech && (
            <>
              <DropdownMenuItem onClick={handleReadPage} disabled={isSpeaking}>
                <Volume2 className="h-4 w-4 mr-2" />
                Read Page
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={stopSpeaking} disabled={!isSpeaking}>
                <VolumeX className="h-4 w-4 mr-2" />
                Stop Reading
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}