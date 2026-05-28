import * as fs   from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://ypoumpucjsauimirpoil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwb3VtcHVjanNhdWltaXJwb2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjMwOTcsImV4cCI6MjA5NDgzOTA5N30.LyF2elLk8cnBsGDA_Y0LLaB8weOJC7Vn-4sISO6FufQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CULTURES_DIR = path.join(__dirname, '..', 'app', 'data', 'cultures');

interface CultureContent {
  culture:    string;
  category:   string;
  title:      string;
  subtitle?:  string;
  content:    string;
  sort_order: number;
}

interface FoodItem {
  culture:      string;
  name:         string;
  native_name?: string;
  category?:    string;
  ingredients:  string[];
  steps:        string[];
  sort_order:   number;
}

interface Proverb {
  culture:      string;
  native_text:  string;
  translation:  string;
  meaning?:     string;
  explanation?: string;
}

function tribeFromFilename(filename: string): string {
  const base = path.basename(filename, '.md');
  return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
}

function splitByH1(md: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = md.split('\n');
  let current = '';
  let body: string[] = [];

  for (const line of lines) {
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      if (current) sections[current] = body.join('\n').trim();
      current = line.replace(/^# /, '').trim();
      body    = [];
    } else {
      body.push(line);
    }
  }
  if (current) sections[current] = body.join('\n').trim();
  return sections;
}

function splitByH2(md: string): { title: string; body: string }[] {
  const results: { title: string; body: string }[] = [];
  const lines = md.split('\n');
  let current = '';
  let body: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) results.push({ title: current, body: body.join('\n').trim() });
      current = line.replace(/^## /, '').trim();
      body    = [];
    } else {
      body.push(line);
    }
  }
  if (current) results.push({ title: current, body: body.join('\n').trim() });
  return results;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g,     '$1')
    .replace(/_(.*?)_/g,       '$1')
    .replace(/`(.*?)`/g,       '$1')
    .replace(/#+\s/g,          '')
    .replace(/^\s*[-*]\s/gm,   '')
    .trim();
}

function extractBullets(text: string): string[] {
  return text
    .split('\n')
    .filter((l) => /^\s*[-*\d]/.test(l))
    .map((l) => l.replace(/^\s*[-*\d.]+\s*/, '').trim())
    .filter(Boolean);
}

function parseCultureContent(
  culture:  string,
  category: string,
  md:       string,
): CultureContent[] {
  const rows: CultureContent[] = [];
  const subsections = splitByH2(md);

  if (subsections.length === 0) {
    rows.push({
      culture,
      category,
      title:      category.charAt(0).toUpperCase() + category.slice(1),
      content:    stripMarkdown(md),
      sort_order: 0,
    });
    return rows;
  }

  subsections.forEach(({ title, body }, index) => {
    rows.push({
      culture,
      category,
      title:      stripMarkdown(title),
      content:    stripMarkdown(body),
      sort_order: index,
    });
  });

  return rows;
}

