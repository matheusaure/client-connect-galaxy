
import React from 'react';

const Logo = ({ className = "", size = "medium" }: { className?: string, size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-10",
    large: "h-12"
  };

  // Get current user logo from localStorage if available
  const getCurrentUserLogo = (): string => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.logo || "/lovable-uploads/c1980de2-8024-43e4-a1be-86e1b8cc3e79.png";
      }
    } catch (e) {
      console.error("Error getting user logo:", e);
    }
    return "/lovable-uploads/c1980de2-8024-43e4-a1be-86e1b8cc3e79.png";
  };

  // Get primary color from localStorage if available
  const getPrimaryColor = (): string => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.primaryColor || "#00A3FF";
      }
    } catch (e) {
      console.error("Error getting user primary color:", e);
    }
    return "#00A3FF";
  };

  const logoSrc = getCurrentUserLogo();
  const primaryColor = getPrimaryColor();
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoSrc}
        alt="GestãoCRM Logo" 
        className={`mb-2 ${sizeClasses[size]}`}
      />
      <div className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-brand-blue ${size === "large" ? "text-2xl" : size === "medium" ? "text-xl" : "text-lg"}`}>
        <span className="text-black">Gestão</span>
        <span style={{ color: primaryColor }}>CRM</span>
      </div>
    </div>
  );
};

export default Logo;
