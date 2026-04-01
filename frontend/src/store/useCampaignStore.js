import { create } from 'zustand';

export const useCampaignStore = create((set) => ({
  campaigns: [],
  kpis: {
    impressions: 0,
    clicks: 0,
    ctr: 0,
    conversions: 0,
    spend: 0,
    roas: 0
  },
  isLoading: false,
  error: null,
  
  setCampaigns: (campaigns) => set({ campaigns }),
  
  // Calculate KPIs based on current dataset
  calculateKPIs: (campaignsList) => {
    let impressions = 0, clicks = 0, conversions = 0, spend = 0, revenue = 0;
    
    // Fallback if the payload is empty
    if (!campaignsList || campaignsList.length === 0) {
      set({ kpis: { impressions: 0, clicks: 0, ctr: 0, conversions: 0, spend: 0, roas: 0 } });
      return;
    }

    campaignsList.forEach(c => {
      impressions += c.impressions || 0;
      clicks += c.clicks || 0;
      conversions += c.conversions || 0;
      spend += c.spend || 0;
      revenue += (c.roas || 0) * (c.spend || 0); // Reverse engineer revenue from ROAS * spend
    });

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const roas = spend > 0 ? (revenue / spend) : 0;

    set({ kpis: { impressions, clicks, ctr, conversions, spend, roas } });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
