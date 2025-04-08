import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../utils';

interface ChartDataPoint {
  id: string;
  name: string;
  amount: number;
  description: string;
  timestamp: string;
  runningTotal: number;
}

interface TradeDetailChartProps {
  weekId: string;
  height?: number;
}

const TradeDetailChart: React.FC<TradeDetailChartProps> = ({ weekId, height = 300 }) => {
  const { weeks } = useAppStore();
  const week = weeks.find((w) => w.id === weekId);
  
  if (!week || week.trades.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-tradeLight/20 rounded-lg">
        <p className="text-white/70">No trades available for chart</p>
      </div>
    );
  }
  
  // Sort trades by timestamp (oldest first for chronological display)
  const sortedTrades = [...week.trades].sort((a, b) => a.timestamp - b.timestamp);
  
  // Format data for chart
  const chartData = sortedTrades.map((trade, index) => ({
    id: trade.id,
    name: `Trade ${index + 1}`,
    amount: trade.amount,
    description: trade.description,
    timestamp: new Date(trade.timestamp).toLocaleString(),
  }));
  
  // Calculate cumulative values for a running total line
  let runningTotal = 0;
  const chartDataWithTotal = chartData.map(data => {
    runningTotal += data.amount;
    return {
      ...data,
      runningTotal
    };
  });
  
  // Custom tooltip that shows trade details
  const CustomTooltip = ({ active, payload }: { 
    active?: boolean; 
    payload?: Array<{ payload: ChartDataPoint }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-tradeDark p-4 border border-tradeLight/30 rounded-lg shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <p className="text-white/70">{data.description}</p>
          <p className="text-white/70 text-sm">{data.timestamp}</p>
          <p className={`font-bold ${data.amount >= 0 ? 'text-green-400' : 'text-tradeError'}`}>
            {formatCurrency(data.amount)}
          </p>
          <p className="text-white/70 mt-2 pt-2 border-t border-tradeLight/30">
            Running Total: {formatCurrency(data.runningTotal)}
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart
          data={chartDataWithTotal}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: 'white' }}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.5)" />
          <Bar 
            dataKey="amount" 
            name="Trade Amount" 
            radius={[4, 4, 0, 0]}
          >
            {chartDataWithTotal.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.amount >= 0 ? '#4CAF50' : '#FF5252'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center text-xs text-white/50">
        Individual trade performance showing profit/loss per trade
      </div>
    </div>
  );
};

export default TradeDetailChart; 