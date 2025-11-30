import React from 'react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface VelocityChartProps {
  data: { day: string; xp: number }[];
  color?: string;
}

const VelocityChart: React.FC<VelocityChartProps> = ({ data, color = "#2563eb" }) => {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#64748b' }} 
            dy={10}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
          />
          <Line 
            type="monotone" 
            dataKey="xp" 
            stroke={color} 
            strokeWidth={3} 
            dot={{ fill: color, strokeWidth: 2, r: 4, stroke: '#fff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VelocityChart;