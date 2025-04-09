import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppStore } from '../../store';
import { formatDate, formatCurrency, formatDateRange } from '../../utils';

interface WeekCardProps {
  weekId: string;
  isSelected: boolean;
  onSelect: (weekId: string) => void;
}

const WeekCard: React.FC<WeekCardProps> = ({ 
  weekId, 
  isSelected,
  onSelect
}) => {
  const { getWeeklySummary } = useAppStore();
  const summary = getWeeklySummary(weekId);
  
  if (!summary) return null;
  
  const isPositive = summary.netGain >= 0;
  
  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'bg-tradeHighlight/20 border border-tradeHighlight/50' 
          : 'bg-tradeBg/30 border border-tradeLight/10 hover:border-tradeLight/30'
      }`}
      onClick={() => onSelect(weekId)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 text-tradeLight mr-1 flex-shrink-0" />
          <h3 className="text-white font-medium text-sm truncate">Week of {formatDate(summary.startDate)}</h3>
        </div>
        <div className="text-xs text-white/60 ml-2">
          {summary.tradeCount} trades
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="flex items-center">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-400 mr-1 flex-shrink-0" />
          ) : (
            <TrendingDown className="w-4 h-4 text-tradeError mr-1 flex-shrink-0" />
          )}
          <span className={`font-medium ${
            isPositive ? 'text-green-400' : 'text-tradeError'
          }`}>
            {formatCurrency(summary.netGain)}
          </span>
        </div>
        <div className="text-xs text-white/60">
          {formatDateRange(summary.startDate, summary.endDate).split(',')[0]}
        </div>
      </div>
    </div>
  );
};

export default WeekCard; 