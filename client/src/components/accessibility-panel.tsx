import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Eye, EyeOff, Volume2, VolumeX, Settings, Palette, Type } from 'lucide-react';

export default function AccessibilityPanel() {
  const { settings, updateSettings, speak, stopSpeaking, isSpeaking } = useAccessibility();

  const testSpeech = () => {
    const testText = "This is a test of the text-to-speech feature. You can adjust the reading speed and voice type in the settings below.";
    speak(testText);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Accessibility Settings</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateSettings({ isEnabled: !settings.isEnabled })}
        >
          {settings.isEnabled ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Enabled
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Disabled
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Visual Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="color-scheme">Color Scheme</Label>
            <Select 
              value={settings.colorScheme} 
              onValueChange={(value) => updateSettings({ colorScheme: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="highContrast">High Contrast</SelectItem>
                <SelectItem value="dyslexiaFriendly">Dyslexia Friendly</SelectItem>
                <SelectItem value="lowLight">Low Light</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast">High Contrast Mode</Label>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <Select 
              value={settings.fontSize} 
              onValueChange={(value) => updateSettings({ fontSize: value as any })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extraLarge">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="large-text">Large Text</Label>
            <Switch
              id="large-text"
              checked={settings.largeText}
              onCheckedChange={(checked) => updateSettings({ largeText: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Text-to-Speech
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="text-to-speech">Enable Text-to-Speech</Label>
            <Switch
              id="text-to-speech"
              checked={settings.textToSpeech}
              onCheckedChange={(checked) => updateSettings({ textToSpeech: checked })}
            />
          </div>

          {settings.textToSpeech && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reading-speed">Reading Speed: {settings.readingSpeed.toFixed(1)}x</Label>
                <Slider
                  id="reading-speed"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={[settings.readingSpeed]}
                  onValueChange={(value) => updateSettings({ readingSpeed: value[0] })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="voice-type">Voice Type</Label>
                <Select 
                  value={settings.voiceType} 
                  onValueChange={(value) => updateSettings({ voiceType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={testSpeech}
                  disabled={isSpeaking}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Test Speech
                </Button>
                <Button 
                  variant="outline" 
                  onClick={stopSpeaking}
                  disabled={!isSpeaking}
                >
                  <VolumeX className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => updateSettings({ 
              isEnabled: true,
              highContrast: true,
              largeText: true,
              textToSpeech: true,
              colorScheme: 'highContrast',
              fontSize: 'large'
            })}
          >
            <Type className="h-4 w-4 mr-2" />
            Enable All Accessibility Features
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => updateSettings({ 
              isEnabled: false,
              highContrast: false,
              largeText: false,
              textToSpeech: false,
              colorScheme: 'default',
              fontSize: 'normal'
            })}
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}