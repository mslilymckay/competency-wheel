import fs from 'fs';
import { getBlueprintForCompetency } from '../src/data/interventionsData.js';

function esc(s) {
  return (s || '').replace(/'/g, "''");
}

const icCompetencies = [
  "Timeline Reliability",
  "High-Quality Delivery",
  "Execution Efficiency",
  "Active Listening",
  "Transparent Sharing",
  "Constructive Teaming",
  "Practical Solutions",
  "Roadblock Diagnosis",
  "Scoped Execution",
  "Continuous Learning",
  "Technical Mastery",
  "Quality Standards",
  "Constructive Correction",
  "Ownership Mindset",
  "Growth Proactivity"
];

const managerCompetencies = [
  "Actionable Feedback",
  "Career Pathway Unblocking",
  "Developmental Coaching",
  "Agreement Alignment",
  "Friction Detection",
  "Neutral Mediation",
  "Budget & Tool Stewardship",
  "Capacity Forecasting",
  "Workload Balancing",
  "Empathetic Attunement",
  "Inclusive Decisions",
  "Psychological Safety",
  "Execution Cadence",
  "Metric Alignment",
  "Milestone Translation"
];

const inserts = [];
let sort = 0;

function addTierInserts(competencies, tier) {
  competencies.forEach(comp => {
    const bp = getBlueprintForCompetency(comp, tier);
    const baseId = tier + "_" + comp.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

    // Experiential (70%)
    inserts.push(`('${baseId}_70', '${tier}', '${esc(bp.category)}', '${esc(comp)}', 'experiential', 70, '${esc(bp.experiential.title)}', '${esc(bp.experiential.action)}', '${esc(bp.experiential.reflection)}', '${esc(bp.experiential.tag)}', '${esc(bp.experiential.context)}', '${esc(bp.managerUnblocker)}', '${esc(bp.managerCoachingQuestion)}', ${++sort})`);

    // Social (20%)
    inserts.push(`('${baseId}_20', '${tier}', '${esc(bp.category)}', '${esc(comp)}', 'social', 20, '${esc(bp.social.title)}', '${esc(bp.social.action)}', '${esc(bp.social.reflection)}', '${esc(bp.social.tag)}', '${esc(bp.social.context)}', '${esc(bp.managerUnblocker)}', '${esc(bp.managerCoachingQuestion)}', ${++sort})`);

    // Formal (10%)
    inserts.push(`('${baseId}_10', '${tier}', '${esc(bp.category)}', '${esc(comp)}', 'formal', 10, '${esc(bp.formal.title)}', '${esc(bp.formal.action)}', '${esc(bp.formal.reflection)}', '${esc(bp.formal.tag)}', '${esc(bp.formal.context)}', '${esc(bp.managerUnblocker)}', '${esc(bp.managerCoachingQuestion)}', ${++sort})`);
  });
}

addTierInserts(icCompetencies, "ic");
addTierInserts(managerCompetencies, "manager");

const sql = `-- =========================================================================
-- Supabase Schema & Seed Migration: 70-20-10 Learning Interventions Table
-- Run this in the Supabase SQL Editor to create and populate the table.
-- =========================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.interventions (
    id TEXT PRIMARY KEY,
    tier TEXT NOT NULL DEFAULT 'ic',
    category TEXT NOT NULL,
    competency TEXT NOT NULL,
    bucket TEXT NOT NULL CHECK (bucket IN ('experiential', 'social', 'formal')),
    bucket_percentage INTEGER NOT NULL CHECK (bucket_percentage IN (70, 20, 10)),
    title TEXT NOT NULL,
    action TEXT NOT NULL,
    reflection TEXT NOT NULL,
    tag TEXT NOT NULL,
    context_modifier TEXT NOT NULL,
    manager_unblocker TEXT NOT NULL,
    manager_coaching_question TEXT NOT NULL,
    sort_order INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_interventions_tier_competency 
ON public.interventions (tier, competency);

CREATE INDEX IF NOT EXISTS idx_interventions_category 
ON public.interventions (category);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

-- 4. Public Read Policy (safe for client app consumption)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'interventions' AND policyname = 'Allow public read access on interventions'
    ) THEN
        CREATE POLICY "Allow public read access on interventions"
        ON public.interventions
        FOR SELECT
        TO public
        USING (true);
    END IF;
END $$;

-- 5. Seed all 30 Learning Interventions (90 rows: 45 IC + 45 Manager across 70%, 20%, 10%)
INSERT INTO public.interventions (
    id, tier, category, competency, bucket, bucket_percentage,
    title, action, reflection, tag, context_modifier,
    manager_unblocker, manager_coaching_question, sort_order
)
VALUES
` + inserts.join(",\n") + `
ON CONFLICT (id) DO UPDATE SET
    tier = EXCLUDED.tier,
    category = EXCLUDED.category,
    competency = EXCLUDED.competency,
    bucket = EXCLUDED.bucket,
    bucket_percentage = EXCLUDED.bucket_percentage,
    title = EXCLUDED.title,
    action = EXCLUDED.action,
    reflection = EXCLUDED.reflection,
    tag = EXCLUDED.tag,
    context_modifier = EXCLUDED.context_modifier,
    manager_unblocker = EXCLUDED.manager_unblocker,
    manager_coaching_question = EXCLUDED.manager_coaching_question,
    sort_order = EXCLUDED.sort_order;
`;

fs.writeFileSync("Content Files/create_interventions_table.sql", sql, "utf8");
console.log("create_interventions_table.sql generated successfully with", inserts.length, "rows!");
