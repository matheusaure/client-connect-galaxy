
import React from 'react';

const Logo = ({ className = "", size = "medium" }: { className?: string, size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-10",
    large: "h-12"
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-teal ${sizeClasses[size]}`}>
        <span className="text-black">Gestão</span>
        <span className="text-brand-blue">CRM</span>
      </div>
    </div>
  );
};

export default Logo;
