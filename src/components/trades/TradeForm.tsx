import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { TradeFormData } from '../../types';

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
      <div className="text-center p-4 bg-tradeDark/30 rounded-lg border border-tradeLight/20">
        <p className="text-white/80">Please create a week before adding trades</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!weekId && (
        <div>
          <label htmlFor="weekId" className="block text-sm font-medium text-white/80 mb-1">
            Week
          </label>
          <select
            id="weekId"
            value={selectedWeekId || ''}
            onChange={(e) => setSelectedWeekId(e.target.value)}
            className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
            required
          >
            <option value="">Select Week</option>
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                {new Date(week.startDate).toLocaleDateString()} to {new Date(week.endDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-white/80 mb-1">
          Amount
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPositive(true)}
            className={`p-2 rounded-lg ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-tradeDark/50 text-white/60'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsPositive(false)}
            className={`p-2 rounded-lg ${
              !isPositive ? 'bg-tradeError/20 text-tradeError' : 'bg-tradeDark/50 text-white/60'
            }`}
          >
            <MinusCircle className="w-5 h-5" />
          </button>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
            placeholder="0.00"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-1">
          Description (Optional)
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
          placeholder="Trade description..."
        />
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center"
          disabled={!amount || (!selectedWeekId && !weekId)}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Trade
        </button>
      </div>
    </form>
  );
};

export default TradeForm; 