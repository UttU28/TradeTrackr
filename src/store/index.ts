import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { 
  AppState, 
  Trade, 
  User, 
  Week, 
  TradeFormData, 
  UserFormData, 
  WeekFormData,
  TradeStats,
  WeeklySummary,
  UserWeeklySummary
} from '../types';

const initialState: AppState = {
  users: [],
  weeks: [],
  weeklyRatios: [],
  currentWeekId: null,
};

type AppStore = AppState & {
  // User actions
  addUser: (userData: UserFormData) => void;
  updateUser: (userId: string, userData: UserFormData) => void;
  removeUser: (userId: string) => void;
  
  // Week actions
  addWeek: (weekData: WeekFormData) => string;
  updateWeek: (weekId: string, weekData: WeekFormData) => void;
  removeWeek: (weekId: string) => void;
  setCurrentWeek: (weekId: string) => void;
  
  // Ratio actions
  setWeeklyRatio: (weekId: string, userId: string, ratio: number) => void;
  
  // Trade actions
  addTrade: (tradeData: TradeFormData) => void;
  updateTrade: (tradeId: string, tradeData: TradeFormData) => void;
  removeTrade: (tradeId: string) => void;
  
  // Utility functions
  getCurrentWeek: () => Week | null;
  getTradeStats: (weekId: string) => TradeStats;
  getWeeklySummary: (weekId: string) => WeeklySummary;
  getAllWeeklySummaries: () => WeeklySummary[];
  exportData: () => string;
  importData: (jsonData: string) => void;
  resetData: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // User actions
      addUser: (userData) => set((state) => {
        const newUser: User = {
          id: uuidv4(),
          name: userData.name,
          defaultRatio: userData.defaultRatio,
        };
        return { users: [...state.users, newUser] };
      }),
      
      updateUser: (userId, userData) => set((state) => ({
        users: state.users.map((user) =>
          user.id === userId
            ? { ...user, name: userData.name, defaultRatio: userData.defaultRatio }
            : user
        ),
      })),
      
      removeUser: (userId) => set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        weeklyRatios: state.weeklyRatios.filter((ratio) => ratio.userId !== userId),
      })),
      
      // Week actions
      addWeek: (weekData) => {
        const weekId = uuidv4();
        set((state) => {
          const newWeek: Week = {
            id: weekId,
            startDate: weekData.startDate,
            endDate: weekData.endDate,
            startValue: weekData.startValue,
            trades: [],
          };
          return { 
            weeks: [...state.weeks, newWeek],
            currentWeekId: state.currentWeekId || weekId
          };
        });
        return weekId;
      },
      
      updateWeek: (weekId, weekData) => set((state) => ({
        weeks: state.weeks.map((week) =>
          week.id === weekId
            ? { 
                ...week, 
                startDate: weekData.startDate, 
                endDate: weekData.endDate, 
                startValue: weekData.startValue 
              }
            : week
        ),
      })),
      
      removeWeek: (weekId) => set((state) => {
        const newWeeks = state.weeks.filter((week) => week.id !== weekId);
        const newCurrentWeekId = state.currentWeekId === weekId
          ? (newWeeks.length > 0 ? newWeeks[0].id : null)
          : state.currentWeekId;
          
        return {
          weeks: newWeeks,
          weeklyRatios: state.weeklyRatios.filter((ratio) => ratio.weekId !== weekId),
          currentWeekId: newCurrentWeekId,
        };
      }),
      
      setCurrentWeek: (weekId) => set({ currentWeekId: weekId }),
      
      // Ratio actions
      setWeeklyRatio: (weekId, userId, ratio) => set((state) => {
        const existingRatioIndex = state.weeklyRatios.findIndex(
          (r) => r.weekId === weekId && r.userId === userId
        );
        
        if (existingRatioIndex >= 0) {
          const newRatios = [...state.weeklyRatios];
          newRatios[existingRatioIndex] = { ...newRatios[existingRatioIndex], ratio };
          return { weeklyRatios: newRatios };
        }
        
        return {
          weeklyRatios: [
            ...state.weeklyRatios,
            { weekId, userId, ratio },
          ],
        };
      }),
      
      // Trade actions
      addTrade: (tradeData) => set((state) => {
        const weekId = tradeData.weekId || state.currentWeekId;
        if (!weekId) return state;
        
        const newTrade: Trade = {
          id: uuidv4(),
          weekId,
          amount: tradeData.amount,
          description: tradeData.description,
          timestamp: Date.now(),
        };
        
        return {
          weeks: state.weeks.map((week) =>
            week.id === weekId
              ? { ...week, trades: [...week.trades, newTrade] }
              : week
          ),
        };
      }),
      
      updateTrade: (tradeId, tradeData) => set((state) => {
        const updatedWeeks = [...state.weeks];
        
        for (let i = 0; i < updatedWeeks.length; i++) {
          const tradeIndex = updatedWeeks[i].trades.findIndex((t) => t.id === tradeId);
          
          if (tradeIndex >= 0) {
            const trade = updatedWeeks[i].trades[tradeIndex];
            const weekId = tradeData.weekId || trade.weekId;
            
            // If week changed, remove from current week
            if (weekId !== trade.weekId) {
              updatedWeeks[i] = {
                ...updatedWeeks[i],
                trades: updatedWeeks[i].trades.filter((t) => t.id !== tradeId),
              };
              
              // Add to new week
              const targetWeekIndex = updatedWeeks.findIndex((w) => w.id === weekId);
              if (targetWeekIndex >= 0) {
                const updatedTrade = {
                  ...trade,
                  weekId,
                  amount: tradeData.amount,
                  description: tradeData.description,
                };
                
                updatedWeeks[targetWeekIndex] = {
                  ...updatedWeeks[targetWeekIndex],
                  trades: [...updatedWeeks[targetWeekIndex].trades, updatedTrade],
                };
              }
            } else {
              // Update in the same week
              updatedWeeks[i] = {
                ...updatedWeeks[i],
                trades: updatedWeeks[i].trades.map((t) =>
                  t.id === tradeId
                    ? {
                        ...t,
                        amount: tradeData.amount,
                        description: tradeData.description,
                      }
                    : t
                ),
              };
            }
            
            break;
          }
        }
        
        return { weeks: updatedWeeks };
      }),
      
      removeTrade: (tradeId) => set((state) => {
        const updatedWeeks = state.weeks.map((week) => ({
          ...week,
          trades: week.trades.filter((trade) => trade.id !== tradeId),
        }));
        
        return { weeks: updatedWeeks };
      }),
      
      // Utility functions
      getCurrentWeek: () => {
        const state = get();
        if (!state.currentWeekId) return null;
        return state.weeks.find((week) => week.id === state.currentWeekId) || null;
      },
      
      getTradeStats: (weekId) => {
        const state = get();
        const week = state.weeks.find((w) => w.id === weekId);
        
        if (!week) {
          return {
            netGain: 0,
            avgPerTrade: 0,
            positiveCount: 0,
            negativeCount: 0,
            largestGain: 0,
            largestLoss: 0,
          };
        }
        
        const trades = week.trades;
        const netGain = trades.reduce((sum, trade) => sum + trade.amount, 0);
        const positiveCount = trades.filter((trade) => trade.amount > 0).length;
        const negativeCount = trades.filter((trade) => trade.amount < 0).length;
        
        const largestGain = trades.length
          ? Math.max(...trades.map((trade) => trade.amount), 0)
          : 0;
          
        const largestLoss = trades.length
          ? Math.abs(Math.min(...trades.map((trade) => trade.amount), 0))
          : 0;
          
        const avgPerTrade = trades.length ? netGain / trades.length : 0;
        
        return {
          netGain,
          avgPerTrade,
          positiveCount,
          negativeCount,
          largestGain,
          largestLoss,
        };
      },
      
      getWeeklySummary: (weekId) => {
        const state = get();
        const week = state.weeks.find((w) => w.id === weekId);
        
        if (!week) {
          return {
            weekId: '',
            startDate: '',
            endDate: '',
            startValue: 0,
            endValue: 0,
            netGain: 0,
            tradeCount: 0,
            stats: {
              netGain: 0,
              avgPerTrade: 0,
              positiveCount: 0,
              negativeCount: 0,
              largestGain: 0,
              largestLoss: 0,
            },
            userSummaries: [],
          };
        }
        
        const stats = get().getTradeStats(weekId);
        const endValue = week.startValue + stats.netGain;
        
        // Calculate user summaries based on ratios
        const userSummaries: UserWeeklySummary[] = [];
        let totalRatio = 0;
        
        // Get all weekly ratios for this week
        const weeklyRatios = state.weeklyRatios.filter((r) => r.weekId === weekId);
        
        // For users without a specific weekly ratio, use their default ratio
        state.users.forEach((user) => {
          const weeklyRatio = weeklyRatios.find((r) => r.userId === user.id);
          const ratio = weeklyRatio ? weeklyRatio.ratio : user.defaultRatio;
          totalRatio += ratio;
          
          userSummaries.push({
            userId: user.id,
            userName: user.name,
            ratio,
            netGain: 0, // Calculated after total ratio is known
          });
        });
        
        // Calculate each user's share of the gain/loss
        if (totalRatio > 0) {
          userSummaries.forEach((summary, i) => {
            userSummaries[i] = {
              ...summary,
              netGain: (summary.ratio / totalRatio) * stats.netGain,
            };
          });
        }
        
        return {
          weekId: week.id,
          startDate: week.startDate,
          endDate: week.endDate,
          startValue: week.startValue,
          endValue,
          netGain: stats.netGain,
          tradeCount: week.trades.length,
          stats,
          userSummaries,
        };
      },
      
      getAllWeeklySummaries: () => {
        const state = get();
        return state.weeks.map((week) => get().getWeeklySummary(week.id));
      },
      
      exportData: () => {
        const state = get();
        return JSON.stringify({
          users: state.users,
          weeks: state.weeks,
          weeklyRatios: state.weeklyRatios,
        }, null, 2);
      },
      
      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          set({
            users: data.users || [],
            weeks: data.weeks || [],
            weeklyRatios: data.weeklyRatios || [],
            currentWeekId: data.weeks && data.weeks.length > 0 ? data.weeks[0].id : null,
          });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },
      
      resetData: () => set(initialState),
    }),
    {
      name: 'tradetrackr-storage',
    }
  )
); 