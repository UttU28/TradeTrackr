import React from 'react';
import { useAppStore } from '../store';
import { seedWeeks, createTradesForWeek } from '../data/seedData';

const SeedDataButton: React.FC = () => {
  const { addWeek, setCurrentWeek } = useAppStore();
  
  const handleAddSeedData = () => {
    let lastWeekId = '';
    
    // Add all three weeks with their trades
    seedWeeks.forEach((seedWeek, index) => {
      // Add the week first
      const weekData = {
        startDate: seedWeek.startDate,
        endDate: seedWeek.endDate,
        startValue: seedWeek.startValue
      };
      
      const weekId = addWeek(weekData);
      lastWeekId = weekId; // Store the last week ID to set as current
      
      // Create trades for the week
      const startTime = new Date(seedWeek.startDate).getTime();
      const trades = createTradesForWeek(weekId, startTime, index);
      
      // Add each trade to the store
      const { addTrade } = useAppStore.getState();
      trades.forEach(trade => {
        addTrade({
          weekId,
          amount: trade.amount,
          description: trade.description
        });
      });
    });
    
    // Set the most recent week as current
    setCurrentWeek(lastWeekId);
    
    alert(`Demo data generated successfully!`);
  };
  
  return (
    <button
      onClick={handleAddSeedData}
      className="btn-highlight flex items-center"
    >
      Generate Demo Data
    </button>
  );
};

export default SeedDataButton; 