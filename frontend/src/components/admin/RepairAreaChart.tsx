"use client";

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface RepairAreaChartProps {
  data: Array<{ name: string; volume: number }>;
}

const RepairAreaChart = ({ data }: RepairAreaChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0b61a1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#0b61a1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#74777f', fontWeight: 600 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#74777f', fontWeight: 600 }}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="volume" 
          name="Tickets"
          stroke="#0b61a1" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorVolume)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RepairAreaChart;