function parseFoodItems(culture: string, md: string): FoodItem[] {
  const items: FoodItem[] = [];
  const subsections = splitByH2(md);

  subsections.forEach(({ title, body }, index) => {
    const nativeMatch   = body.match(/\*\*(?:Igbo Name|Native Name|Local Name)[:\*\*]+\*?\*?\s*(.+)/i);
    const categoryMatch = body.match(/\*\*Category[:\*\*]+\*?\*?\s*(.+)/i);

    const ingredientsMatch = body.match(/###\s*Ingredients\s*([\s\S]*?)(?=###|$)/i);
    const stepsMatch       = body.match(/###\s*Preparation\s*([\s\S]*?)(?=###|$)/i);

    const ingredients = ingredientsMatch ? extractBullets(ingredientsMatch[1]) : [];
    const steps = stepsMatch
      ? stepsMatch[1]
          .split('\n')
          .filter((l) => /^\d+\./.test(l.trim()))
          .map((l) => l.replace(/^\d+\.\s*/, '').trim())
          .filter(Boolean)
      : [];

    items.push({
      culture,
      name:        stripMarkdown(title),
      native_name: nativeMatch   ? nativeMatch[1].trim()   : undefined,
      category:    categoryMatch ? categoryMatch[1].trim() : undefined,
      ingredients,
      steps,
      sort_order:  index,
    });
  });

  return items;
}

function parseProverbs(culture: string, md: string): Proverb[] {
  const proverbs: Proverb[] = [];
  const lines = md.split('\n').filter((l) => l.startsWith('|'));

  const dataRows = lines.filter(
    (l) => !l.includes('---') && !l.toLowerCase().includes('proverb')
      && !l.toLowerCase().includes('translation')
  );

  for (const row of dataRows) {
    const cells = row
      .split('|')
      .map((c) => c.trim())
      .filter(Boolean);

    if (cells.length >= 2) {
      proverbs.push({
        culture,
        native_text:  cells[0] ?? '',
        translation:  cells[1] ?? '',
        meaning:      cells[2] ?? undefined,
        explanation:  cells[3] ?? undefined,
      });
    }
  }

  return proverbs;
}


async function seedCultureContent(rows: CultureContent[]): Promise<void> {
  if (rows.length === 0) return;
  console.log(`  → Seeding ${rows.length} culture_content rows...`);
  const { error } = await supabase
    .from('culture_content')
    .upsert(rows, { onConflict: 'culture,category,title', ignoreDuplicates: false });
  if (error) console.error('culture_content error:', error.message);
  else       console.log ('culture_content seeded');
}

async function seedFoodItems(rows: FoodItem[]): Promise<void> {
  if (rows.length === 0) return;
  console.log(`  → Seeding ${rows.length} food_items rows...`);
  const { error } = await supabase
    .from('food_items')
    .upsert(rows, { onConflict: 'culture,name', ignoreDuplicates: false });
  if (error) console.error('food_items error:', error.message);
  else       console.log ('food_items seeded');
}

async function seedProverbs(rows: Proverb[]): Promise<void> {
  if (rows.length === 0) return;
  console.log(`  → Seeding ${rows.length} proverbs rows...`);
  const { error } = await supabase
    .from('proverbs')
    .upsert(rows, { onConflict: 'culture,native_text', ignoreDuplicates: false });
  if (error) console.error('  proverbs error:', error.message);
  else       console.log ('   proverbs seeded');
}


async function main(): Promise<void> {
  console.log('\nGeoLore Culture Seeder\n' + '-'.repeat(40));

  if (!fs.existsSync(CULTURES_DIR)) {
    console.error(`Directory not found: ${CULTURES_DIR}`);
    console.error('Create the folder: app/data/cultures/');
    process.exit(1);
  }

  const files = fs.readdirSync(CULTURES_DIR).filter((f) => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('No .md files found in', CULTURES_DIR);
    process.exit(0);
  }

  console.log(`Found ${files.length} culture file(s): ${files.join(', ')}\n`);

  for (const file of files) {
    const culture  = tribeFromFilename(file);
    const filepath = path.join(CULTURES_DIR, file);
    const md       = fs.readFileSync(filepath, 'utf-8');

    console.log(`Processing: ${file} -> culture = "${culture}"`);

    const sections = splitByH1(md);

    const contentRows: CultureContent[] = [];
    const foodRows:    FoodItem[]        = [];
    const proverbRows: Proverb[]         = [];

    for (const [sectionTitle, sectionBody] of Object.entries(sections)) {
      const key = sectionTitle.toLowerCase();

      if (key.includes('food')) {
        foodRows.push(...parseFoodItems(culture, sectionBody));

      } else if (key.includes('proverb')) {
        proverbRows.push(...parseProverbs(culture, sectionBody));

      } else if (
        key.includes('history')   ||
        key.includes('tradition') ||
        key.includes('culture')   ||
        key.includes('festival')  ||
        key.includes('belief')    ||
        key.includes('stor')      ||
        key.includes('fashion')   ||
        key.includes('language')
      ) {
        const category =
          key.includes('history')   ? 'history'    :
          key.includes('tradition') ? 'traditions' :
          key.includes('festival')  ? 'festivals'  :
          key.includes('belief')    ? 'beliefs'    :
          key.includes('stor')      ? 'stories'    :
          key.includes('fashion')   ? 'fashion'    :
          key.includes('language')  ? 'language'   :
          'culture';

        contentRows.push(...parseCultureContent(culture, category, sectionBody));
      }
    }

    await seedCultureContent(contentRows);
    await seedFoodItems(foodRows);
    await seedProverbs(proverbRows);

    console.log(`Done: ${culture}\n`);
  }

  console.log('-'.repeat(40));
  console.log('All cultures seeded successfully!\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});