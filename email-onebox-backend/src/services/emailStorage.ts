import { esClient } from '../config/elasticsearch';

const INDEX_NAME = 'emails';

// Initialize Elasticsearch index
export const initEmailIndex = async () => {
  const existsResponse = await esClient.indices.exists({ index: INDEX_NAME });

  if (!existsResponse) {
    await esClient.indices.create({
      index: INDEX_NAME,
      mappings: {
        properties: {
          subject: { type: 'text' },
          from: { type: 'keyword' },
          body: { type: 'text' },
          date: { type: 'date' },
          account: { type: 'keyword' },
          folder: { type: 'keyword' }, 
          category: { type: 'keyword' },
        },
      },
    });
    console.log('📦 Elasticsearch index created: emails');
  }
};

// Store email in Elasticsearch
export const saveEmail = async (email: {
  subject: string;
  from: string;
  body: string;
  date: string | Date;
  account: string;
  folder: string;
  category: string 
}) => {
  await esClient.index({
    index: INDEX_NAME,
    document: email,
    refresh: true
  });
};

// Search emails with advanced filtering, sorting, and pagination metadata
export const searchEmails = async (
  query?: string,
  account?: string,
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'date',
  order: string = 'desc',
  fromDate?: string,
  toDate?: string,
  folder?: string,
  category?: string
) => {
  const must: any[] = [];

  if (query) {
    must.push({
      multi_match: {
        query,
        fields: ['subject', 'body'],
      },
    });
  }

  if (account) {
    must.push({ term: { account } });
  }

  if (folder) {
    must.push({ term: { folder } });
  }

  if (category) {
    must.push({ term: { category } });
  }

  if (fromDate || toDate) {
    const range: any = {};
    if (fromDate) range.gte = fromDate;
    if (toDate) range.lte = toDate;
    must.push({ range: { date: range } });
  }

  const from = (page - 1) * limit;
  const sortOption: any = [{ [sortBy]: { order } }];

  // First query: get total count
  const countRes = await esClient.count({
    index: INDEX_NAME,
    query: must.length > 0 ? { bool: { must } } : { match_all: {} },
  });

  const totalCount = countRes.count;
  const totalPages = Math.ceil(totalCount / limit);

  // Second query: get paginated results
  const response = await esClient.search({
    index: INDEX_NAME,
    query: must.length > 0 ? { bool: { must } } : { match_all: {} },
    from,
    size: limit,
    sort: sortOption,
  });

  const results = response.hits.hits.map((hit: any) => hit._source);

  return {
    totalCount,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    results,
  };
};