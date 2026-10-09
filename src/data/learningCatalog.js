/**
 * 70-20-10 Learning Activity Catalog and AI Prompt Generation Engine
 */

export const learningCatalog = {
  // 70% Experiential learning defaults
  experiential: [
    {
      type: "Project Lead",
      template: "Lead a bounded 4-week stretch initiative focused on improving {subCompetency} within your immediate scope.",
      example: "Run a team-wide project post-mortem or stakeholder intake meeting where your primary role is active listening and synthesizing actionable takeaways."
    },
    {
      type: "Process Audit",
      template: "Audit your team's current workflow for {competencyCategory} and implement one concrete simplification that saves 2+ hours weekly.",
      example: "Map out existing handoffs between team members and eliminate one redundant approval step."
    },
    {
      type: "Value in Action",
      template: "Put {value} into explicit practice by instituting a weekly team recognition ritual centered on {behavior}.",
      example: "Dedicate the first 5 minutes of your team sync to shout-outs for cross-functional collaboration and unblocking others."
    }
  ],

  // 20% Social / Exposure learning defaults
  social: [
    {
      type: "Mentorship & 1-on-1",
      template: "Conduct a 30-minute structured interview with a senior peer recognized for their {competencyCategory} to uncover their playbook.",
      example: "Ask how they navigate difficult trade-offs between timeline pressures and deliverable quality."
    },
    {
      type: "Peer Shadowing",
      template: "Shadow a colleague across another department during a high-stakes cross-functional meeting to observe how they embody {value}.",
      example: "Take notes on how they de-escalate tension and maintain active perspective-taking."
    },
    {
      type: "Feedback Loop",
      template: "Request targeted 360-degree feedback from 2 peers and your manager specifically on your {subCompetency}.",
      example: "Ask: 'What is one concrete thing I could start, stop, or continue doing to enhance my execution efficiency?'"
    }
  ],

  // 10% Formal / Educational defaults
  formal: [
    {
      type: "Curated Reading & Synthesis",
      template: "Read one seminal industry chapter or whitepaper on {competencyCategory} and write a 1-page synthesis of key principles for your team.",
      example: "Synthesize insights from 'The Culture Code' or 'Radical Candor' into three actionable meeting norms."
    },
    {
      type: "Framework Deep Dive",
      template: "Complete an interactive course or case study focusing on {subCompetency} and strategic alignment.",
      example: "Review modern OKR structuring or psychological safety frameworks (e.g., Amy Edmondson's research)."
    }
  ]
};

/**
 * Builds a tailored AI coaching prompt from user selections.
 */
export function buildAiPrompt({ level, competencies = [], values = [] }) {
  const roleTitle = level || "professional";
  const compNames = competencies.map(c => c[c.length - 1]).filter(Boolean);
  const valNames = values.map(v => v[v.length - 1]).filter(Boolean);

  const compListStr = compNames.length > 0 
    ? compNames.map(n => `[${n}]`).join(', ')
    : '[Execution Excellence]';

  const valListStr = valNames.length > 0
    ? valNames.map(v => `[${v}]`).join(', ')
    : '[Teamwork & Integrity]';

  return `I am currently working as a ${roleTitle} looking to level up my capabilities and alignment with our organizational values.

My target development focus areas:
• Competencies & Skills: ${compListStr}
• Core Values & Behaviors: ${valListStr}

Please create a tailored, pragmatic 70-20-10 Professional Development Plan for me:
1. 70% Experiential (On-the-Job): 3 concrete, high-impact stretch assignments or workplace experiments I can start this week.
2. 20% Social (Exposure & Feedback): 2 structured conversations, mentorship exercises, or shadowing opportunities to accelerate my growth.
3. 10% Formal (Education): 2 curated book chapters, foundational models, or skill frameworks to study.

Also include 3 reflective journaling prompts to help me evaluate my progress after 30 days.`;
}

/**
 * Generates CSV content from selections and action plan
 */
export function generateCsvExport({ competencies = [], values = [], definitions = {} }) {
  const rows = [];
  rows.push(['Type', 'Tier 1 (Level/Value)', 'Tier 2 (Category/Behavior)', 'Tier 3 (Sub-Competency)', 'Definition']);

  competencies.forEach(path => {
    const level = path[0] || '';
    const cat = path[1] || '';
    const sub = path[2] || '';
    const def = definitions[sub] || definitions[cat] || definitions[level] || '';
    rows.push([
      'Competency',
      `"${level.replace(/"/g, '""')}"`,
      `"${cat.replace(/"/g, '""')}"`,
      `"${sub.replace(/"/g, '""')}"`,
      `"${def.replace(/"/g, '""')}"`
    ]);
  });

  values.forEach(path => {
    const val = path[0] || '';
    const beh = path[1] || '';
    const def = definitions[beh] || definitions[val] || '';
    rows.push([
      'Value',
      `"${val.replace(/"/g, '""')}"`,
      `"${beh.replace(/"/g, '""')}"`,
      '""',
      `"${def.replace(/"/g, '""')}"`
    ]);
  });

  return rows.map(r => r.join(',')).join('\n');
}
