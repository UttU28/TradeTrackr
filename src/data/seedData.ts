import { v4 as uuidv4 } from 'uuid';
import { Week, Trade } from '../types';

// Get current date for the week
const now = new Date();
const startOfWeek = new Date(now);
startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

// Format dates to ISO string (YYYY-MM-DD)
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const seedWeek: Week = {
  id: uuidv4(),
  startDate: formatDate(startOfWeek),
  endDate: formatDate(endOfWeek),
  startValue: 3500.00,
  trades: []
};

// Trade amounts from the user's data
export const tradeAmounts = [
  120.67,
  256.89,
  383.16,
  -125.21,
  -423.95,
  156.09,
  -243.53,
  -89.29,
  764.94,
  476.34,
  -324.60,
  239.16,
  -95.61,
  -156.57,
  543.25,
  -98.56,
  -45.78,
  104.89,
  -345.69,
  486.54
];

// Create trades with timestamps spread throughout the week
export const createTradesForWeek = (weekId: string): Trade[] => {
  const trades: Trade[] = [];
  const startTime = startOfWeek.getTime();
  const timeSpan = endOfWeek.getTime() - startTime;
  
  tradeAmounts.forEach((amount, index) => {
    // Create somewhat random timestamps throughout the week
    const timestamp = startTime + (timeSpan * (index / (tradeAmounts.length * 1.2)));
    
    trades.push({
      id: uuidv4(),
      weekId,
      amount,
      description: amount > 0 ? 'Profitable trade' : 'Loss trade',
      timestamp
    });
  });
  
  return trades;
};

// Function to add seed data to the app
export const addSeedData = () => {
  // This function will be called from the browser console
  return {
    week: seedWeek,
    trades: createTradesForWeek(seedWeek.id)
  };
}; 