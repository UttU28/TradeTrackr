import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useAppStore } from '../../store';
import { WeekFormData, Week } from '../../types';
import { getCurrentWeekRange } from '../../utils';

interface WeekFormProps {
  week?: Week;
  onComplete?: (weekId: string) => void;
}

const WeekForm: React.FC<WeekFormProps> = ({ week, onComplete }) => {
  const { addWeek, updateWeek } = useAppStore();
  
  const currentWeekRange = getCurrentWeekRange();
  
  const [startDate, setStartDate] = useState<string>(
    week?.startDate || currentWeekRange.startDate
  );
  const [endDate, setEndDate] = useState<string>(
    week?.endDate || currentWeekRange.endDate
  );
  const [startValue, setStartValue] = useState<string>(
    week?.startValue.toString() || '0'
  );
  
  const isEditing = !!week;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !startValue) return;
    
    const weekData: WeekFormData = {
      startDate,
      endDate,
      startValue: parseFloat(startValue),
    };
    
    let weekId;
    
    if (isEditing && week) {
      updateWeek(week.id, weekData);
      weekId = week.id;
    } else {
      weekId = addWeek(weekData);
    }
    
    if (onComplete) {
      onComplete(weekId);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-white/80 mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-white/80 mb-1">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="startValue" className="block text-sm font-medium text-white/80 mb-1">
          Starting Account Value
        </label>
        <input
          id="startValue"
          type="number"
          step="0.01"
          value={startValue}
          onChange={(e) => setStartValue(e.target.value)}
          className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
          placeholder="0.00"
          required
        />
        <p className="text-xs text-white/60 mt-1">
          The initial account value at the beginning of this week.
        </p>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center"
          disabled={!startDate || !endDate || !startValue}
        >
          <Calendar className="w-5 h-5 mr-2" />
          {isEditing ? 'Update Week' : 'Add Week'}
        </button>
      </div>
    </form>
  );
};

export default WeekForm; 