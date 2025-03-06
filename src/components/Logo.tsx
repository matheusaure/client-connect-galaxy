
import React from 'react';

const Logo = ({ className = "", size = "medium" }: { className?: string, size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-10",
    large: "h-12"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/c1980de2-8024-43e4-a1be-86e1b8cc3e79.png" 
          alt="GestãoCRM Logo" 
          className={`mr-2 ${sizeClasses[size]}`}
        />
        <div className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-black ${sizeClasses[size]}`}>
          <span className="text-black">Gestão</span>
          <span className="text-brand-blue">CRM</span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
