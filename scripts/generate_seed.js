import fs from 'fs';
import { competencyFramework } from '../src/data/competencyData.js';
import { valuesFramework } from '../src/data/valuesData.js';

function esc(str) {
  return (str || '').replace(/'/g, "''");
}

const fwInserts = [];
let sort = 0;

competencyFramework.forEach(tier => {
  const tierKey = tier.name === 'Individual Contributor' ? 'ic' : tier.name.toLowerCase();
  tier.children.forEach(cat => {
    cat.children.forEach(skill => {
      const id = tierKey + '_' + skill.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      fwInserts.push(`('${esc(id)}', 'competency', '${esc(tierKey)}', '${esc(tier.name)}', '${esc(cat.name)}', '${esc(skill.name)}', '${esc(skill.definition)}', ${++sort})`);
    });
  });
});

valuesFramework.forEach(val => {
  val.children.forEach(sub => {
    const id = 'values_' + sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    fwInserts.push(`('${esc(id)}', 'value', 'values', 'Core Values', '${esc(val.name)}', '${esc(sub.name)}', '${esc(sub.definition)}', ${++sort})`);
  });
});

const md = fs.readFileSync('Content Files/Balanced Assessment Pairings.md', 'utf8');
const lines = md.split('\n');
const pairInserts = [];
let currentTier = '';

for (const line of lines) {
  if (line.includes('## 1. Individual Contributor')) currentTier = 'ic';
  else if (line.includes('## 2. Manager')) currentTier = 'manager';
  else if (line.includes('## 3. Director')) currentTier = 'director';
  else if (line.includes('## 4. Core Values')) currentTier = 'values';

  const match = line.match(/^\|\s*\*\*([0-9\.]+)\*\*\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/);
  if (match) {
    const [_, id, prompt, optA, optB, status] = match;
    const parseOpt = (raw) => {
      const m = raw.match(/^(.*?)\s*\*\((.*?)\)\*/);
      return m ? { text: m[1].trim(), competency: m[2].trim() } : { text: raw.trim(), competency: '' };
    };
    const a = parseOpt(optA);
    const b = parseOpt(optB);
    const recId = currentTier + '_' + id;
    pairInserts.push(`('${esc(recId)}', '${esc(currentTier)}', '${esc(id)}', '${esc(prompt.trim())}', '${esc(a.text)}', '${esc(a.competency)}', '${esc(b.text)}', '${esc(b.competency)}')`);
  }
}

const sql = `
-- Insert frameworks
INSERT INTO public.frameworks (id, type, tier, tier_name, category, name, definition, sort_order)
VALUES
` + fwInserts.join(',\n') + `
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  name = EXCLUDED.name,
  definition = EXCLUDED.definition,
  sort_order = EXCLUDED.sort_order;

-- Insert assessments
INSERT INTO public.assessments (id, tier, pair_id, prompt, option_a_text, option_a_competency, option_b_text, option_b_competency)
VALUES
` + pairInserts.join(',\n') + `
ON CONFLICT (id) DO UPDATE SET
  prompt = EXCLUDED.prompt,
  option_a_text = EXCLUDED.option_a_text,
  option_a_competency = EXCLUDED.option_a_competency,
  option_b_text = EXCLUDED.option_b_text,
  option_b_competency = EXCLUDED.option_b_competency;
`;

fs.writeFileSync('Content Files/seed_data.sql', sql, 'utf8');
console.log('Seed SQL generated successfully!');
console.log('Frameworks inserts count:', fwInserts.length);
console.log('Assessments inserts count:', pairInserts.length);
