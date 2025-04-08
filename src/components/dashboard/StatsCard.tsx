import React from 'react';
import { useAppStore } from '../../store';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { formatCurrency } from '../../utils';
import { TrendingUp, TrendingDown, DollarSign, Award } from 'lucide-react';

const StatsCard: React.FC = () => {
  const { getAllWeeklySummaries } = useAppStore();
  const allSummaries = getAllWeeklySummaries();
  
  if (allSummaries.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-white/70">Add weeks and trades to see statistics</p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate overall statistics
  const totalStartValue = allSummaries[0].startValue;
  const totalEndValue = allSummaries[allSummaries.length - 1].endValue;
  
  const totalNetGain = allSummaries.reduce((sum, summary) => sum + summary.netGain, 0);
  const avgWeeklyGain = totalNetGain / allSummaries.length;
  
  const bestWeek = allSummaries.reduce((best, current) => 
    current.netGain > best.netGain ? current : best, allSummaries[0]);
    
  const worstWeek = allSummaries.reduce((worst, current) => 
    current.netGain < worst.netGain ? current : worst, allSummaries[0]);
  
  const totalTrades = allSummaries.reduce((sum, summary) => sum + summary.tradeCount, 0);
  
  const isPositiveOverall = totalNetGain >= 0;
  
  return (
    <Card>
      <CardHeader
        title="Performance Summary"
        icon={<DollarSign className="w-5 h-5 text-white" />}
      />
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {isPositiveOverall ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-tradeError" />
              )}
              <span className="text-sm font-medium text-white/80">Overall Performance</span>
            </div>
            <div className={`text-sm font-medium ${
              isPositiveOverall ? 'text-green-400' : 'text-tradeError'
            }`}>
              {formatCurrency(totalNetGain)}
            </div>
          </div>
          
          <div className="bg-tradeBg/50 rounded-lg overflow-hidden">
            <div 
              className={`h-2 ${isPositiveOverall ? 'bg-green-500' : 'bg-tradeError'}`}
              style={{ 
                width: `${Math.min(Math.abs(totalNetGain / totalStartValue) * 100, 100)}%`
              }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-white/70 mb-1">Start Value</div>
            <div className="text-lg font-medium">{formatCurrency(totalStartValue)}</div>
          </div>
          <div>
            <div className="text-sm text-white/70 mb-1">Current Value</div>
            <div className="text-lg font-medium">{formatCurrency(totalEndValue)}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-white/70 mb-1">Total Weeks</div>
            <div className="text-lg font-medium">{allSummaries.length}</div>
          </div>
          <div>
            <div className="text-sm text-white/70 mb-1">Avg. Weekly Gain</div>
            <div className={`text-lg font-medium ${
              avgWeeklyGain >= 0 ? 'text-green-400' : 'text-tradeError'
            }`}>
              {formatCurrency(avgWeeklyGain)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-white/70 mb-1">Total Trades</div>
            <div className="text-lg font-medium">{totalTrades}</div>
          </div>
          <div>
            <div className="text-sm text-white/70 mb-1">Avg. Per Trade</div>
            <div className={`text-lg font-medium ${
              totalTrades > 0 && totalNetGain / totalTrades >= 0 
                ? 'text-green-400' 
                : 'text-tradeError'
            }`}>
              {totalTrades > 0 ? formatCurrency(totalNetGain / totalTrades) : '$0.00'}
            </div>
          </div>
        </div>
        
        <div className="bg-tradeBg/30 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-4 h-4 text-tradeHighlight" />
            <span className="text-sm font-medium text-white/80">Best Week</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">
              Week of {new Date(bestWeek.startDate).toLocaleDateString()}
            </span>
            <span className="text-green-400 font-medium">
              {formatCurrency(bestWeek.netGain)}
            </span>
          </div>
        </div>
        
        <div className="bg-tradeBg/30 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-4 h-4 text-tradeError" />
            <span className="text-sm font-medium text-white/80">Worst Week</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">
              Week of {new Date(worstWeek.startDate).toLocaleDateString()}
            </span>
            <span className="text-tradeError font-medium">
              {formatCurrency(worstWeek.netGain)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard; 