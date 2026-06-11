import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL   = process.env.SUPABASE_URL          ?? '';
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_KEY  ?? '';
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CULTURE_FILES: Record<string, string> = {
  igbo:   '../data/cultures/igbo.md',
  yoruba: '../data/cultures/yoruba.md',
  // hausa: '../data/cultures/hausa.md',
};

function chunkText(text: string, chunkSize = 500, overlap = 100): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end).trim());
    start += chunkSize - overlap;
  }
  return chunks.filter(c => c.length > 50);
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-2',
        content: { parts: [{ text }] },
      }),
    }
  );
  const data = await response.json() as any;
  if (data?.error) throw new Error(`Embedding error: ${data.error.message}`);
  return data.embedding.values;
}

async function seed() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
    console.error('Missing env vars. Check your .env file has:');
    console.error('  SUPABASE_URL');
    console.error('  SUPABASE_SERVICE_KEY');
    console.error('  EXPO_PUBLIC_GEMINI_API_KEY');
    process.exit(1);
  }

  const { error: deleteError } = await supabase
    .from('culture_embeddings')
    .delete()
    .neq('id', 0);

  if (deleteError) {
    console.error('Failed to clear embeddings:', deleteError.message);
    process.exit(1);
  }
  console.log(' Cleared existing embeddings\n');

  for (const [tribe, filePath] of Object.entries(CULTURE_FILES)) {
    const fullPath = path.resolve(__dirname, filePath);

    if (!fs.existsSync(fullPath)) {
      console.warn(` File not found, skipping: ${fullPath}`);
      continue;
    }

    const text   = fs.readFileSync(fullPath, 'utf-8');
    const chunks = chunkText(text);
    console.log(`${tribe.toUpperCase()}: ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      try {
        const embedding = await getEmbedding(chunk);

        // Log dimensions on first chunk only — remove after confirming
        if (i === 0) console.log(`Embedding dimensions: ${embedding.length}`);

        const { error } = await supabase.from('culture_embeddings').insert({
          tribe,
          content: chunk,
          embedding,
        });

        if (error) {
          console.error(`chunk ${i + 1}/${chunks.length}:`, error.message);
        } else {
          console.log(` chunk ${i + 1}/${chunks.length}`);
        }
      } catch (err: any) {
        console.error(`chunk ${i + 1}/${chunks.length}:`, err.message);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    console.log('');
  }

  console.log('Done seeding embeddings!');
}

seed().catch(console.error);