import React, { useEffect } from 'react';
import KPICards from '../components/KPICards';
import CampaignTable from '../components/CampaignTable';
import { useCampaignStore } from '../store/useCampaignStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const setCampaigns = useCampaignStore(state => state.setCampaigns);
  const calculateKPIs = useCampaignStore(state => state.calculateKPIs);

  // Mock initial data fetch
  useEffect(() => {
    const mockData = [
      { id: 1, title: 'Summer Sale 2026', status: 'ACTIVE', budget: 15000, spend: 12450, impressions: 450000, clicks: 12500, conversions: 850, roas: 3.2, createdAt: '2026-06-01' },
      { id: 2, title: 'Retargeting Alpha', status: 'ACTIVE', budget: 5000, spend: 4800, impressions: 120000, clicks: 5000, conversions: 400, roas: 4.5, createdAt: '2026-06-10' },
      { id: 3, title: 'Brand Awareness Q3', status: 'PAUSED', budget: 25000, spend: 25000, impressions: 1200000, clicks: 8000, conversions: 120, roas: 0.8, createdAt: '2026-05-15' },
    ];
    setCampaigns(mockData);
    calculateKPIs(mockData);
  }, []);

  const chartData = [
    { name: 'Mon', spend: 4000, revenue: 8400 },
    { name: 'Tue', spend: 3000, revenue: 7398 },
    { name: 'Wed', spend: 2000, revenue: 9800 },
    { name: 'Thu', spend: 2780, revenue: 3908 },
    { name: 'Fri', spend: 1890, revenue: 6800 },
    { name: 'Sat', spend: 2390, revenue: 3800 },
    { name: 'Sun', spend: 3490, revenue: 4300 },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard </h1>
          <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your campaigns today.</p>
        </div>
        
        {/* Date Range Picker Placeholder */}
        <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg p-2.5 dark:text-gray-200 shadow-sm">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Custom Range</option>
        </select>
      </div>

      <KPICards />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
        <h3 className="text-lg font-semibold mb-6 dark:text-white">Performance Trend (Last 7 Days)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb', borderRadius: '0.5rem' }}
                itemStyle={{ color: '#e5e7eb' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="spend" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CampaignTable />
    </div>
  );
}
