import express from 'express';
import { searchEmails } from '../services/emailStorage';

const router = express.Router();

/**
 * GET /emails/search
 * Query Params:
 * - q: keyword (optional)
 * - account: filter by account (optional)
 * - folder: filter by folder (Inbox, Sent, Drafts, etc.)
 * - page: page number (default 1)
 * - limit: results per page (default 20)
 * - sortBy: field to sort by (default "date")
 * - order: asc|desc (default "desc")
 * - fromDate: filter start date
 * - toDate: filter end date
 */
router.get('/search', async (req, res) => {
  try {
    const { q, account, folder, page, limit, sortBy, order, fromDate, toDate, category } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;

    const results = await searchEmails(
      q as string | undefined,
      account as string | undefined,
      pageNum,
      limitNum,
      (sortBy as string) || 'date',
      (order as string) || 'desc',
      fromDate as string | undefined,
      toDate as string | undefined,
      folder as string | undefined,
      category as string | undefined
    );

    res.json(results);
  } catch (err) {
    console.error('❌ Error searching emails:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;