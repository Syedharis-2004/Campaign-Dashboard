-- Speed Task 3: Top 5 campaigns by ROAS per client (last 30 days)

WITH RankedCampaigns AS (
    SELECT 
        c.id as campaign_id,
        c.title,
        c.roas,
        c.clientId,
        ROW_NUMBER() OVER(PARTITION BY c.clientId ORDER BY c.roas DESC) as rank
    FROM "Campaign" c
    WHERE c.createdAt >= CURRENT_DATE - INTERVAL '30 days'
      AND c.deletedAt IS NULL
)
SELECT * 
FROM RankedCampaigns 
WHERE rank <= 5;
