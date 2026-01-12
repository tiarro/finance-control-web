'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  [key: string]: any; // Index signature to make it compatible with Recharts
}

interface DonutChartProps {
  data: ExpenseCategory[];
  onSliceClick?: (category: ExpenseCategory) => void;
  className?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, onSliceClick, className = '' }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
  };

  const handleClick = (entry: any, index: number) => {
    setActiveIndex(index);
    if (onSliceClick && data[index]) {
      onSliceClick(data[index]);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={handlePieEnter}
            onMouseLeave={handlePieLeave}
            onClick={handleClick}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#fff"
                strokeWidth={1}
                opacity={activeIndex === index ? 0.8 : 1}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Jumlah']}
            labelFormatter={(name) => `Kategori: ${name}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;