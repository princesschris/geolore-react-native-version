"""
generate_embeddings.py

Generates embeddings for all culture_content rows in Supabase
using a local sentence-transformers model (no internet needed after first run).

HOW TO RUN:
  pip install sentence-transformers supabase

  python scripts/generate_embeddings.py

First run downloads the model (~25MB) and caches it automatically.
Subsequent runs are instant.
"""

from sentence_transformers import SentenceTransformer
from supabase import create_client, Client
import re

# ── Config ────────────────────────────────────────────────────────────────────

SUPABASE_URL      = "https://ypoumpucjsauimirpoil.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlwb3VtcHVjanNhdWltaXJwb2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjMwOTcsImV4cCI6MjA5NDgzOTA5N30.LyF2elLk8cnBsGDA_Y0LLaB8weOJC7Vn-4sISO6FufQ"

# Same model used in the seeder — produces 384-dim vectors
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# ── Helpers ───────────────────────────────────────────────────────────────────

def strip_markdown(text: str) -> str:
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'\*(.*?)\*',     r'\1', text)
    text = re.sub(r'_(.*?)_',       r'\1', text)
    text = re.sub(r'`(.*?)`',       r'\1', text)
    text = re.sub(r'#+\s',          '',    text)
    text = re.sub(r'^\s*[-*]\s',    '',    text, flags=re.MULTILINE)
    return text.strip()

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("\nGeoLore Embedding Generator")
    print("-" * 40)

    # Load model (downloads once, then cached)
    print(f"Loading model: {MODEL_NAME}")
    print("(First run downloads ~25MB — subsequent runs are instant)\n")
    model = SentenceTransformer(MODEL_NAME)
    print("Model ready.\n")

    # Connect to Supabase
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

    # Fetch all rows that have no embedding yet
    print("Fetching rows without embeddings...")
    response = supabase.table("culture_content") \
        .select("id, title, content") \
        .is_("embedding", "null") \
        .execute()

    rows = response.data
    if not rows:
        print("All rows already have embeddings!")
        return

    print(f"Found {len(rows)} rows to embed.\n")

    # Generate and update embeddings in batches
    BATCH_SIZE = 32
    total = len(rows)

    for i in range(0, total, BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]

        # Build text for each row: title + plain content
        texts = [
            f"{r['title']}. {strip_markdown(r['content'] or '')}".strip()[:500]
            for r in batch
        ]

        # Generate embeddings for whole batch at once (fast)
        embeddings = model.encode(texts, normalize_embeddings=True).tolist()

        # Update each row in Supabase
        for row, embedding in zip(batch, embeddings):
            supabase.table("culture_content") \
                .update({"embedding": embedding}) \
                .eq("id", row["id"]) \
                .execute()

            idx = rows.index(row) + 1
            print(f"  [{idx}/{total}] {row['title'][:50]}... ✓")

    print("\n" + "-" * 40)
    print(f"Done! {total} embeddings generated and saved.\n")

if __name__ == "__main__":
    main()