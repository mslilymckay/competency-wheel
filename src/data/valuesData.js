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
        definition: "Actively reaching across departmental boundaries to share knowledge, unblock peers, and solve problems together.",
        microHabit: "Reach out to one peer in an adjacent department each week to ask, 'What is one thing our team can do to unblock you?'"
      },
      {
        name: "Win-Together Culture",
        definition: "Celebrating group achievements and elevating teammates' contributions rather than seeking individual spotlight.",
        microHabit: "Publicly recognize a teammate's contribution in a group channel before claiming a project milestone."
      },
      {
        name: "Team Charters & Norms",
        definition: "Co-creating explicit group agreements on communication cadences, psychological safety, and accountability.",
        microHabit: "Review team communication norms quarterly to ensure working agreements stay fresh and explicit."
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
        definition: "Consciously viewing decisions, conflicts, and workloads through the lived experiences of colleagues and clients.",
        microHabit: "Before reacting to contentious feedback, write down the situation from the other party's point of view."
      },
      {
        name: "Supportive Presence",
        definition: "Offering compassion and practical assistance during personal or professional hardship without judgment.",
        microHabit: "Send a brief check-in message when a colleague is navigating a stressful deadline or transition."
      },
      {
        name: "Dignity in Discourse",
        definition: "Upholding mutual respect and constructive regard even during intense debate or difficult performance conversations.",
        microHabit: "Pause for 3 seconds before responding in intense discussions to frame thoughts constructively."
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
        definition: "Testing hypotheses with small, low-risk experiments and gathering real-world data before scaling.",
        microHabit: "Draft a 1-page experiment canvas before investing time in building full-scale features."
      },
      {
        name: "Embracing Ambiguity",
        definition: "Maintaining focus, enthusiasm, and decision momentum when specifications or roadmaps are incomplete.",
        microHabit: "Clarify the immediate next step rather than waiting for 100% certainty on the entire roadmap."
      },
      {
        name: "Fast Pivot Execution",
        definition: "Courageously discontinuing ineffective initiatives and redirecting resources toward newly emergent priorities.",
        microHabit: "Conduct bi-weekly backlog pruning to gracefully shelve low-impact initiatives."
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
        definition: "Communicating hard truths, operational challenges, and performance realities openly without spin.",
        microHabit: "Proactively share setbacks and key learnings in project status reviews without sugarcoating."
      },
      {
        name: "Commitment Honesty",
        definition: "Doing what you said you would do, and proactively raising flags early if commitments cannot be honored.",
        microHabit: "If a deliverable will be delayed, notify stakeholders with a revised timeline at least 24 hours in advance."
      },
      {
        name: "Ethical Safeguarding",
        definition: "Standing up for fairness, privacy, and compliance even when facing intense pressure to take shortcuts.",
        microHabit: "Speak up promptly whenever an operational decision conflicts with company policy or fairness."
      }
    ]
  }
];

export const valuesDefinitions = {};
export const valuesMicroHabits = {};

function indexDefinitions(nodes) {
  nodes.forEach(node => {
    if (node.definition) valuesDefinitions[node.name] = node.definition;
    if (node.microHabit) valuesMicroHabits[node.name] = node.microHabit;
    if (node.children) {
      indexDefinitions(node.children);
    }
  });
}
indexDefinitions(valuesFramework);
