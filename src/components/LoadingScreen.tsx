import React from 'react';
import printerLogo from '@/assets/printer-logo.jpg';

interface LoadingScreenProps {
  logoSrc?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  logoSrc = printerLogo 
}) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-elegant animate-pulse">
            <img 
              src={logoSrc} 
              alt="Printer Logo" 
              className="w-full h-full object-cover animate-scale-in"
            />
          </div>
          <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground animate-fade-in">
            Print Shop
          </h2>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};