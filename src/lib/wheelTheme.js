import { competencyFramework } from '../data/competencyData.js';
import { valuesFramework } from '../data/valuesData.js';

/**
 * Extended Brand Color Palette Reference
 * Blue:   Light Blue (#00CCFF), Deep Blue (#0B538C)
 * Pink:   Light Pink (#FFAEC9), Deep Pink (#B23267)
 * Green:  Mint Green (#82D18D), Forest Green (#1E5C32)
 * Yellow: Golden Yellow (#FFCC00), Dark Gold (#B45309)
 * Grays:  Dark Charcoal (#2A2A2A), Warm Gray (#EBE6DE), Lighter Gray (#F5F5F7)
 */
export const PALETTES = {
  blue: {
    ring1: "#0B538C",      // Deep Blue (Core / Ring 1)
    ring2: "#1D70B8",      // Mid Blue (Categories / Ring 2)
    ring3: "#00CCFF"       // Light Blue (Behaviors / Ring 3)
  },
  green: {
    ring1: "#1E5C32",      // Forest Green - Dark (Core / Ring 1)
    ring2: "#2E7D47",      // Mid Green (Categories / Ring 2)
    ring3: "#82D18D"       // Mint Green - Light (Behaviors / Ring 3)
  },
  pink: {
    ring1: "#B23267",      // Deep Pink (Core / Ring 1)
    ring2: "#D94685",      // Mid Pink (Categories / Ring 2)
    ring3: "#FFAEC9"       // Light Pink (Behaviors / Ring 3)
  },
  yellow: {
    ring1: "#B45309",      // Deep Gold (Core / Ring 1)
    ring2: "#D97706",      // Rich Amber (Categories / Ring 2)
    ring3: "#FFCC00"       // Golden Yellow (Behaviors / Ring 3)
  }
};

export const defaultCompetencyFramework = [
  {
    name: "Individual Contributor",
    shortName: "IC Tier",
    palette: PALETTES.blue,
    categories: competencyFramework[0].children
  },
  {
    name: "Manager",
    shortName: "Manager Tier",
    palette: PALETTES.green,
    categories: competencyFramework[1].children
  },
  {
    name: "Director",
    shortName: "Director Tier",
    palette: PALETTES.pink,
    categories: competencyFramework[2].children
  }
];

export const defaultValuesFramework = [
  {
    name: "Teamwork",
    palette: PALETTES.yellow,
    children: valuesFramework[0].children
  },
  {
    name: "Empathy",
    palette: PALETTES.pink,
    children: valuesFramework[1].children
  },
  {
    name: "Agility",
    palette: PALETTES.blue,
    children: valuesFramework[2].children
  },
  {
    name: "Integrity",
    palette: PALETTES.green,
    children: valuesFramework[3].children
  }
];

export const COMPETENCY_ALIASES = {
  // IC
  'Continuous Learning': 'Skill Continuous Learning',
  'Constructive Correction': 'Constructive Self-Correction',
  // Manager
  'Development Coaching': 'Developmental Coaching',
  'Resource Stewardship': 'Budget & Tool Stewardship',
  'Pathway Unblocking': 'Career Pathway Unblocking',
  'Norms Alignment': 'Agreement Alignment',
  // Director
  'Transformation Design': 'Transformation Architecture',
  'Budget Allocation': 'Macro Budget Control',
  'Succession Bench': 'Succession Pipeline',
  'Strategic Bets': 'Strategic Prioritization',
  'Change Narrative': 'Change Communication',
  'Risk Governance': 'Risk & Governance'
};

export function canonicalizeCompetency(name) {
  if (!name) return name;
  const trimmed = name.trim();
  return COMPETENCY_ALIASES[trimmed] || trimmed;
}

