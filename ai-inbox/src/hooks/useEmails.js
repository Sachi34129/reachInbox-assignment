import { useState, useEffect } from 'react';
import axios from 'axios';

export function useEmails(account, page = 1, limit = 15, query = '', sortBy = 'date', order = 'desc') {
    const [emails, setEmails] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchEmails() {
        setLoading(true);
        try {
          const res = await axios.get('http://localhost:5000/emails/search', {
            params: {
              q: query,
              account,
              page,
              limit,
              sortBy,
              order,
            },
          });
          setEmails(res.data.results || []);
          setPagination({
            total: res.data.totalCount,
            totalPages: res.data.totalPages,
            hasNext: res.data.hasNext,
            hasPrev: res.data.hasPrev,
          });
        } catch (err) {
          console.error('Failed to fetch emails:', err);
        } finally {
          setLoading(false);
        }
      }
  
      if (account) fetchEmails();
    }, [account, page, query, sortBy, order]);
  
    return { emails, pagination, loading };
  }