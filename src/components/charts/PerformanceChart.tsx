import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useAppStore } from '../../store';
import { generateChartData, formatCurrency } from '../../utils';

interface PerformanceChartProps {
  height?: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ height = 300 }) => {
  const { getAllWeeklySummaries } = useAppStore();
  const summaries = getAllWeeklySummaries();
  
  if (summaries.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-tradeLight/20 rounded-lg">
        <p className="text-white/70">No data available for chart</p>
      </div>
    );
  }
  
  const chartData = generateChartData(summaries);
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="week" 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} 
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#071E22', 
              border: '1px solid rgba(103, 146, 137, 0.3)',
              borderRadius: '8px',
              color: 'white' 
            }}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend 
            wrapperStyle={{ color: 'white' }}
          />
          <Bar
            yAxisId="left"
            dataKey="weekGain"
            fill="#679289"
            name="Weekly Gain/Loss"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="cumulativeGain"
            stroke="#F4C095"
            strokeWidth={2}
            name="Cumulative Gain/Loss"
            dot={{ fill: '#F4C095', r: 4 }}
            activeDot={{ r: 6, fill: '#F4C095' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart; 