import { v4 as uuidv4 } from 'uuid';
import { Week, Trade } from '../types';

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const now = new Date();

// Helper to get start and end of a week given a base date
const getWeekRange = (baseDate: Date) => {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay() + 1); // Monday
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday
  return [start, end];
};

// Generate seed weeks
export const seedWeeks: Week[] = Array.from({ length: 10 }).map((_, i) => {
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (9 - i) * 7);
  const [start, end] = getWeekRange(weekStart);

  // Create fluctuating start values
  const baseValue = 3500;
  const fluctuation = (Math.random() - 0.5) * 500;
  const startValue = baseValue + i * 150 + fluctuation;

  return {
    id: uuidv4(),
    startDate: formatDate(start),
    endDate: formatDate(end),
    startValue: parseFloat(startValue.toFixed(2)),
    trades: []
  };
});

export const createTradeAmounts = (weekIndex: number): number[] => {
  const amounts: number[] = [];
  for (let i = 0; i < 18; i++) {
    const rand = Math.random();
    let amount;
    if (weekIndex < 3) {
      amount = rand > 0.5 ? rand * 500 : -rand * 150;
    } else if (weekIndex < 7) {
      amount = rand > 0.4 ? rand * 400 : -rand * 250;
    } else {
      amount = rand > 0.6 ? rand * 300 : -rand * 300;
    }
    amounts.push(parseFloat(amount.toFixed(2)));
  }
  return amounts;
};

const getTradeDescription = (amount: number): string => {
  if (amount > 500) return 'Excellent trade on market momentum';
  if (amount > 200) return 'Good entry and exit points';
  if (amount > 100) return 'Solid trade with proper risk management';
  if (amount > 0) return 'Small win following the trend';
  if (amount > -100) return 'Small loss, stopped out';
  if (amount > -200) return 'Loss from unexpected reversal';
  if (amount > -300) return 'Significant loss due to market shift';
  return 'Major loss from gap down overnight';
};

export const createTradesForWeek = (weekId: string, startTime: number, weekIndex: number): Trade[] => {
  const amounts = createTradeAmounts(weekIndex);
  const trades: Trade[] = [];

  amounts.forEach((amount, index) => {
    const dayOffset = Math.min(Math.floor(index / 4), 4);
    const hourOffset = 9.5 + (index % 4) * 1.5;

    const tradeDate = new Date(startTime);
    tradeDate.setDate(tradeDate.getDate() + dayOffset);
    tradeDate.setHours(hourOffset, (index % 2) * 30, 0, 0);

    trades.push({
      id: uuidv4(),
      weekId,
      amount,
      description: getTradeDescription(amount),
      timestamp: tradeDate.getTime()
    });
  });

  return trades;
};

export const addSeedData = () => {
  const allWeeks = seedWeeks.map((week, index) => {
    const startTime = new Date(week.startDate).getTime();
    return {
      week: {
        startDate: week.startDate,
        endDate: week.endDate,
        startValue: week.startValue
      },
      trades: createTradesForWeek(week.id, startTime, index)
    };
  });

  return allWeeks;
};
