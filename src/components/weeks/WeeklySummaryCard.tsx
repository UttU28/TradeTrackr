import React from 'react';
import { ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import { useAppStore } from '../../store';
import { formatCurrency, formatDate, formatPercent, calculatePercentChange } from '../../utils';

interface WeeklySummaryCardProps {
  weekId: string;
  showViewButton?: boolean;
}

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ 
  weekId, 
  showViewButton = true 
}) => {
  const { getWeeklySummary } = useAppStore();
  const summary = getWeeklySummary(weekId);
  
  if (!summary) {
    return null;
  }
  
  const percentChange = calculatePercentChange(summary.startValue, summary.endValue);
  const isPositive = summary.netGain >= 0;
  
  return (
    <Card>
      <CardHeader
        title={`Week of ${formatDate(summary.startDate)}`}
        description={`${formatDate(summary.startDate)} - ${formatDate(summary.endDate)}`}
        icon={<DollarSign className="w-5 h-5 text-white" />}
      />
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-white/70 mb-1">Start Value</div>
            <div className="text-xl font-medium">{formatCurrency(summary.startValue)}</div>
          </div>
          <div>
            <div className="text-sm text-white/70 mb-1">End Value</div>
            <div className="text-xl font-medium">{formatCurrency(summary.endValue)}</div>
          </div>
        </div>
        
        <div className="bg-tradeBg/50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-tradeError" />
            )}
            <span className="text-sm font-medium text-white/80">Net Change</span>
          </div>
          
          <div className="flex items-baseline justify-between">
            <div className={`text-2xl font-bold ${
              isPositive ? 'text-green-400' : 'text-tradeError'
            }`}>
              {formatCurrency(summary.netGain)}
            </div>
            <div className={`text-lg ${
              isPositive ? 'text-green-400' : 'text-tradeError'
            }`}>
              {formatPercent(percentChange)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-white/70 mb-1">Trades</div>
            <div className="text-xl font-medium">{summary.tradeCount}</div>
          </div>
          <div>
            <div className="text-sm text-white/70 mb-1">Avg Per Trade</div>
            <div className={`text-xl font-medium ${
              summary.stats.avgPerTrade >= 0 ? 'text-green-400' : 'text-tradeError'
            }`}>
              {formatCurrency(summary.stats.avgPerTrade)}
            </div>
          </div>
        </div>
        
        {summary.userSummaries.length > 0 && (
          <div>
            <div className="text-sm text-white/70 mb-2">Participant Outcomes</div>
            <div className="space-y-2">
              {summary.userSummaries.map((userSummary) => (
                <div 
                  key={userSummary.userId}
                  className="flex items-center justify-between bg-tradeBg/30 rounded-lg p-2"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-tradeLight"></div>
                    <span className="text-sm">{userSummary.userName}</span>
                  </div>
                  <div className={`text-sm font-medium ${
                    userSummary.netGain >= 0 ? 'text-green-400' : 'text-tradeError'
                  }`}>
                    {formatCurrency(userSummary.netGain)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {showViewButton && (
        <CardFooter className="flex justify-end">
          <Link 
            to={`/weeks/${weekId}`} 
            className="flex items-center text-tradeHighlight hover:text-tradeHighlight/80 transition-colors"
          >
            <span className="mr-1">View Details</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default WeeklySummaryCard; 