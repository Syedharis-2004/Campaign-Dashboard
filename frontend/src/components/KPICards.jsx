import React from 'react';
import { useCampaignStore } from '../store/useCampaignStore';
import { Eye, MousePointerClick, TrendingUp, DollarSign, Activity, Percent } from 'lucide-react';

export default function KPICards() {
  const kpis = useCampaignStore((state) => state.kpis);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val);
  const formatPercent = (val) => val.toFixed(2) + '%';
  const formatROAS = (val) => val.toFixed(2) + 'x';

  const cards = [
    { title: 'Impressions', value: formatNumber(kpis.impressions), icon: <Eye size={24} className="text-blue-500" /> },
    { title: 'Clicks', value: formatNumber(kpis.clicks), icon: <MousePointerClick size={24} className="text-purple-500" /> },
    { title: 'CTR', value: formatPercent(kpis.ctr), icon: <Percent size={24} className="text-indigo-500" /> },
    { title: 'Conversions', value: formatNumber(kpis.conversions), icon: <Activity size={24} className="text-green-500" /> },
    { title: 'Spend', value: formatCurrency(kpis.spend), icon: <DollarSign size={24} className="text-red-500" /> },
    { title: 'ROAS', value: formatROAS(kpis.roas), icon: <TrendingUp size={24} className="text-yellow-500" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-start justify-between">
          <div className="flex w-full justify-between items-start mb-4">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{card.title}</h3>
            <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {card.icon}
            </div>
          </div>
          <p className="text-2xl font-bold dark:text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
