BEGIN;

CREATE TABLE IF NOT EXISTS amanicode_records (
  collection TEXT NOT NULL CHECK (collection IN ('leads', 'site-assets', 'site-settings')),
  id TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection, id)
);

CREATE INDEX IF NOT EXISTS amanicode_records_collection_created_at_idx
  ON amanicode_records (collection, created_at DESC);

COMMIT;