import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ className = '', children, onClick }) => {
  return (
    <div 
      className={`card transition-all ${onClick ? 'cursor-pointer hover:scale-[1.01]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  title, 
  description, 
  icon, 
  action 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="flex-shrink-0 bg-tradeLight/30 p-2 rounded-lg">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          {description && (
            <p className="text-sm text-white/70">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </div>
  );
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children }) => {
  return (
    <div className={`mt-4 pt-3 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
};

export default Card; 