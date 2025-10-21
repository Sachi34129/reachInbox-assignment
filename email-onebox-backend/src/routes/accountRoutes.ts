// routes/accountRoutes.ts
import express from 'express';
import { esClient } from '../config/elasticsearch';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await esClient.search({
        index: 'emails',
        size: 0,
        aggs: {
          unique_accounts: {
            terms: { field: 'account', size: 100 }
          }
        }
      });

    const accounts = (response.aggregations?.unique_accounts as { buckets: { key: string }[] })?.buckets.map((b) => b.key) || [];

    res.json({ accounts });
  } catch (err) {
    console.error('❌ Error fetching accounts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;