import React from 'react';
import AccessibilityPanel from '@/components/accessibility-panel';

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <AccessibilityPanel />
      </div>
    </div>
  );
}