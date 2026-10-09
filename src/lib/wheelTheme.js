import { competencyFramework } from '../data/competencyData.js';
import { valuesFramework } from '../data/valuesData.js';

export const PALETTES = {
  blue: {
    ring1: "#1d4ed8",      // Core (Blue 700)
    ring2: "#3b82f6",      // Secondary (Blue 500)
    ring3: "#60a5fa"       // Tertiary (Blue 400)
  },
  green: {
    ring1: "#15803d",      // Core (Green 700)
    ring2: "#22c55e",      // Secondary (Green 500)
    ring3: "#4ade80"       // Tertiary (Green 400)
  },
  yellow: {
    ring1: "#d97706",      // Core (Amber 600)
    ring2: "#f59e0b",      // Secondary (Amber 500)
    ring3: "#fbbf24"       // Tertiary (Amber 400)
  },
  rose: {
    ring1: "#be185d",      // Rose 700
    ring2: "#e11d48",      // Rose 600
    ring3: "#f43f5e"       // Rose 500
  },
  slateGrey: {
    ring1: "#475569",
    ring2: "#64748b",
    ring3: "#94a3b8"
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
    palette: PALETTES.yellow,
    categories: competencyFramework[2].children
  }
];

export const defaultValuesFramework = [
  {
    name: "Teamwork",
    palette: { ring1: "#d97706", ring2: "#f59e0b", ring3: "#fbbf24" },
    children: valuesFramework[0].children
  },
  {
    name: "Empathy",
    palette: { ring1: "#be185d", ring2: "#e11d48", ring3: "#f43f5e" },
    children: valuesFramework[1].children
  },
  {
    name: "Agility",
    palette: { ring1: "#0f766e", ring2: "#14b8a6", ring3: "#2dd4bf" },
    children: valuesFramework[2].children
  },
  {
    name: "Integrity",
    palette: { ring1: "#4338ca", ring2: "#6366f1", ring3: "#818cf8" },
    children: valuesFramework[3].children
  }
];

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
  return map;
}

export const allDefinitions = buildDefinitionMap();

export function getSegmentThemeColor(path, levelIndex, isValues) {
  if (!path || path.length === 0) return '#1d4ed8';
  const rootName = path[0];
  const framework = isValues ? defaultValuesFramework : defaultCompetencyFramework;
  const rootNode = framework.find(n => n.name === rootName);
  if (!rootNode) return '#1d4ed8';
  if (levelIndex === 0) return rootNode.palette.ring1;
  if (levelIndex === 1) return rootNode.palette.ring2;
  return rootNode.palette.ring3;
}
