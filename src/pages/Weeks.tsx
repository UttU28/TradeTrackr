import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { useAppStore } from '../store';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import WeekForm from '../components/weeks/WeekForm';
import WeeklySummaryCard from '../components/weeks/WeeklySummaryCard';
import SeedDataButton from '../components/SeedDataButton';

const Weeks: React.FC = () => {
  const { weeks } = useAppStore();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  const handleFormComplete = () => {
    setShowAddForm(false);
  };
  
  // Sort weeks by date (newest first)
  const sortedWeeks = [...weeks].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Weeks</h1>
          <p className="text-white/70">
            View and manage all your trading weeks
          </p>
        </div>
        
        {!showAddForm && (
          <button 
            className="btn-primary flex items-center mt-4 md:mt-0"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Week
          </button>
        )}
      </div>
      
      {showAddForm ? (
        <div className="mb-8">
          <Card>
            <CardHeader 
              title="Add New Week" 
              description="Create a new trading week to track your trades"
              icon={<Calendar className="w-5 h-5 text-white" />}
            />
            <CardContent>
              <WeekForm onComplete={handleFormComplete} />
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      {sortedWeeks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWeeks.map((week) => (
            <WeeklySummaryCard key={week.id} weekId={week.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 border border-dashed border-tradeLight/20 rounded-lg">
          <h3 className="text-xl font-medium text-white mb-3">No Trading Weeks Found</h3>
          <p className="text-white/70 mb-6">
            Get started by adding your first trading week
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              className="btn-primary inline-flex items-center justify-center"
              onClick={() => setShowAddForm(true)}
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

export default Weeks; 