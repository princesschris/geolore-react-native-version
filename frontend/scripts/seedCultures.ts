// ─────────────────────────────────────────────────────────────────────────────
//  scripts/seedCultures.ts
//
//  HOW TO RUN:
//    npx ts-node scripts/seedCultures.ts
//
//  TO ADD A NEW TRIBE:
//    1. Drop a new .md file into data/cultures/
//    2. Run this script again
// ─────────────────────────────────────────────────────────────────────────────

import * as fs   from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://ypoumpucjsauimirpoil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwb3VtcHVjanNhdWltaXJwb2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjMwOTcsImV4cCI6MjA5NDgzOTA5N30.LyF2elLk8cnBsGDA_Y0LLaB8weOJC7Vn-4sISO6FufQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CULTURES_DIR = path.join(__dirname, '..', 'data', 'cultures');

// ─────────────────────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface CultureContent {
  culture:              string;
  category:             string;
  title:                string;
  subtitle?:            string;
  content:              string;
  // structured fashion columns
  fashion_description?: string;
  fashion_materials?:   string;
  fashion_worn_by?:     string;
  fashion_occasions?:   string;
  fashion_significance?:string;
  fashion_modern_usage?:string;
  sort_order:           number;
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

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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

function splitByH3(md: string): { title: string; body: string }[] {
  const results: { title: string; body: string }[] = [];
  const lines = md.split('\n');
  let current = '';
  let body: string[] = [];
  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (current) results.push({ title: current, body: body.join('\n').trim() });
      current = line.replace(/^### /, '').trim();
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
    .filter((l) => /^\s*[-*•]/.test(l))
    .map((l)  => l.replace(/^\s*[-*•]\s*/, '').trim())
    .filter(Boolean);
}

function extractNumberedSteps(text: string): string[] {
  return text
    .split('\n')
    .filter((l) => /^\d+\./.test(l.trim()))
    .map((l)  => l.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────────────────────────────
//  FASHION SECTION EXTRACTOR
//  Returns each sub-section as its own field so the UI can render headings.
// ─────────────────────────────────────────────────────────────────────────────

interface FashionSections {
  description?:  string;
  materials?:    string;
  worn_by?:      string;
  occasions?:    string;
  significance?: string;
  modern_usage?: string;
  /** Flat fallback used as the content column — summary of all fields */
  summary:       string;
}

function extractFashionSections(body: string): FashionSections {
  const get = (pattern: RegExp): string | undefined => {
    const match = body.match(pattern);
    if (!match) return undefined;
    const raw = match[1];
    // numbered list → joined sentences; bullet list → comma-joined; plain text → stripped
    const numbered = extractNumberedSteps(raw);
    if (numbered.length) return numbered.map((s, i) => `${i + 1}. ${s}`).join('\n');
    const bullets = extractBullets(raw);
    if (bullets.length) return bullets.join('\n');
    return stripMarkdown(raw).trim() || undefined;
  };

  const description  = get(/####\s*Description\s*([\s\S]*?)(?=####|$)/i);
  const materials    = get(/####\s*Materials\s*([\s\S]*?)(?=####|$)/i);
  const worn_by      = get(/####\s*Who (?:Wore|Wears) It\s*([\s\S]*?)(?=####|$)/i);
  const occasions    = get(/####\s*Occasions\s*([\s\S]*?)(?=####|$)/i);
  const significance = get(/####\s*Cultural Significance\s*([\s\S]*?)(?=####|$)/i);
  const modern_usage = get(/####\s*Modern Usage\s*([\s\S]*?)(?=####|$)/i);

  // Flat summary for the content column (used for search / fallback)
  const parts = [description, materials, worn_by, occasions, significance, modern_usage]
    .filter(Boolean) as string[];
  const summary = parts.join('\n\n');

  return { description, materials, worn_by, occasions, significance, modern_usage, summary };
}

// ─────────────────────────────────────────────────────────────────────────────
//  PARSERS
// ─────────────────────────────────────────────────────────────────────────────

function parseCultureContent(
  culture:  string,
  category: string,
  md:       string,
): CultureContent[] {
  const rows: CultureContent[] = [];
  const subsections = splitByH2(md);

  if (subsections.length === 0) {
    rows.push({
      culture, category,
      title:      category.charAt(0).toUpperCase() + category.slice(1),
      content:    stripMarkdown(md),
      sort_order: 0,
    });
    return rows;
  }

  subsections.forEach(({ title, body }, index) => {
    rows.push({
      culture, category,
      title:      stripMarkdown(title),
      content:    stripMarkdown(body),
      sort_order: index,
    });
  });

  return rows;
}

function parseFashionContent(culture: string, md: string): CultureContent[] {
  const rows: CultureContent[]  = [];
  const seen = new Set<string>();
  let globalIndex = 0;

  const h2Sections = splitByH2(md);

  for (const { title: h2Title, body: h2Body } of h2Sections) {
    const h3Items = splitByH3(h2Body);

    // No H3 items — H2 is just a section header, skip it entirely
    if (h3Items.length === 0) {
      console.log(`    Skipping H2-only section (no items): "${stripMarkdown(h2Title)}"`);
      continue;
    }

    for (const { title: h3Title, body: h3Body } of h3Items) {
      const cleanTitle = stripMarkdown(h3Title);
      if (seen.has(cleanTitle.toLowerCase())) {
        console.log(`    Skipping duplicate fashion item: "${cleanTitle}"`);
        continue;
      }
      seen.add(cleanTitle.toLowerCase());

      // H2 title becomes the grouping subtitle (e.g. "Clothing", "Hair")
      const h2Category = stripMarkdown(h2Title);

      const sections = extractFashionSections(h3Body);
      if (!sections.summary.trim()) continue;

      rows.push({
        culture,
        category:              'fashion',
        title:                 cleanTitle,
        subtitle:              h2Category,
        content:               sections.summary,
        fashion_description:   sections.description,
        fashion_materials:     sections.materials,
        fashion_worn_by:       sections.worn_by,
        fashion_occasions:     sections.occasions,
        fashion_significance:  sections.significance,
        fashion_modern_usage:  sections.modern_usage,
        sort_order:            globalIndex++,
      });
    }
  }

  return rows;
}

function parseFoodItems(culture: string, md: string): FoodItem[] {
  const items:      FoodItem[] = [];
  const seenNames = new Set<string>();
  const subsections = splitByH2(md);

  subsections.forEach(({ title, body }, index) => {
    const cleanName = stripMarkdown(title);
    if (seenNames.has(cleanName.toLowerCase())) {
      console.log(`    Skipping duplicate: "${cleanName}"`);
      return;
    }
    seenNames.add(cleanName.toLowerCase());

    const nativeMatch   = body.match(/\*\*(?:Igbo Name|Native Name|Local Name)[:\s]+\*?\*?\s*(.+)/i);
    const categoryMatch = body.match(/\*\*Category[:\s]+\*?\*?\s*(.+)/i);

    const ingredientsBlock = body.match(/###\s*Ingredients\s*([\s\S]*?)(?=###|$)/i)?.[1] ?? '';
    const ingredients      = extractBullets(ingredientsBlock);

    const stepsBlock = body.match(/###\s*(?:Preparation|Steps|How to Cook|Method)\s*([\s\S]*?)(?=###|$)/i)?.[1] ?? '';
    const steps      = extractNumberedSteps(stepsBlock);

    if (ingredients.length === 0 && steps.length === 0) return;

    items.push({
      culture,
      name:        cleanName,
      native_name: nativeMatch   ? nativeMatch[1].trim()   : undefined,
      category:    categoryMatch ? categoryMatch[1].trim() : undefined,
      ingredients, steps,
      sort_order:  index,
    });
  });

  return items;
}

function parseProverbs(culture: string, md: string): Proverb[] {
  const proverbs: Proverb[] = [];
  const lines = md.split('\n').filter((l) => l.startsWith('|'));
  const dataRows = lines.filter(
    (l) => !l.includes('---')
      && !l.toLowerCase().includes('proverb')
      && !l.toLowerCase().includes('translation')
  );
  for (const row of dataRows) {
    const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
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

// ─────────────────────────────────────────────────────────────────────────────
//  SEED FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

async function seedCultureContent(rows: CultureContent[]): Promise<void> {
  if (rows.length === 0) return;
  console.log(`  Seeding ${rows.length} culture_content rows...`);
  const { error } = await supabase
    .from('culture_content')
    .upsert(rows, { onConflict: 'culture,category,title', ignoreDuplicates: false });
  if (error) console.error('  culture_content error:', error.message);
  else       console.log ('  culture_content done');
}

async function seedFoodItems(rows: FoodItem[]): Promise<void> {
  if (rows.length === 0) return;
  console.log(`  Seeding ${rows.length} food_items rows...`);
  const { error } = await supabase
    .from('food_items')
    .upsert(rows, { onConflict: 'culture,name', ignoreDuplicates: false });
  if (error) console.error('  food_items error:', error.message);
  else       console.log ('  food_items done');
}

async function seedProverbs(rows: Proverb[]): Promise<void> {
  if (rows.length === 0) return;
  console.log(`  Seeding ${rows.length} proverbs rows...`);
  const { error } = await supabase
    .from('proverbs')
    .upsert(rows, { onConflict: 'culture,native_text', ignoreDuplicates: false });
  if (error) console.error('  proverbs error:', error.message);
  else       console.log ('  proverbs done');
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('\nGeoLore Culture Seeder\n' + '-'.repeat(40));

  if (!fs.existsSync(CULTURES_DIR)) {
    console.error(`Directory not found: ${CULTURES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(CULTURES_DIR).filter((f) => f.endsWith('.md'));
  if (files.length === 0) { console.log('No .md files found'); process.exit(0); }

  console.log(`Found ${files.length} file(s): ${files.join(', ')}\n`);

  for (const file of files) {
    const culture  = tribeFromFilename(file);
    const filepath = path.join(CULTURES_DIR, file);
    const md       = fs.readFileSync(filepath, 'utf-8');

    console.log(`Processing: ${file} -> "${culture}"`);

    const sections      = splitByH1(md);
    const contentRows:  CultureContent[] = [];
    const foodRows:     FoodItem[]        = [];
    const proverbRows:  Proverb[]         = [];

    for (const [sectionTitle, sectionBody] of Object.entries(sections)) {
      const key = sectionTitle.toLowerCase().replace(/[_*]/g, '');

      if (key.includes('food')) {
        foodRows.push(...parseFoodItems(culture, sectionBody));

      } else if (key.includes('proverb')) {
        proverbRows.push(...parseProverbs(culture, sectionBody));

      } else if (key.includes('fashion')) {
        contentRows.push(...parseFashionContent(culture, sectionBody));

      } else if (
        key.includes('history')   ||
        key.includes('tradition') ||
        key.includes('culture')   ||
        key.includes('festival')  ||
        key.includes('belief')    ||
        key.includes('stor')      ||
        key.includes('language')
      ) {
        const category =
          key.includes('history')   ? 'history'    :
          key.includes('tradition') ? 'traditions' :
          key.includes('festival')  ? 'festivals'  :
          key.includes('belief')    ? 'beliefs'    :
          key.includes('stor')      ? 'stories'    :
          key.includes('language')  ? 'language'   : 'culture';

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