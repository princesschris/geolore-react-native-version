"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const supabase_js_1 = require("@supabase/supabase-js");
// @xenova/transformers runs fully locally — no API key, no cost
const { pipeline } = require('@xenova/transformers');
const SUPABASE_URL = 'https://ypoumpucjsauimirpoil.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwb3VtcHVjanNhdWltaXJwb2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjMwOTcsImV4cCI6MjA5NDgzOTA5N30.LyF2elLk8cnBsGDA_Y0LLaB8weOJC7Vn-4sISO6FufQ';
const supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_ANON_KEY);
const CULTURES_DIR = path.join(__dirname, '..', 'data', 'cultures');
// ─────────────────────────────────────────────────────────────────────────────
//  EMBEDDING SETUP
//  Uses all-MiniLM-L6-v2 — free, runs locally, produces 384-dim vectors
//  Model is downloaded once (~25MB) and cached automatically
// ─────────────────────────────────────────────────────────────────────────────
let embedder = null;
async function getEmbedder() {
    if (!embedder) {
        console.log('  Loading embedding model (first run downloads ~25MB)...');
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log('  Embedding model ready.');
    }
    return embedder;
}
async function generateEmbedding(text) {
    const embed = await getEmbedder();
    // Truncate to 512 tokens max (model limit) by slicing chars
    const truncated = text.slice(0, 2000);
    const output = await embed(truncated, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}
// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function tribeFromFilename(filename) {
    const base = path.basename(filename, '.md');
    return base.charAt(0).toUpperCase() + base.slice(1).toLowerCase();
}
function splitByH1(md) {
    const sections = {};
    const lines = md.split('\n');
    let current = '';
    let body = [];
    for (const line of lines) {
        if (line.startsWith('# ') && !line.startsWith('## ')) {
            if (current)
                sections[current] = body.join('\n').trim();
            current = line.replace(/^# /, '').trim();
            body = [];
        }
        else {
            body.push(line);
        }
    }
    if (current)
        sections[current] = body.join('\n').trim();
    return sections;
}
function splitByH2(md) {
    const results = [];
    const lines = md.split('\n');
    let current = '';
    let body = [];
    for (const line of lines) {
        if (line.startsWith('## ')) {
            if (current)
                results.push({ title: current, body: body.join('\n').trim() });
            current = line.replace(/^## /, '').trim();
            body = [];
        }
        else {
            body.push(line);
        }
    }
    if (current)
        results.push({ title: current, body: body.join('\n').trim() });
    return results;
}
function splitByH3(md) {
    const results = [];
    const lines = md.split('\n');
    let current = '';
    let body = [];
    for (const line of lines) {
        if (line.startsWith('### ')) {
            if (current)
                results.push({ title: current, body: body.join('\n').trim() });
            current = line.replace(/^### /, '').trim();
            body = [];
        }
        else {
            body.push(line);
        }
    }
    if (current)
        results.push({ title: current, body: body.join('\n').trim() });
    return results;
}
function stripMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/#+\s/g, '')
        .replace(/^\s*[-*]\s/gm, '')
        .trim();
}
function extractBullets(text) {
    return text
        .split('\n')
        .filter((l) => /^\s*[-*•]/.test(l))
        .map((l) => l.replace(/^\s*[-*•]\s*/, '').trim())
        .filter(Boolean);
}
function extractNumberedSteps(text) {
    return text
        .split('\n')
        .filter((l) => /^\d+\./.test(l.trim()))
        .map((l) => l.replace(/^\d+\.\s*/, '').trim())
        .filter(Boolean);
}
function extractFashionSections(body) {
    const get = (pattern) => {
        const match = body.match(pattern);
        if (!match)
            return undefined;
        const raw = match[1];
        const numbered = extractNumberedSteps(raw);
        if (numbered.length)
            return numbered.map((s, i) => `${i + 1}. ${s}`).join('\n');
        const bullets = extractBullets(raw);
        if (bullets.length)
            return bullets.join('\n');
        return stripMarkdown(raw).trim() || undefined;
    };
    const description = get(/####\s*Description\s*([\s\S]*?)(?=####|$)/i);
    const materials = get(/####\s*Materials\s*([\s\S]*?)(?=####|$)/i);
    const worn_by = get(/####\s*Who (?:Wore|Wears) It\s*([\s\S]*?)(?=####|$)/i);
    const occasions = get(/####\s*Occasions\s*([\s\S]*?)(?=####|$)/i);
    const significance = get(/####\s*Cultural Significance\s*([\s\S]*?)(?=####|$)/i);
    const modern_usage = get(/####\s*Modern Usage\s*([\s\S]*?)(?=####|$)/i);
    const parts = [description, materials, worn_by, occasions, significance, modern_usage]
        .filter(Boolean);
    const summary = parts.join('\n\n');
    return { description, materials, worn_by, occasions, significance, modern_usage, summary };
}
// ─────────────────────────────────────────────────────────────────────────────
//  PARSERS
// ─────────────────────────────────────────────────────────────────────────────
function parseCultureContent(culture, category, md) {
    const rows = [];
    const subsections = splitByH2(md);
    if (subsections.length === 0) {
        rows.push({
            culture, category,
            title: category.charAt(0).toUpperCase() + category.slice(1),
            content: md, // raw markdown preserved for the app renderer
            sort_order: 0,
        });
        return rows;
    }
    subsections.forEach(({ title, body }, index) => {
        rows.push({
            culture, category,
            title: stripMarkdown(title),
            content: body, // raw markdown preserved for the app renderer
            sort_order: index,
        });
    });
    return rows;
}
function parseFashionContent(culture, md) {
    const rows = [];
    const seen = new Set();
    let globalIndex = 0;
    const h2Sections = splitByH2(md);
    for (const { title: h2Title, body: h2Body } of h2Sections) {
        const h3Items = splitByH3(h2Body);
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
            const h2Category = stripMarkdown(h2Title);
            const sections = extractFashionSections(h3Body);
            if (!sections.summary.trim())
                continue;
            rows.push({
                culture,
                category: 'fashion',
                title: cleanTitle,
                subtitle: h2Category,
                content: sections.summary,
                fashion_description: sections.description,
                fashion_materials: sections.materials,
                fashion_worn_by: sections.worn_by,
                fashion_occasions: sections.occasions,
                fashion_significance: sections.significance,
                fashion_modern_usage: sections.modern_usage,
                sort_order: globalIndex++,
            });
        }
    }
    return rows;
}
function parseFoodItems(culture, md) {
    const items = [];
    const seenNames = new Set();
    const subsections = splitByH2(md);
    subsections.forEach(({ title, body }, index) => {
        const cleanName = stripMarkdown(title);
        if (seenNames.has(cleanName.toLowerCase())) {
            console.log(`    Skipping duplicate: "${cleanName}"`);
            return;
        }
        seenNames.add(cleanName.toLowerCase());
        const nativeMatch = body.match(/\*\*(?:Igbo Name|Native Name|Local Name)[:\s]+\*?\*?\s*(.+)/i);
        const categoryMatch = body.match(/\*\*Category[:\s]+\*?\*?\s*(.+)/i);
        const ingredientsBlock = body.match(/###\s*Ingredients\s*([\s\S]*?)(?=###|$)/i)?.[1] ?? '';
        const ingredients = extractBullets(ingredientsBlock);
        const stepsBlock = body.match(/###\s*(?:Preparation|Steps|How to Cook|Method)\s*([\s\S]*?)(?=###|$)/i)?.[1] ?? '';
        const steps = extractNumberedSteps(stepsBlock);
        if (ingredients.length === 0 && steps.length === 0)
            return;
        items.push({
            culture,
            name: cleanName,
            native_name: nativeMatch ? nativeMatch[1].trim() : undefined,
            category: categoryMatch ? categoryMatch[1].trim() : undefined,
            ingredients, steps,
            sort_order: index,
        });
    });
    return items;
}
function parseProverbs(culture, md) {
    const proverbs = [];
    const lines = md.split('\n').filter((l) => l.startsWith('|'));
    const dataRows = lines.filter((l) => !l.includes('---')
        && !l.toLowerCase().includes('proverb')
        && !l.toLowerCase().includes('translation'));
    for (const row of dataRows) {
        const cells = row.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 2) {
            proverbs.push({
                culture,
                native_text: cells[0] ?? '',
                translation: cells[1] ?? '',
                meaning: cells[2] ?? undefined,
                explanation: cells[3] ?? undefined,
            });
        }
    }
    return proverbs;
}
// ─────────────────────────────────────────────────────────────────────────────
//  SEED FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────
async function seedCultureContent(rows) {
    if (rows.length === 0)
        return;
    console.log(`  Generating embeddings for ${rows.length} rows...`);
    // Generate embeddings one by one — text used is title + plain-text content
    for (const row of rows) {
        const textForEmbedding = `${row.title}. ${stripMarkdown(row.content)}`;
        row.embedding = await generateEmbedding(textForEmbedding);
    }
    console.log(`  Seeding ${rows.length} culture_content rows...`);
    const { error } = await supabase
        .from('culture_content')
        .upsert(rows, { onConflict: 'culture,category,title', ignoreDuplicates: false });
    if (error)
        console.error('  culture_content error:', error.message);
    else
        console.log('  culture_content done ✓');
}
async function seedFoodItems(rows) {
    if (rows.length === 0)
        return;
    console.log(`  Seeding ${rows.length} food_items rows...`);
    const { error } = await supabase
        .from('food_items')
        .upsert(rows, { onConflict: 'culture,name', ignoreDuplicates: false });
    if (error)
        console.error('  food_items error:', error.message);
    else
        console.log('  food_items done ✓');
}
async function seedProverbs(rows) {
    if (rows.length === 0)
        return;
    console.log(`  Seeding ${rows.length} proverbs rows...`);
    const { error } = await supabase
        .from('proverbs')
        .upsert(rows, { onConflict: 'culture,native_text', ignoreDuplicates: false });
    if (error)
        console.error('  proverbs error:', error.message);
    else
        console.log('  proverbs done ✓');
}
// ─────────────────────────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\nGeoLore Culture Seeder\n' + '-'.repeat(40));
    if (!fs.existsSync(CULTURES_DIR)) {
        console.error(`Directory not found: ${CULTURES_DIR}`);
        process.exit(1);
    }
    const files = fs.readdirSync(CULTURES_DIR).filter((f) => f.endsWith('.md'));
    if (files.length === 0) {
        console.log('No .md files found');
        process.exit(0);
    }
    console.log(`Found ${files.length} file(s): ${files.join(', ')}\n`);
    for (const file of files) {
        const culture = tribeFromFilename(file);
        const filepath = path.join(CULTURES_DIR, file);
        const md = fs.readFileSync(filepath, 'utf-8');
        console.log(`Processing: ${file} -> "${culture}"`);
        const sections = splitByH1(md);
        const contentRows = [];
        const foodRows = [];
        const proverbRows = [];
        for (const [sectionTitle, sectionBody] of Object.entries(sections)) {
            const key = sectionTitle.toLowerCase().replace(/[_*]/g, '');
            if (key.includes('food')) {
                foodRows.push(...parseFoodItems(culture, sectionBody));
            }
            else if (key.includes('proverb')) {
                proverbRows.push(...parseProverbs(culture, sectionBody));
            }
            else if (key.includes('fashion')) {
                contentRows.push(...parseFashionContent(culture, sectionBody));
            }
            else if (key.includes('history') ||
                key.includes('tradition') ||
                key.includes('culture') ||
                key.includes('festival') ||
                key.includes('belief') ||
                key.includes('stories') ||
                key.includes('language')) {
                const category = key.includes('history') ? 'history' :
                    key.includes('tradition') ? 'traditions' :
                        key.includes('festival') ? 'festivals' :
                            key.includes('belief') ? 'beliefs' :
                                key.includes('stor') ? 'stories' :
                                    key.includes('language') ? 'language' : 'culture';
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
