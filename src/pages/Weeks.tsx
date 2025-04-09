import React, { useState, useEffect } from 'react';
import { Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../store';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import WeekForm from '../components/weeks/WeekForm';
import WeekCard from '../components/weeks/WeekCard';
import WeekDetailPanel from '../components/weeks/WeekDetailPanel';
import SeedDataButton from '../components/SeedDataButton';

const Weeks: React.FC = () => {
  const { weeks } = useAppStore();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  
  // Sort weeks by date (newest first)
  const sortedWeeks = [...weeks].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  
  // Update the useEffect to prioritize the current week from the app store
  useEffect(() => {
    if (weeks.length > 0 && !selectedWeekId) {
      const { currentWeekId } = useAppStore.getState();
      // Use the current week from the store if available, otherwise use the most recent
      if (currentWeekId && weeks.find(w => w.id === currentWeekId)) {
        setSelectedWeekId(currentWeekId);
      } else {
        setSelectedWeekId(sortedWeeks[0].id);
      }
    } else if (weeks.length === 0) {
      setSelectedWeekId(null);
    }
  }, [weeks, selectedWeekId, sortedWeeks]);
  
  const handleFormComplete = () => {
    setShowAddForm(false);
  };
  
  const handleWeekSelect = (weekId: string) => {
    setSelectedWeekId(weekId);
    // On mobile, clicking a week should hide the sidebar
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  };
  
  const handleWeekRemoved = () => {
    // If the currently selected week was removed, set selectedWeekId to null
    // useEffect will then select the most recent week
    setSelectedWeekId(null);
  };
  
  // Navigate to previous/next week
  const navigateToAdjacentWeek = (direction: 'prev' | 'next') => {
    if (!selectedWeekId || sortedWeeks.length <= 1) return;
    
    const currentIndex = sortedWeeks.findIndex(week => week.id === selectedWeekId);
    if (currentIndex === -1) return;
    
    if (direction === 'prev' && currentIndex < sortedWeeks.length - 1) {
      setSelectedWeekId(sortedWeeks[currentIndex + 1].id);
    } else if (direction === 'next' && currentIndex > 0) {
      setSelectedWeekId(sortedWeeks[currentIndex - 1].id);
    }
  };
  
  // Get current week index for mobile navigation
  const currentWeekIndex = selectedWeekId 
    ? sortedWeeks.findIndex(week => week.id === selectedWeekId) + 1 
    : 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Weeks</h1>
          <p className="text-white/70">
            View and manage all your trading weeks
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {!showAddForm && (
            <button 
              className="btn-primary flex items-center"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Week
            </button>
          )}
          
          {/* Toggle sidebar button on mobile */}
          {weeks.length > 0 && (
            <button 
              className="btn-secondary flex items-center lg:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? 'Hide Weeks' : 'Show All Weeks'}
            </button>
          )}
          
          {weeks.length === 0 && <SeedDataButton />}
        </div>
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
      
      {weeks.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile week navigation */}
          {!showSidebar && (
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <button
                className="p-2 rounded-full bg-tradeBg/30 text-white/70 hover:text-white hover:bg-tradeBg/50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => navigateToAdjacentWeek('prev')}
                disabled={currentWeekIndex >= sortedWeeks.length}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-white/80">
                Week {currentWeekIndex} of {sortedWeeks.length}
              </div>
              
              <button
                className="p-2 rounded-full bg-tradeBg/30 text-white/70 hover:text-white hover:bg-tradeBg/50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => navigateToAdjacentWeek('next')}
                disabled={currentWeekIndex <= 1}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          
          {/* Left sidebar - Week cards - Hidden on mobile by default */}
          <div className={`w-full lg:w-1/4 space-y-3 overflow-auto ${showSidebar ? 'block' : 'hidden lg:block'}`}>
            <h2 className="text-lg font-medium text-white mb-3">Trading Weeks</h2>
            {sortedWeeks.map((week) => (
              <WeekCard
                key={week.id}
                weekId={week.id}
                isSelected={week.id === selectedWeekId}
                onSelect={handleWeekSelect}
              />
            ))}
          </div>
          
          {/* Right panel - Week details - Full width on mobile */}
          <div className={`w-full lg:w-3/4 overflow-auto ${showSidebar ? 'hidden lg:block' : 'block'}`}>
            {selectedWeekId ? (
              <WeekDetailPanel 
                weekId={selectedWeekId} 
                onWeekRemoved={handleWeekRemoved}
              />
            ) : (
              <div className="text-center p-12 border border-dashed border-tradeLight/20 rounded-lg">
                <p className="text-white/70">Select a week to view details</p>
              </div>
            )}
          </div>
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