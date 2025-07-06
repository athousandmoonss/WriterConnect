import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AccessibilitySettings {
  isEnabled: boolean;
  highContrast: boolean;
  largeText: boolean;
  textToSpeech: boolean;
  colorScheme: 'default' | 'highContrast' | 'dyslexiaFriendly' | 'lowLight';
  fontSize: 'normal' | 'large' | 'extraLarge';
  readingSpeed: number; // 0.5 to 2.0
  voiceType: 'default' | 'female' | 'male';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const defaultSettings: AccessibilitySettings = {
  isEnabled: false,
  highContrast: false,
  largeText: false,
  textToSpeech: false,
  colorScheme: 'default',
  fontSize: 'normal',
  readingSpeed: 1.0,
  voiceType: 'default'
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    
    // Apply CSS classes based on settings
    const root = document.documentElement;
    
    // Remove existing accessibility classes
    root.classList.remove('accessibility-enabled', 'high-contrast', 'large-text', 'dyslexia-friendly', 'low-light');
    
    if (settings.isEnabled) {
      root.classList.add('accessibility-enabled');
      
      if (settings.highContrast || settings.colorScheme === 'highContrast') {
        root.classList.add('high-contrast');
      }
      
      if (settings.largeText || settings.fontSize !== 'normal') {
        root.classList.add('large-text');
      }
      
      if (settings.colorScheme === 'dyslexiaFriendly') {
        root.classList.add('dyslexia-friendly');
      }
      
      if (settings.colorScheme === 'lowLight') {
        root.classList.add('low-light');
      }
    }
  }, [settings]);

  const updateSettings = (updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const speak = (text: string) => {
    if (!settings.textToSpeech || !text.trim()) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.readingSpeed;
    
    // Set voice based on preference
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (settings.voiceType === 'female') {
        const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('woman'));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else if (settings.voiceType === 'male') {
        const maleVoice = voices.find(voice => voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('man'));
        if (maleVoice) utterance.voice = maleVoice;
      }
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <AccessibilityContext.Provider value={{
      settings,
      updateSettings,
      speak,
      stopSpeaking,
      isSpeaking
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}