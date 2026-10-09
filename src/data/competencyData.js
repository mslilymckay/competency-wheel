/**
 * Competency Framework Hierarchy & Definitions
 * Ring 1 (Level) -> Ring 2 (Category) -> Ring 3 (Sub-competencies)
 */

export const competencyFramework = [
  {
    name: "Individual Contributor",
    shortName: "IC Tier",
    level: 0,
    hue: 155, sat: 65, lit: 42,
    definition: "Core foundational execution, craft mastery, proactive collaboration, and personal accountability.",
    children: [
      {
        name: "Action Orientation",
        definition: "Delivering high-quality individual work efficiently and meeting project timelines reliably.",
        children: [
          {
            name: "High-Quality Delivery",
            definition: "Consistently producing thorough, error-free deliverables that meet high standards."
          },
          {
            name: "Execution Efficiency",
            definition: "Working swiftly and eliminating unnecessary bottlenecks in daily tasks."
          },
          {
            name: "Timeline Reliability",
            definition: "Meeting deadlines dependably and proactively communicating progress against milestones."
          }
        ]
      },
      {
        name: "Collaborative Communication",
        definition: "Sharing ideas transparently, listening actively, and working constructively across immediate team circles.",
        children: [
          {
            name: "Transparent Sharing",
            definition: "Openly conveying progress, insights, and roadblocks without withholding information."
          },
          {
            name: "Active Listening",
            definition: "Attentively processing peer perspectives before formulating responses or decisions."
          },
          {
            name: "Constructive Teaming",
            definition: "Fostering positive, supportive working relationships across immediate team circles."
          }
        ]
      },
      {
        name: "Problem Solving",
        definition: "Identifying tactical roadblocks and implementing immediate, practical solutions within a defined scope.",
        children: [
          {
            name: "Roadblock Diagnosis",
            definition: "Pinpointing root causes of tactical friction or system bottlenecks quickly."
          },
          {
            name: "Practical Solutions",
            definition: "Implementing lean, pragmatic fixes that address immediate challenges."
          },
          {
            name: "Scoped Execution",
            definition: "Resolving issues cleanly within agreed boundaries and operational parameters."
          }
        ]
      },
      {
        name: "Functional Expertise",
        definition: "Demonstrating core technical or specialized skills required to execute day-to-day responsibilities.",
        children: [
          {
            name: "Technical Mastery",
            definition: "Applying domain knowledge, specialized tools, and best practices with high precision."
          },
          {
            name: "Skill Continuous Learning",
            definition: "Keeping technical capabilities current through continuous practice and research."
          },
          {
            name: "Quality Standards",
            definition: "Upholding specialized craft benchmarks and industry standards in all outputs."
          }
        ]
      },
      {
        name: "Personal Accountability",
        definition: "Owning individual deliverables, mistakes, and personal professional development goals.",
        children: [
          {
            name: "Ownership Mindset",
            definition: "Taking full end-to-end responsibility for task outcomes without finger-pointing."
          },
          {
            name: "Constructive Self-Correction",
            definition: "Transparently acknowledging mistakes and turning missteps into improvements."
          },
          {
            name: "Growth Proactivity",
            definition: "Setting self-directed development objectives to continuously level up."
          }
        ]
      }
    ]
  },
  {
    name: "Manager",
    shortName: "Manager Tier",
    level: 0,
    hue: 205, sat: 75, lit: 44,
    definition: "People enablement, operational orchestration, team psychological safety, and resource optimization.",
    children: [
      {
        name: "Performance Enablement",
        definition: "Coaching direct reports, providing actionable feedback, and unblocking career growth paths.",
        children: [
          {
            name: "Developmental Coaching",
            definition: "Guiding team members with inquiring questions rather than direct commands."
          },
          {
            name: "Actionable Feedback",
            definition: "Delivering timely, constructive, and growth-oriented performance reviews."
          },
          {
            name: "Career Pathway Unblocking",
            definition: "Creating visibility and opportunities for direct reports' career advancement."
          }
        ]
      },
      {
        name: "Resource Optimization",
        definition: "Allocating time, budget, and tools effectively to maximize team output without burnout.",
        children: [
          {
            name: "Workload Balancing",
            definition: "Distributing responsibilities fairly to sustain peak team energy without burnout."
          },
          {
            name: "Budget & Tool Stewardship",
            definition: "Investing resources prudently in high-leverage tools and processes."
          },
          {
            name: "Capacity Forecasting",
            definition: "Accurately sizing team bandwidth against quarterly and annual project loads."
          }
        ]
      },
      {
        name: "Conflict Resolution",
        definition: "Identifying, addressing, and resolving interpersonal or operational friction within the team early.",
        children: [
          {
            name: "Friction Detection",
            definition: "Sensing early interpersonal tension before it escalates into productivity loss."
          },
          {
            name: "Neutral Mediation",
            definition: "Facilitating open dialogue and mutual understanding between opposing views."
          },
          {
            name: "Agreement Alignment",
            definition: "Securing durable commitments and shared ground on team working norms."
          }
        ]
      },
      {
        name: "Operational Execution",
        definition: "Translating high-level company strategies into clear, measurable milestones for the team.",
        children: [
          {
            name: "Milestone Translation",
            definition: "Deconstructing company vision into concrete, trackable team deliverables."
          },
          {
            name: "Metric Alignment",
            definition: "Establishing unambiguous KPIs and progress indicators for the department."
          },
          {
            name: "Execution Cadence",
            definition: "Running productive standups, reviews, and syncs that sustain steady velocity."
          }
        ]
      },
      {
        name: "Empathetic Leadership",
        definition: "Prioritizing team psychological safety, active listening, and individual well-being.",
        children: [
          {
            name: "Psychological Safety",
            definition: "Building an environment where team members share bold ideas without fear."
          },
          {
            name: "Empathetic Attunement",
            definition: "Demonstrating genuine care for individuals' well-being and personal situations."
          },
          {
            name: "Inclusive Decisions",
            definition: "Ensuring all voices and perspectives are actively considered in team decisions."
          }
        ]
      }
    ]
  },
  {
    name: "Director",
    shortName: "Director Tier",
    level: 0,
    hue: 275, sat: 65, lit: 46,
    definition: "Strategic foresight, cross-functional stakeholder influence, cultural stewardship, and enterprise governance.",
    children: [
      {
        name: "Strategic Foresight",
        definition: "Anticipating industry shifts, market trends, and long-term organizational opportunities to set vision.",
        children: [
          {
            name: "Horizon Scanning",
            definition: "Identifying technological and competitive disruptions well ahead of the curve."
          },
          {
            name: "Vision Articulation",
            definition: "Painting an inspiring, actionable multi-year vision for the division."
          },
          {
            name: "Strategic Prioritization",
            definition: "Making disciplined bets on transformative long-term opportunities."
          }
        ]
      },
      {
        name: "Stakeholder Influence",
        definition: "Aligning cross-functional executive peers and driving consensus on major organizational initiatives.",
        children: [
          {
            name: "Executive Consensus",
            definition: "Rallying peer department heads behind shared enterprise initiatives."
          },
          {
            name: "Narrative Framing",
            definition: "Communicating business cases compellingly to executive leadership."
          },
          {
            name: "Cross-Silo Coalition",
            definition: "Dismantling organizational silos through mutual incentives and shared goals."
          }
        ]
      },
      {
        name: "Change Management",
        definition: "Leading large-scale structural, technical, or cultural transformations smoothly across departments.",
        children: [
          {
            name: "Transformation Architecture",
            definition: "Designing phased transition roadmaps that maintain business continuity."
          },
          {
            name: "Cultural Stewardship",
            definition: "Championing organizational values and morale through periods of uncertainty."
          },
          {
            name: "Change Communication",
            definition: "Proactively answering concerns and aligning company narrative across departments."
          }
        ]
      },
      {
        name: "Talent Architecture",
        definition: "Designing long-term workforce capabilities, succession plans, and organizational structures.",
        children: [
          {
            name: "Org Design",
            definition: "Structuring departments and reporting lines for agility and minimal bureaucracy."
          },
          {
            name: "Succession Pipeline",
            definition: "Cultivating a deep bench of future leaders and high-potential contributors."
          },
          {
            name: "Capability Modeling",
            definition: "Anticipating organizational skills needed 2-3 years into the future."
          }
        ]
      },
      {
        name: "Fiscal Governance",
        definition: "Managing macro budgets, evaluating ROI on large initiatives, and ensuring long-term financial health.",
        children: [
          {
            name: "Macro Budget Control",
            definition: "Allocating multi-million dollar departmental budgets responsibly."
          },
          {
            name: "ROI Evaluation",
            definition: "Measuring quantitative and qualitative return on major capital investments."
          },
          {
            name: "Risk & Governance",
            definition: "Ensuring long-term organizational solvency, risk mitigation, and compliance."
          }
        ]
      }
    ]
  }
];

// Helper mapping for fast definition lookup
export const competencyDefinitions = {};

function indexDefinitions(nodes) {
  nodes.forEach(node => {
    competencyDefinitions[node.name] = node.definition;
    if (node.children) {
      indexDefinitions(node.children);
    }
  });
}
indexDefinitions(competencyFramework);
