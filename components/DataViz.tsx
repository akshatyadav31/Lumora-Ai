import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { VisualizationConfig, DataPoint } from '../types';

interface DataVizProps {
  data: DataPoint[];
  config: VisualizationConfig;
}

const COLORS = ['#F59E0B', '#FBBF24', '#D97706', '#92400E', '#78350F'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-warm-900 border border-warm-700 p-3 rounded-lg shadow-xl">
        <p className="text-warm-100 font-medium mb-1">{label}</p>
        <p className="text-amber-400 font-mono">
          {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const DataViz: React.FC<DataVizProps> = ({ data, config }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[300px] mt-4 animate-fade-in">
      <h3 className="text-xs font-semibold text-warm-100 uppercase tracking-wider mb-4 opacity-70">
        {config.title}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        {config.type === 'bar' ? (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3D3834" vertical={false} />
            <XAxis 
              dataKey={config.xAxisKey} 
              tick={{ fill: '#A8A29E', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fill: '#A8A29E', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey={config.dataKey} fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : config.type === 'line' ? (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3D3834" vertical={false} />
            <XAxis 
              dataKey={config.xAxisKey} 
              tick={{ fill: '#A8A29E', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fill: '#A8A29E', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={config.dataKey} 
              stroke="#F59E0B" 
              strokeWidth={3}
              dot={{ fill: '#1A1816', stroke: '#F59E0B', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#FBBF24' }}
            />
          </LineChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={config.dataKey}
              nameKey={config.xAxisKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};