import React, { useState } from 'react';
import { Edit2, Trash2, Plus, UserPlus, BarChart, X } from 'lucide-react';
import { useAppStore } from '../../store';
import Card, { CardHeader, CardContent, CardFooter } from '../ui/Card';
import TradeForm from '../trades/TradeForm';
import TradeList from '../trades/TradeList';
import WeekForm from './WeekForm';
import WeeklySummaryCard from './WeeklySummaryCard';
import TradeDetailChart from '../charts/TradeDetailChart';
import { formatCurrency, formatDate, formatDateRange } from '../../utils';

interface WeekDetailPanelProps {
  weekId: string;
  onWeekRemoved: () => void;
}

const WeekDetailPanel: React.FC<WeekDetailPanelProps> = ({ weekId, onWeekRemoved }) => {
  const { weeks, removeWeek, setCurrentWeek } = useAppStore();
  
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showAddTradeForm, setShowAddTradeForm] = useState<boolean>(false);
  const [showRatioForm, setShowRatioForm] = useState<boolean>(false);
  
  const week = weeks.find((w) => w.id === weekId);
  
  if (!week) {
    return (
      <div className="text-center p-8">
        <p className="text-white/70">Select a week to view details</p>
      </div>
    );
  }
  
  const handleRemoveWeek = () => {
    if (window.confirm('Are you sure you want to delete this week and all its trades?')) {
      removeWeek(weekId);
      onWeekRemoved();
    }
  };
  
  const handleSetAsCurrentWeek = () => {
    setCurrentWeek(weekId);
  };
  
  const handleEditComplete = () => {
    setShowEditForm(false);
  };
  
  const handleTradeFormComplete = () => {
    setShowAddTradeForm(false);
  };
  
  const handleRatioFormComplete = () => {
    setShowRatioForm(false);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Week of {formatDate(week.startDate)}
          </h1>
          <p className="text-white/70">
            {formatDateRange(week.startDate, week.endDate)}
          </p>
          <p className="text-white/70">
            Starting Value: {formatCurrency(week.startValue)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <button
            className="btn-secondary flex items-center text-sm"
            onClick={() => setShowRatioForm(true)}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            <span className="md:inline">Adjust Ratios</span>
          </button>
          
          <button
            className="btn-secondary flex items-center text-sm"
            onClick={() => setShowEditForm(true)}
          >
            <Edit2 className="w-4 h-4 mr-1" />
            <span className="md:inline">Edit</span>
          </button>
          
          <button
            className="btn-secondary flex items-center text-sm text-tradeError"
            onClick={handleRemoveWeek}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="md:inline">Delete</span>
          </button>
          
          <button
            className="btn-primary flex items-center text-sm"
            onClick={handleSetAsCurrentWeek}
          >
            <span>Set as Current</span>
          </button>
        </div>
      </div>
      
      {showEditForm ? (
        <div className="mb-6">
          <Card>
            <CardHeader 
              title="Edit Week" 
              action={
                <button
                  onClick={() => setShowEditForm(false)}
                  className="p-1 rounded-full hover:bg-tradeBg/50 text-white/70 hover:text-white transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5" />
                </button>
              }
            />
            <CardContent>
              <WeekForm week={week} onComplete={handleEditComplete} />
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {showRatioForm ? (
        <div className="mb-6">
          <Card>
            <CardHeader 
              title="Adjust Sharing Ratios" 
              description="Set custom ratios for participants for this week"
              action={
                <button
                  onClick={() => setShowRatioForm(false)}
                  className="p-1 rounded-full hover:bg-tradeBg/50 text-white/70 hover:text-white transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5" />
                </button>
              }
            />
            <CardContent>
              <WeekRatioForm weekId={weekId} onComplete={handleRatioFormComplete} />
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      <div className="mb-6">
        <Card>
          <CardHeader 
            title="Trade Performance Chart" 
            description="Visual representation of trade performance"
            icon={<BarChart className="w-5 h-5 text-white" />}
          />
          <CardContent>
            <TradeDetailChart weekId={weekId} height={350} />
          </CardContent>
          <CardFooter className="text-xs text-white/50 italic">
            Chart shows individual trades with positive values (green) and negative values (red), chronologically ordered.
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <WeeklySummaryCard weekId={weekId} />
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader 
              title="Trades" 
              description="All trades recorded for this week"
              action={showAddTradeForm ? (
                <button
                  onClick={() => setShowAddTradeForm(false)}
                  className="p-1 rounded-full hover:bg-tradeBg/50 text-white/70 hover:text-white transition-colors"
                  aria-label="Close trade form"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : undefined}
            />
            <CardContent>
              <div className="space-y-4">
                {showAddTradeForm ? (
                  <div className="mb-4 bg-tradeBg/40 p-4 rounded-lg border border-tradeLight/20">
                    <TradeForm 
                      weekId={weekId} 
                      onComplete={handleTradeFormComplete} 
                    />
                  </div>
                ) : (
                  <div className="flex justify-end mb-4">
                    <button 
                      className="btn-primary flex items-center"
                      onClick={() => setShowAddTradeForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Trade
                    </button>
                  </div>
                )}
                
                <TradeList weekId={weekId} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Copy of the WeekRatioForm from the WeekDetail page
interface WeekRatioFormProps {
  weekId: string;
  onComplete: () => void;
}

const WeekRatioForm: React.FC<WeekRatioFormProps> = ({ weekId, onComplete }) => {
  const { users, weeklyRatios, setWeeklyRatio } = useAppStore();
  const [ratios, setRatios] = useState<Record<string, string>>(() => {
    const initialRatios: Record<string, string> = {};
    
    users.forEach((user) => {
      // Check if there's a specific ratio for this week and user
      const weeklyRatio = weeklyRatios.find(
        (r) => r.weekId === weekId && r.userId === user.id
      );
      
      initialRatios[user.id] = weeklyRatio 
        ? weeklyRatio.ratio.toString()
        : user.defaultRatio.toString();
    });
    
    return initialRatios;
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    Object.entries(ratios).forEach(([userId, ratioString]) => {
      const ratio = parseFloat(ratioString);
      setWeeklyRatio(weekId, userId, ratio);
    });
    
    onComplete();
  };
  
  if (users.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-white/70 mb-3">No participants found</p>
        <a href="/users" className="btn-secondary inline-flex items-center">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Participants
        </a>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-white/70 mb-3">
        Adjust the sharing ratios for this specific week. These will override the default ratios.
      </p>
      
      {users.map((user) => (
        <div key={user.id} className="flex items-center space-x-3 bg-tradeBg/30 p-3 rounded-lg">
          <div className="flex-1">
            <div className="text-white">{user.name}</div>
            <div className="text-xs text-white/50">Default ratio: {user.defaultRatio}</div>
          </div>
          <div className="w-24">
            <input
              type="number"
              min="0"
              step="0.1"
              value={ratios[user.id] || '0'}
              onChange={(e) => setRatios({ ...ratios, [user.id]: e.target.value })}
              className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
              required
            />
          </div>
        </div>
      ))}
      
      <div className="pt-2 flex space-x-3">
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={onComplete}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex-1"
        >
          Save Ratios
        </button>
      </div>
    </form>
  );
};

export default WeekDetailPanel; 