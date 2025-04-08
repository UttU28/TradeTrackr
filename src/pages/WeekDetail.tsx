import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ArrowLeft, Plus, UserPlus, BarChart } from 'lucide-react';
import { useAppStore } from '../store';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import TradeForm from '../components/trades/TradeForm';
import TradeList from '../components/trades/TradeList';
import WeekForm from '../components/weeks/WeekForm';
import WeeklySummaryCard from '../components/weeks/WeeklySummaryCard';
import TradeDetailChart from '../components/charts/TradeDetailChart';
import { formatCurrency, formatDate } from '../utils';

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

const WeekDetail: React.FC = () => {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  const { weeks, removeWeek, setCurrentWeek } = useAppStore();
  
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [showAddTradeForm, setShowAddTradeForm] = useState<boolean>(false);
  const [showRatioForm, setShowRatioForm] = useState<boolean>(false);
  
  if (!weekId) {
    return <div>Week ID is required</div>;
  }
  
  const week = weeks.find((w) => w.id === weekId);
  
  if (!week) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Week Not Found</h1>
        <p className="text-white/70 mb-6">The week you're looking for doesn't exist or has been deleted.</p>
        <button 
          className="btn-primary"
          onClick={() => navigate('/weeks')}
        >
          Back to Weeks
        </button>
      </div>
    );
  }
  
  const handleRemoveWeek = () => {
    if (window.confirm('Are you sure you want to delete this week and all its trades?')) {
      removeWeek(weekId);
      navigate('/weeks');
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-2">
        <button
          className="text-white/70 hover:text-white flex items-center mr-3"
          onClick={() => navigate('/weeks')}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-white">
          Week of {formatDate(week.startDate)}
        </h1>
      </div>
      
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div className="mr-4 mb-4">
          <p className="text-white/70">
            {formatDate(week.startDate)} - {formatDate(week.endDate)}
          </p>
          <p className="text-white/70">
            Starting Value: {formatCurrency(week.startValue)}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className="btn-secondary flex items-center"
            onClick={() => setShowRatioForm(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Adjust Ratios
          </button>
          
          <button
            className="btn-secondary flex items-center"
            onClick={() => setShowEditForm(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Week
          </button>
          
          <button
            className="btn-secondary flex items-center text-tradeError"
            onClick={handleRemoveWeek}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
          
          <button
            className="btn-primary flex items-center"
            onClick={handleSetAsCurrentWeek}
          >
            Set as Current
          </button>
        </div>
      </div>
      
      {showEditForm ? (
        <div className="mb-8">
          <Card>
            <CardHeader title="Edit Week" />
            <CardContent>
              <WeekForm week={week} onComplete={handleEditComplete} />
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {showRatioForm ? (
        <div className="mb-8">
          <Card>
            <CardHeader 
              title="Adjust Sharing Ratios" 
              description="Set custom ratios for participants for this week"
            />
            <CardContent>
              <WeekRatioForm weekId={weekId} onComplete={handleRatioFormComplete} />
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      <div className="mb-8">
        <Card>
          <CardHeader 
            title="Trade Performance Chart" 
            description="Visual representation of trade performance"
            icon={<BarChart className="w-5 h-5 text-white" />}
          />
          <CardContent>
            <TradeDetailChart weekId={weekId} height={400} />
          </CardContent>
          <CardFooter className="text-xs text-white/50 italic">
            Chart shows individual trades with positive values (green) and negative values (red), chronologically ordered by trade date.
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <WeeklySummaryCard weekId={weekId} showViewButton={false} />
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader 
              title="Trades" 
              description="All trades recorded for this week"
            />
            <CardContent>
              {showAddTradeForm ? (
                <TradeForm weekId={weekId} onComplete={handleTradeFormComplete} />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button 
                      className="btn-primary flex items-center"
                      onClick={() => setShowAddTradeForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Trade
                    </button>
                  </div>
                  <TradeList weekId={weekId} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeekDetail; 