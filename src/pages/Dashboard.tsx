import React, { useState } from 'react';
import { Plus, BarChart4 } from 'lucide-react';
import { useAppStore } from '../store';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import PerformanceChart from '../components/charts/PerformanceChart';
import StatsCard from '../components/dashboard/StatsCard';
import WeeklySummaryCard from '../components/weeks/WeeklySummaryCard';
import WeekForm from '../components/weeks/WeekForm';
import TradeForm from '../components/trades/TradeForm';
import SeedDataButton from '../components/SeedDataButton';

const Dashboard: React.FC = () => {
  const { weeks, getCurrentWeek } = useAppStore();
  const currentWeek = getCurrentWeek();
  
  const [showWeekForm, setShowWeekForm] = useState<boolean>(false);
  const [showTradeForm, setShowTradeForm] = useState<boolean>(false);
  
  const recentWeeks = [...weeks]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);
  
  const handleWeekFormComplete = () => {
    setShowWeekForm(false);
  };
  
  const handleTradeFormComplete = () => {
    setShowTradeForm(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/70">
            Track your trading performance and manage your investments
          </p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button 
            className="btn-secondary flex items-center"
            onClick={() => setShowWeekForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Week
          </button>
          {weeks.length > 0 && (
            <button 
              className="btn-primary flex items-center"
              onClick={() => setShowTradeForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Trade
            </button>
          )}
        </div>
      </div>
      
      {showWeekForm && (
        <div className="mb-8">
          <Card>
            <CardHeader 
              title="Add New Week" 
              description="Create a new trading week to track your trades"
            />
            <CardContent>
              <WeekForm onComplete={handleWeekFormComplete} />
            </CardContent>
          </Card>
        </div>
      )}
      
      {showTradeForm && (
        <div className="mb-8">
          <Card>
            <CardHeader 
              title="Add New Trade" 
              description="Record a new trade transaction"
            />
            <CardContent>
              <TradeForm onComplete={handleTradeFormComplete} />
            </CardContent>
          </Card>
        </div>
      )}
      
      {weeks.length > 0 ? (
        <>
          <div className="mb-8">
            <Card>
              <CardHeader 
                title="Performance Chart" 
                icon={<BarChart4 className="w-5 h-5 text-white" />}
              />
              <CardContent>
                <PerformanceChart height={350} />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-1">
              <StatsCard />
            </div>
            
            <div className="md:col-span-2">
              {currentWeek && (
                <Card>
                  <CardHeader 
                    title="Current Week"
                    description="Your active trading week"
                  />
                  <CardContent>
                    <WeeklySummaryCard weekId={currentWeek.id} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {recentWeeks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Recent Weeks</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentWeeks.map((week) => (
                  <WeeklySummaryCard key={week.id} weekId={week.id} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 px-6 border border-dashed border-tradeLight/20 rounded-lg">
          <h3 className="text-xl font-medium text-white mb-3">Welcome to TradeTrackr</h3>
          <p className="text-white/70 mb-6">
            Get started by adding a week to begin tracking your trades
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              className="btn-primary inline-flex items-center justify-center"
              onClick={() => setShowWeekForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Week
            </button>
            <SeedDataButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 