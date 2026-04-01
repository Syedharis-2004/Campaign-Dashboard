import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useCampaignStore } from '../store/useCampaignStore';

export default function CampaignTable() {
  const campaigns = useCampaignStore((state) => state.campaigns);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const filteredCampaigns = campaigns.filter(c => filterStatus === 'ALL' || c.status === filterStatus);
  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white dark:bg-gray-800 pb-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold dark:text-white">Active Campaigns</h3>
        <select 
          className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm rounded-lg p-2 dark:text-gray-200"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400">
            <tr>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('title')}>
                <div className="flex items-center space-x-1"><span>Campaign</span><ArrowUpDown size={14}/></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center space-x-1"><span>Status</span><ArrowUpDown size={14}/></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('budget')}>
                 <div className="flex items-center space-x-1"><span>Budget</span><ArrowUpDown size={14}/></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('spend')}>
                 <div className="flex items-center space-x-1"><span>Spend</span><ArrowUpDown size={14}/></div>
              </th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => handleSort('roas')}>
                 <div className="flex items-center space-x-1"><span>ROAS</span><ArrowUpDown size={14}/></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{campaign.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4">${campaign.budget.toLocaleString()}</td>
                <td className="px-6 py-4">${campaign.spend.toLocaleString()}</td>
                <td className="px-6 py-4 font-medium">{campaign.roas.toFixed(2)}x</td>
              </tr>
            ))}
            {sortedCampaigns.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No campaigns found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
