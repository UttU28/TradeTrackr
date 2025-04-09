import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { TradeFormData } from '../../types';
import { formatDate } from '../../utils';

interface TradeFormProps {
  weekId?: string;
  onComplete?: () => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ weekId, onComplete }) => {
  const { addTrade, weeks } = useAppStore();
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(weekId || null);
  const [isPositive, setIsPositive] = useState<boolean>(true);
  
  // Sort weeks by date (newest first)
  const sortedWeeks = [...weeks].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !selectedWeekId) return;
    
    const parsedAmount = parseFloat(amount) * (isPositive ? 1 : -1);
    
    const tradeData: TradeFormData = {
      weekId: selectedWeekId,
      amount: parsedAmount,
      description: description.trim(),
    };
    
    addTrade(tradeData);
    
    // Reset form
    setAmount('');
    setDescription('');
    setIsPositive(true);
    
    if (onComplete) {
      onComplete();
    }
  };
  
  if (weeks.length === 0) {
    return (
      <div className="text-center p-3 bg-tradeDark/30 rounded-lg border border-tradeLight/20">
        <p className="text-sm text-white/80">Please create a week before adding trades</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!weekId && (
        <div>
          <label htmlFor="weekId" className="block text-xs font-medium text-white/80 mb-1">
            Week
          </label>
          <select
            id="weekId"
            value={selectedWeekId || ''}
            onChange={(e) => setSelectedWeekId(e.target.value)}
            className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
            required
          >
            <option value="">Select Week</option>
            {sortedWeeks.map((week) => (
              <option key={week.id} value={week.id}>
                Week of {formatDate(week.startDate)}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div>
        <label htmlFor="amount" className="block text-xs font-medium text-white/80 mb-1">
          Amount
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPositive(true)}
            className={`p-2 rounded-lg flex-shrink-0 ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-tradeDark/50 text-white/60'
            }`}
            aria-label="Set positive amount"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsPositive(false)}
            className={`p-2 rounded-lg flex-shrink-0 ${
              !isPositive ? 'bg-tradeError/20 text-tradeError' : 'bg-tradeDark/50 text-white/60'
            }`}
            aria-label="Set negative amount"
          >
            <MinusCircle className="w-5 h-5" />
          </button>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-white/80 mb-1">
          Description (Optional)
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
          placeholder="Trade description..."
        />
      </div>
      
      <div className="pt-1">
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center text-sm py-2"
          disabled={!amount || (!selectedWeekId && !weekId)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Trade
        </button>
      </div>
    </form>
  );
};

export default TradeForm; 