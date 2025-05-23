import React from 'react';
import { Card, Title } from '@tremor/react';
import AnimatedLineChart from './AnimatedLineChart';

const DemoChart: React.FC = () => {
  // Generate dummy data for the last 7 days
  const dummyData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      x: date.toLocaleDateString('en-US', { weekday: 'short' }),
      y: Math.random() * 1000 + 500 // Random value between 500 and 1500
    };
  });

  return (
    <Card className="shadow-lg border border-gray-700/50 bg-gradient-to-br from-slate-900 to-slate-800">
      <Title className="text-cyan-300">Weekly Expenses Overview</Title>
      <div className="h-[400px] mt-6">
        <AnimatedLineChart
          data={dummyData}
          width={800}
          height={350}
          color="#6C5CE7"
        />
      </div>
    </Card>
  );
};

export default DemoChart; 