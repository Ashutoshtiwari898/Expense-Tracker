import React from 'react';
import { BarChart, Bar, Legend, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function BarChartDashboard({ budgetList }) {
  return (
    <div className='border rounded-lg p-5'>
        <h2 className='font-bold text-lg'>Activity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={budgetList} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" />
          <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartDashboard;
