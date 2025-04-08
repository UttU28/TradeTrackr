import { TradeStats, WeeklySummary } from '../types';

/**
 * Formats a number as currency
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats a date as MM/DD/YYYY
 */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formats a percentage
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Calculates the percentage change between two values
 */
export const calculatePercentChange = (startValue: number, endValue: number): number => {
  if (startValue === 0) return 0;
  return (endValue - startValue) / Math.abs(startValue);
};

/**
 * Gets current week's start date (Monday) and end date (Sunday)
 */
export const getCurrentWeekRange = (): { startDate: string, endDate: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is Sunday
  
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    startDate: monday.toISOString().split('T')[0],
    endDate: sunday.toISOString().split('T')[0]
  };
};

/**
 * Generate a summary for multiple weeks, useful for chart data
 */
export const generateChartData = (summaries: WeeklySummary[]) => {
  // Sort by date (oldest first)
  const sortedSummaries = [...summaries].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Calculate cumulative values
  let cumulativeGain = 0;
  const chartData = sortedSummaries.map(summary => {
    cumulativeGain += summary.netGain;
    return {
      week: formatDate(summary.startDate),
      weekGain: summary.netGain,
      cumulativeGain,
      percentChange: calculatePercentChange(summary.startValue, summary.endValue)
    };
  });

  return chartData;
};

/**
 * Aggregate trade statistics across all weeks
 */
export const aggregateStats = (statsList: TradeStats[]): TradeStats => {
  const emptyStats: TradeStats = {
    netGain: 0,
    avgPerTrade: 0,
    positiveCount: 0,
    negativeCount: 0,
    largestGain: 0,
    largestLoss: 0
  };

  if (statsList.length === 0) return emptyStats;

  const aggregated = statsList.reduce((acc, stats) => {
    return {
      netGain: acc.netGain + stats.netGain,
      avgPerTrade: 0, // Calculated below
      positiveCount: acc.positiveCount + stats.positiveCount,
      negativeCount: acc.negativeCount + stats.negativeCount,
      largestGain: Math.max(acc.largestGain, stats.largestGain),
      largestLoss: Math.max(acc.largestLoss, stats.largestLoss)
    };
  }, emptyStats);

  const totalTrades = aggregated.positiveCount + aggregated.negativeCount;
  aggregated.avgPerTrade = totalTrades > 0 ? aggregated.netGain / totalTrades : 0;

  return aggregated;
};

/**
 * Generate a CSV from weekly summary data
 */
export const generateCsv = (summaries: WeeklySummary[]): string => {
  // Headers
  let csv = 'Week,Start Date,End Date,Start Value,End Value,Net Gain,Trade Count\n';
  
  // Data rows
  summaries.forEach(summary => {
    csv += `${formatDate(summary.startDate)},${summary.startDate},${summary.endDate},${summary.startValue},${summary.endValue},${summary.netGain},${summary.tradeCount}\n`;
  });
  
  return csv;
};

/**
 * Download data as a file
 */
export const downloadFile = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 