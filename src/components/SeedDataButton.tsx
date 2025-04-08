import React from 'react';
import { useAppStore } from '../store';
import { seedWeek, createTradesForWeek } from '../data/seedData';

const SeedDataButton: React.FC = () => {
  const { addWeek, setCurrentWeek } = useAppStore();
  
  const handleAddSeedData = () => {
    // Add the week first
    const weekData = {
      startDate: seedWeek.startDate,
      endDate: seedWeek.endDate,
      startValue: seedWeek.startValue
    };
    
    const weekId = addWeek(weekData);
    
    // Create trades for the week
    const trades = createTradesForWeek(weekId);
    
    // Add each trade to the store
    const { addTrade } = useAppStore.getState();
    trades.forEach(trade => {
      addTrade({
        weekId,
        amount: trade.amount,
        description: trade.description
      });
    });
    
    // Set as current week
    setCurrentWeek(weekId);
    
    alert(`Added Week #1 with ${trades.length} trades!`);
  };
  
  return (
    <button
      onClick={handleAddSeedData}
      className="btn-highlight flex items-center"
    >
      Add Demo Week
    </button>
  );
};

export default SeedDataButton; 