import fs from 'fs';
import path from 'path';
import { cosineSimilarity } from './utils';

export interface KnowledgeItem {
  text: string;
  embedding: number[];
}

let knowledge: KnowledgeItem[] = [];

// Load knowledge from JSON
export function loadKnowledgeBase() {
  const filePath = path.resolve(__dirname, '../vector_db.json');
  if (fs.existsSync(filePath)) {
    knowledge = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } else {
    knowledge = [];
  }
}

// Save knowledge to JSON
export function saveKnowledgeBase() {
  const filePath = path.resolve(__dirname, '../vector_db.json');
  fs.writeFileSync(filePath, JSON.stringify(knowledge, null, 2));
}

// Retrieve the most relevant context using cosine similarity
export function getRelevantContext(emailEmbedding: number[]): string {
  if (!knowledge.length) return '';
  let bestScore = -1;
  let bestText = '';

  for (const item of knowledge) {
    const score = cosineSimilarity(emailEmbedding, item.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestText = item.text;
    }
  }

  return bestText;
}

// Add a new knowledge item
export function addKnowledgeItem(text: string, embedding: number[]) {
  knowledge.push({ text, embedding });
  saveKnowledgeBase();
}