export function buildDefinitionMap() {
  const map = {};
  defaultCompetencyFramework.forEach(lvl => {
    map[lvl.name] = lvl.definition || "Core leadership tier.";
    lvl.categories.forEach(cat => {
      map[cat.name] = cat.definition;
      cat.children.forEach(sub => {
        map[sub.name] = sub.definition;
      });
    });
  });
  defaultValuesFramework.forEach(val => {
    map[val.name] = val.definition || "Core organizational value.";
    val.children.forEach(beh => {
      map[beh.name] = beh.definition;
    });
  });
  Object.entries(COMPETENCY_ALIASES).forEach(([alias, canonical]) => {
    if (map[canonical]) {
      map[alias] = map[canonical];
    }
  });
  return map;
}

export const allDefinitions = buildDefinitionMap();

export function buildMicroHabitsMap() {
  const map = {};
  defaultCompetencyFramework.forEach(lvl => {
    lvl.categories.forEach(cat => {
      cat.children.forEach(sub => {
        if (sub.microHabit) {
          map[sub.name] = sub.microHabit;
        }
      });
    });
  });
  defaultValuesFramework.forEach(val => {
    val.children.forEach(beh => {
      if (beh.microHabit) {
        map[beh.name] = beh.microHabit;
      }
    });
  });
  Object.entries(COMPETENCY_ALIASES).forEach(([alias, canonical]) => {
    if (map[canonical]) {
      map[alias] = map[canonical];
    }
  });
  return map;
}

export const allMicroHabits = buildMicroHabitsMap();

export function getCategoryForCompetency(competencyName, tier = 'ic') {
  if (!competencyName) return null;
  const canonical = canonicalizeCompetency(competencyName);
  const target = canonical.trim().toLowerCase();

  if (tier === 'values') {
    for (const val of defaultValuesFramework) {
      if (val.children.some(c => c.name.toLowerCase() === target)) {
        return val.name;
      }
    }
  }

  const tierName = tier === 'ic' ? 'Individual Contributor' : tier === 'manager' ? 'Manager' : 'Director';
  const tierObj = defaultCompetencyFramework.find(t => t.name === tierName);
  if (tierObj) {
    for (const cat of tierObj.categories) {
      if (cat.children.some(c => c.name.toLowerCase() === target)) {
        return cat.name;
      }
    }
  }
  for (const t of defaultCompetencyFramework) {
    for (const cat of t.categories) {
      if (cat.children.some(c => c.name.toLowerCase() === target)) {
        return cat.name;
      }
    }
  }
  for (const val of defaultValuesFramework) {
    if (val.children.some(c => c.name.toLowerCase() === target)) {
      return val.name;
    }
  }
  return null;
}

export function getSegmentThemeColor(path, levelIndex, isValues) {
  if (!path || path.length === 0) return '#0B538C';
  const rootName = path[0];
  const framework = isValues ? defaultValuesFramework : defaultCompetencyFramework;
  const rootNode = framework.find(n => n.name === rootName);
  if (!rootNode) return '#0B538C';
  if (levelIndex === 0) return rootNode.palette.ring1;
  if (levelIndex === 1) return rootNode.palette.ring2;
  return rootNode.palette.ring3;
}

/**
 * Map a competency name (from results) to its full 3-level wheel path
 */
export function getPathForCompetency(competencyName, tier = 'ic') {
  if (!competencyName) return null;
  const canonical = canonicalizeCompetency(competencyName);
  const target = canonical.trim().toLowerCase();

  if (tier === 'values') {
    for (const val of defaultValuesFramework) {
      const match = val.children.find(c => c.name.toLowerCase() === target);
      if (match) return [val.name, match.name];
    }
  } else {
    const tierName = tier === 'ic' ? 'Individual Contributor' : tier === 'manager' ? 'Manager' : 'Director';
    const tierObj = defaultCompetencyFramework.find(t => t.name === tierName);
    if (tierObj) {
      for (const cat of tierObj.categories) {
        const match = cat.children.find(c => c.name.toLowerCase() === target);
        if (match) return [tierObj.name, cat.name, match.name];
      }
    }
    // Cross-tier fallback if name matched another tier
    for (const t of defaultCompetencyFramework) {
      for (const cat of t.categories) {
        const match = cat.children.find(c => c.name.toLowerCase() === target);
        if (match) return [t.name, cat.name, match.name];
      }
    }
  }
  return null;
}
