"use client";
import React from "react";

interface InfoCardProps {
  title: string;
  icon?: string;
  items?: string[];
  children?: React.ReactNode;
  className?: string;
}

export default function InfoCard({ 
  title, 
  icon, 
  items, 
  children, 
  className 
}: InfoCardProps) {
  return (
    <div className={`bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px] ${className || ""}`}>
      <h3 className="text-2xl font-bold text-primary mb-4">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      
      {items && (
        <ul className="space-y-2 text-lg text-card-foreground">
          {items.map((item, idx) => (
            <li 
              key={idx} 
              className="hover:text-primary transition-colors duration-200"
              dangerouslySetInnerHTML={{ __html: item }} 
            />
          ))}
        </ul>
      )}
      
      {children && (
        <div className="mt-4 text-base text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}