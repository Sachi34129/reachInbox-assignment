import { Client } from '@elastic/elasticsearch';

export const esClient = new Client({
  node: 'http://localhost:9200', 
  auth: {
    username: 'elastic',
    password: 'JQ6Pl_0AnAUIPH_mm8NO',
  },
});