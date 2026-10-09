/**
 * Core Values Hierarchy & Definitions
 * Ring 1 (Value) -> Ring 2 (Behaviors)
 */

export const valuesFramework = [
  {
    name: "Teamwork",
    hue: 38, sat: 90, lit: 46, // Warm Amber
    definition: "Prioritizing collective success over individual praise and actively breaking down organizational silos.",
    children: [
      {
        name: "Cross-Functional Teaming",
        definition: "Actively reaching across departmental boundaries to share knowledge, unblock peers, and solve problems together."
      },
      {
        name: "Win-Together Culture",
        definition: "Celebrating group achievements and elevating teammates' contributions rather than seeking individual spotlight."
      },
      {
        name: "Team Charters & Norms",
        definition: "Co-creating explicit group agreements on communication cadences, psychological safety, and accountability."
      }
    ]
  },
  {
    name: "Empathy",
    hue: 345, sat: 75, lit: 48, // Compassionate Rose
    definition: "Practicing active perspective-taking, psychological attunement, and treating everyone with fundamental dignity.",
    children: [
      {
        name: "Active Perspective-Taking",
        definition: "Consciously viewing decisions, conflicts, and workloads through the lived experiences of colleagues and clients."
      },
      {
        name: "Supportive Presence",
        definition: "Offering compassion and practical assistance during personal or professional hardship without judgment."
      },
      {
        name: "Dignity in Discourse",
        definition: "Upholding mutual respect and constructive regard even during intense debate or difficult performance conversations."
      }
    ]
  },
  {
    name: "Agility",
    hue: 175, sat: 70, lit: 40, // Nimble Teal
    definition: "Adapting quickly to shifting business environments and viewing unexpected change as a strategic opportunity.",
    children: [
      {
        name: "Rapid Iteration",
        definition: "Testing hypotheses with small, low-risk experiments and gathering real-world data before scaling."
      },
      {
        name: "Embracing Ambiguity",
        definition: "Maintaining focus, enthusiasm, and decision momentum when specifications or roadmaps are incomplete."
      },
      {
        name: "Fast Pivot Execution",
        definition: "Courageously discontinuing ineffective initiatives and redirecting resources toward newly emergent priorities."
      }
    ]
  },
  {
    name: "Integrity",
    hue: 245, sat: 70, lit: 50, // Principled Indigo
    definition: "Maintaining unwavering ethical standards, transparency, and honesty in all business dealings and interactions.",
    children: [
      {
        name: "Radical Transparency",
        definition: "Communicating hard truths, operational challenges, and performance realities openly without spin."
      },
      {
        name: "Commitment Honesty",
        definition: "Doing what you said you would do, and proactively raising flags early if commitments cannot be honored."
      },
      {
        name: "Ethical Safeguarding",
        definition: "Standing up for fairness, privacy, and compliance even when facing intense pressure to take shortcuts."
      }
    ]
  }
];

export const valuesDefinitions = {};

function indexDefinitions(nodes) {
  nodes.forEach(node => {
    valuesDefinitions[node.name] = node.definition;
    if (node.children) {
      indexDefinitions(node.children);
    }
  });
}
indexDefinitions(valuesFramework);
