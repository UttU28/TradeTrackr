import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { useAppStore } from '../../store';
import { 
  formatCurrency, 
  formatDate, 
  formatDateRange,
  formatPercent, 
  calculatePercentChange 
} from '../../utils';

interface WeeklySummaryCardProps {
  weekId: string;
  showTradeStats?: boolean;
}

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ 
  weekId,
  showTradeStats = true
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
        description={formatDateRange(summary.startDate, summary.endDate)}
        icon={<DollarSign className="w-5 h-5 text-white" />}
      />
      
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-white/70 mb-1">Start Value</div>
            <div className="text-base font-medium">{formatCurrency(summary.startValue)}</div>
          </div>
          <div>
            <div className="text-xs text-white/70 mb-1">End Value</div>
            <div className="text-base font-medium">{formatCurrency(summary.endValue)}</div>
          </div>
        </div>
        
        <div className="bg-tradeBg/50 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 mb-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-tradeError" />
            )}
            <span className="text-xs font-medium text-white/80">Net Change</span>
          </div>
          
          <div className="flex items-baseline justify-between">
            <div className={`text-xl font-bold ${
              isPositive ? 'text-green-400' : 'text-tradeError'
            }`}>
              {formatCurrency(summary.netGain)}
            </div>
            <div className={`text-base ${
              isPositive ? 'text-green-400' : 'text-tradeError'
            }`}>
              {formatPercent(percentChange)}
            </div>
          </div>
        </div>
        
        {showTradeStats && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-xs text-white/70 mb-1">Trades</div>
              <div className="text-base font-medium">{summary.tradeCount}</div>
            </div>
            <div>
              <div className="text-xs text-white/70 mb-1">Avg Per Trade</div>
              <div className={`text-base font-medium ${
                summary.stats.avgPerTrade >= 0 ? 'text-green-400' : 'text-tradeError'
              }`}>
                {formatCurrency(summary.stats.avgPerTrade)}
              </div>
            </div>
          </div>
        )}
        
        {summary.userSummaries.length > 0 && (
          <div>
            <div className="text-xs text-white/70 mb-2">Participant Outcomes</div>
            <div className="space-y-1">
              {summary.userSummaries.map((userSummary) => (
                <div 
                  key={userSummary.userId}
                  className="flex items-center justify-between bg-tradeBg/30 rounded-lg p-2"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <div className="w-1.5 h-1.5 rounded-full bg-tradeLight flex-shrink-0"></div>
                    <span className="text-xs truncate">{userSummary.userName}</span>
                  </div>
                  <div className={`text-xs font-medium ${
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
    </Card>
  );
};

export default WeeklySummaryCard; 