
import React from 'react';

const Logo = ({ className = "", size = "small" | "medium" | "large" }: { className?: string, size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-10",
    large: "h-12"
  };

  const textSizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-2xl"
  };

  // Get current user data from localStorage if available
  const getCurrentUserData = () => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (e) {
      console.error("Error getting user data:", e);
    }
    return {
      logo: "/lovable-uploads/c1980de2-8024-43e4-a1be-86e1b8cc3e79.png",
      primaryColor: "#00A3FF",
      companyName: "Gestão",
      companyNameColor: "#000000"
    };
  };

  const userData = getCurrentUserData();
  const logoSrc = userData.logo || "/lovable-uploads/c1980de2-8024-43e4-a1be-86e1b8cc3e79.png";
  const primaryColor = userData.primaryColor || "#00A3FF";
  const companyName = userData.companyName || "Gestão";
  const companyNameColor = userData.companyNameColor || "#000000";
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoSrc}
        alt={`${companyName} Logo`} 
        className={`mb-2 ${sizeClasses[size]}`}
      />
      <div className={`font-bold ${textSizeClasses[size]} flex items-center`}>
        <span style={{ color: companyNameColor }} className="font-extrabold tracking-tight mr-0.5">{companyName}</span>
        <span style={{ color: primaryColor }} className="font-bold">CRM</span>
      </div>
    </div>
  );
};

export default Logo;
