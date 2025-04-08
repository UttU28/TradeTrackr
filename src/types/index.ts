export interface User {
  id: string;
  name: string;
  defaultRatio: number;
}

export interface WeeklyRatio {
  weekId: string;
  userId: string;
  ratio: number;
}

export interface Trade {
  id: string;
  weekId: string;
  amount: number;
  description: string;
  timestamp: number;
}

export interface Week {
  id: string;
  startDate: string;
  endDate: string;
  startValue: number;
  trades: Trade[];
}

export interface AppState {
  users: User[];
  weeks: Week[];
  weeklyRatios: WeeklyRatio[];
  currentWeekId: string | null;
}

export type TradeFormData = {
  weekId: string;
  amount: number;
  description: string;
}

export type UserFormData = {
  name: string;
  defaultRatio: number;
}

export type WeekFormData = {
  startDate: string;
  endDate: string;
  startValue: number;
}

export type TradeStats = {
  netGain: number;
  avgPerTrade: number;
  positiveCount: number;
  negativeCount: number;
  largestGain: number;
  largestLoss: number;
}

export type UserWeeklySummary = {
  userId: string;
  userName: string;
  ratio: number;
  netGain: number;
}

export type WeeklySummary = {
  weekId: string;
  startDate: string;
  endDate: string;
  startValue: number;
  endValue: number;
  netGain: number;
  tradeCount: number;
  stats: TradeStats;
  userSummaries: UserWeeklySummary[];
} 