import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAppStore } from '../../store';
import { Trade } from '../../types';
import { formatCurrency } from '../../utils';

interface TradeListProps {
  weekId: string;
}

const TradeList: React.FC<TradeListProps> = ({ weekId }) => {
  const { weeks, removeTrade } = useAppStore();
  
  const week = weeks.find((w) => w.id === weekId);
  
  if (!week) {
    return <div className="text-white/70">No week found</div>;
  }
  
  if (week.trades.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed border-tradeLight/20 rounded-lg bg-tradeDark/20">
        <p className="text-white/70">No trades recorded for this week</p>
      </div>
    );
  }
  
  // Sort trades by timestamp (newest first)
  const sortedTrades = [...week.trades].sort((a, b) => b.timestamp - a.timestamp);
  
  return (
    <div className="space-y-2">
      {sortedTrades.map((trade) => (
        <TradeItem key={trade.id} trade={trade} onRemove={removeTrade} />
      ))}
    </div>
  );
};

interface TradeItemProps {
  trade: Trade;
  onRemove: (id: string) => void;
}

const TradeItem: React.FC<TradeItemProps> = ({ trade, onRemove }) => {
  const isPositive = trade.amount > 0;
  
  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this trade?')) {
      onRemove(trade.id);
    }
  };
  
  return (
    <div className={`rounded-lg p-3 flex items-center justify-between bg-tradeBg/80 border border-tradeLight/10 transition-colors ${
      isPositive ? 'hover:border-green-500/30' : 'hover:border-tradeError/30'
    }`}>
      <div className="flex items-center mr-2 min-w-0">
        <div className={`w-2 h-full min-h-[40px] rounded-full mr-2 flex-shrink-0 ${
          isPositive ? 'bg-green-500' : 'bg-tradeError'
        }`} />
        <div className="min-w-0">
          <div className={`text-base sm:text-lg font-medium truncate ${
            isPositive ? 'text-green-400' : 'text-tradeError'
          }`}>
            {formatCurrency(trade.amount)}
          </div>
          {trade.description && (
            <div className="text-xs sm:text-sm text-white/70 mt-1 truncate">{trade.description}</div>
          )}
          <div className="text-xs text-white/50 mt-1">
            {new Date(trade.timestamp).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
      <button
        onClick={handleRemove}
        className="p-2 rounded-full text-white/50 hover:text-tradeError hover:bg-tradeError/10 transition-colors flex-shrink-0"
        aria-label="Remove trade"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TradeList; 