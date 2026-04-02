-- Admin-approved daily GSC data that clients see on their dashboard.
-- Admin syncs from Google Search Console, can edit values, then saves here.
-- Client dashboard reads from this table instead of calling GSC directly.

CREATE TABLE IF NOT EXISTS seo_gsc_daily (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  seo_project_id uuid NOT NULL REFERENCES seo_projects(id) ON DELETE CASCADE,
  date date NOT NULL,
  clicks integer NOT NULL DEFAULT 0,
  impressions integer NOT NULL DEFAULT 0,
  ctr real NOT NULL DEFAULT 0,
  position real NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(seo_project_id, date)
);

CREATE INDEX IF NOT EXISTS idx_seo_gsc_daily_project_date
  ON seo_gsc_daily(seo_project_id, date);

ALTER TABLE seo_gsc_daily ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read (clients need to see their data)
CREATE POLICY "Authenticated users can read gsc_daily"
  ON seo_gsc_daily FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can write
CREATE POLICY "Admins can insert gsc_daily"
  ON seo_gsc_daily FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update gsc_daily"
  ON seo_gsc_daily FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete gsc_daily"
  ON seo_gsc_daily FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
