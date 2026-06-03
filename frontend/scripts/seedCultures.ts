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

// One H3 item inside a fashion group
interface FashionItem {
  name:          string;
  subtitle?:     string;   // **Category:** field
  description?:  string;
  materials?:    string;
  worn_by?:      string;
  occasions?:    string;
  significance?: string;
  modern_usage?: string;
}

// One H2 group row stored in culture_content
interface CultureContent {
  culture:       string;
  category:      string;
  title:         string;          // H2 heading e.g. "Clothing"
  subtitle?:     string;
  content:       string;          // flat text summary (for search)
  fashion_items?: FashionItem[];  // structured H3 items (fashion only)
  sort_order:    number;
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

// Extract a single #### sub-section from an H3 body
function getSubSection(body: string, pattern: RegExp): string | undefined {
  const match = body.match(pattern);
  if (!match) return undefined;
  const raw      = match[1];
  const numbered = extractNumberedSteps(raw);
  if (numbered.length) return numbered.map((s, i) => `${i + 1}. ${s}`).join('\n');
  const bullets  = extractBullets(raw);
  if (bullets.length) return bullets.join('\n');
  return stripMarkdown(raw).trim() || undefined;
}

// Parse one H3 block into a structured FashionItem
function parseH3Item(title: string, body: string): FashionItem | null {
  const categoryMatch = body.match(/\*\*Category[:\s]+\*?\*?\s*(.+)/i);

  const description  = getSubSection(body, /####\s*Description\s*([\s\S]*?)(?=####|$)/i);
  const materials    = getSubSection(body, /####\s*Materials\s*([\s\S]*?)(?=####|$)/i);
  const worn_by      = getSubSection(body, /####\s*Who (?:Wore|Wears) It\s*([\s\S]*?)(?=####|$)/i);
  const occasions    = getSubSection(body, /####\s*Occasions\s*([\s\S]*?)(?=####|$)/i);
  const significance = getSubSection(body, /####\s*Cultural Significance\s*([\s\S]*?)(?=####|$)/i);
  const modern_usage = getSubSection(body, /####\s*Modern Usage\s*([\s\S]*?)(?=####|$)/i);

  // Skip if nothing meaningful was extracted
  if (!description && !materials && !worn_by && !occasions && !significance && !modern_usage) {
    return null;
  }

  return {
    name:        stripMarkdown(title),
    subtitle:    categoryMatch ? categoryMatch[1].trim() : undefined,
    description, materials, worn_by, occasions, significance, modern_usage,
  };
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

/**
 * Parse the Fashion H1 section.
 *
 * One culture_content row per H2 group (e.g. "Clothing", "Hair").
 * Each row's fashion_items column is an array of the H3 items under it.
 * H3 items are never stored as their own rows.
 */
const DETAIL_SECTION_NAMES = new Set([
  'description', 'materials', 'how it is used', 'how it is worn',
  'who wears it', 'who wore it', 'occasions', 'cultural significance',
  'modern usage', 'styles', 'types', 'varieties', 'significance',
]);

function isDetailSection(title: string): boolean {
  return DETAIL_SECTION_NAMES.has(title.toLowerCase().trim());
}

/**
 * Parse the Fashion H1 section.
 *
 * Handles two .md structures automatically:
 *   Igbo-style:   ## Group (Clothing/Hair) → ### OutfitName → #### Detail
 *   Yoruba-style: ## OutfitName            → ### Detail (no outfit-level H3)
 *
 * Detection: if a H2's H3 children are ALL detail section names, it's Yoruba-style.
 */
function parseFashionContent(culture: string, md: string): CultureContent[] {
  const rows: CultureContent[] = [];
  const seenNames = new Set<string>();
  let globalIndex = 0;

  const h2Sections = splitByH2(md);
  if (h2Sections.length === 0) return rows;

  // Detect structure from the first H2 that has H3 children
  const firstWithH3 = h2Sections.find(s => splitByH3(s.body).length > 0);
  const isYorubaStyle = firstWithH3
    ? splitByH3(firstWithH3.body).every(h3 => isDetailSection(h3.title))
    : false;

  if (isYorubaStyle) {
    // ── Yoruba style: H2 = outfit name, H3 = detail sections ─────────────────
    for (const { title: h2Title, body: h2Body } of h2Sections) {
      const cleanTitle = stripMarkdown(h2Title);
      if (seenNames.has(cleanTitle.toLowerCase())) continue;
      seenNames.add(cleanTitle.toLowerCase());

      const categoryMatch = h2Body.match(/\*\*Category[:\s]+\*?\*?\s*(.+)/i);
      const subtitle = categoryMatch ? categoryMatch[1].trim() : undefined;

      // Use parseH3Item with H3-level regex patterns adapted for H3 sections
      const get = (pattern: RegExp): string | undefined => {
        const match = h2Body.match(pattern);
        if (!match) return undefined;
        const raw      = match[1];
        const numbered = extractNumberedSteps(raw);
        if (numbered.length) return numbered.map((s, i) => `${i + 1}. ${s}`).join('\n');
        const bullets  = extractBullets(raw);
        if (bullets.length) return bullets.join('\n');
        return stripMarkdown(raw).trim() || undefined;
      };

      const description  = get(/###\s*Description\s*([\s\S]*?)(?=###|$)/i);
      const materials    = get(/###\s*Materials\s*([\s\S]*?)(?=###|$)/i);
      const worn_by      = get(/###\s*Who (?:Wears|Wore) It\s*([\s\S]*?)(?=###|$)/i);
      const occasions    = get(/###\s*Occasions\s*([\s\S]*?)(?=###|$)/i);
      const significance = get(/###\s*(?:Cultural Significance|Significance)\s*([\s\S]*?)(?=###|$)/i);
      const modern_usage = get(/###\s*(?:Modern Usage|How It Is Used)\s*([\s\S]*?)(?=###|$)/i);

      const content = [description, materials, worn_by, occasions, significance, modern_usage]
        .filter(Boolean).join('\n\n');

      if (!content.trim()) continue;

      const item: FashionItem = {
        name: cleanTitle, subtitle, description, materials,
        worn_by, occasions, significance, modern_usage,
      };

      rows.push({
        culture, category: 'fashion',
        title: cleanTitle, subtitle, content,
        fashion_items: [item],
        sort_order: globalIndex++,
      });
    }
  } else {
    // ── Igbo style: H2 = group, H3 = outfit name, H4 = detail sections ───────
    for (const { title: h2Title, body: h2Body } of h2Sections) {
      const cleanTitle = stripMarkdown(h2Title);
      const h3List     = splitByH3(h2Body);
      const fashionItems: FashionItem[] = [];

      for (const { title: h3Title, body: h3Body } of h3List) {
        const cleanName = stripMarkdown(h3Title);
        if (seenNames.has(cleanName.toLowerCase())) continue;
        seenNames.add(cleanName.toLowerCase());
        const item = parseH3Item(cleanName, h3Body);
        if (item) fashionItems.push(item);
      }

      const contentSummary = fashionItems.length > 0
        ? fashionItems.map(i => [i.name, i.description].filter(Boolean).join(': ')).join('\n\n')
        : stripMarkdown(h2Body);

      rows.push({
        culture, category: 'fashion',
        title:         cleanTitle,
        content:       contentSummary,
        fashion_items: fashionItems.length > 0 ? fashionItems : undefined,
        sort_order:    globalIndex++,
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