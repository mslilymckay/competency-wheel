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
            definition: "Consistently producing thorough, error-free deliverables that meet high standards.",
            microHabit: "Establish a 5-minute pre-flight checklist before submitting any major deliverable."
          },
          {
            name: "Execution Efficiency",
            definition: "Working swiftly and eliminating unnecessary bottlenecks in daily tasks.",
            microHabit: "Timebox routine tasks into 45-minute focus sprints and eliminate non-essential review steps."
          },
          {
            name: "Timeline Reliability",
            definition: "Meeting deadlines dependably and proactively communicating progress against milestones.",
            microHabit: "Flag milestone variances 48 hours early to negotiate scope adjustments with project leads."
          }
        ]
      },
      {
        name: "Collaborative Communication",
        definition: "Sharing ideas transparently, listening actively, and working constructively across immediate team circles.",
        children: [
          {
            name: "Transparent Sharing",
            definition: "Openly conveying progress, insights, and roadblocks without withholding information.",
            microHabit: "Share a concise weekly 3-bullet progress update covering wins, risks, and next steps."
          },
          {
            name: "Active Listening",
            definition: "Attentively processing peer perspectives before formulating responses or decisions.",
            microHabit: "In discussions, summarize peer viewpoints accurately before presenting counter-proposals."
          },
          {
            name: "Constructive Teaming",
            definition: "Fostering positive, supportive working relationships across immediate team circles.",
            microHabit: "Offer proactive support to teammates encountering blockers during daily syncs."
          }
        ]
      },
      {
        name: "Problem Solving",
        definition: "Identifying tactical roadblocks and implementing immediate, practical solutions within a defined scope.",
        children: [
          {
            name: "Roadblock Diagnosis",
            definition: "Pinpointing root causes of tactical friction or system bottlenecks quickly.",
            microHabit: "Trace recurring friction points back to root causes using the '5 Whys' framework."
          },
          {
            name: "Practical Solutions",
            definition: "Implementing lean, pragmatic fixes that address immediate challenges.",
            microHabit: "Ship lean minimum-viable fixes first, then iterate towards comprehensive system refinements."
          },
          {
            name: "Scoped Execution",
            definition: "Resolving issues cleanly within agreed boundaries and operational parameters.",
            microHabit: "Define explicit boundaries before beginning problem resolution to avoid scope creep."
          }
        ]
      },
      {
        name: "Functional Expertise",
        definition: "Demonstrating core technical or specialized skills required to execute day-to-day responsibilities.",
        children: [
          {
            name: "Technical Mastery",
            definition: "Applying domain knowledge, specialized tools, and best practices with high precision.",
            microHabit: "Dedicate 60 minutes weekly to studying architecture standards and best practices."
          },
          {
            name: "Skill Continuous Learning",
            definition: "Keeping technical capabilities current through continuous practice and research.",
            microHabit: "Experiment with a new tool or workflow method on one task each bi-weekly cycle."
          },
          {
            name: "Quality Standards",
            definition: "Upholding specialized craft benchmarks and industry standards in all outputs.",
            microHabit: "Incorporate automated checks and peer reviews to uphold rigorous craft benchmarks."
          }
        ]
      },
      {
        name: "Personal Accountability",
        definition: "Owning individual deliverables, mistakes, and personal professional development goals.",
        children: [
          {
            name: "Ownership Mindset",
            definition: "Taking full end-to-end responsibility for task outcomes without finger-pointing.",
            microHabit: "Take end-to-end responsibility for task outcomes without deflecting responsibility."
          },
          {
            name: "Constructive Self-Correction",
            definition: "Transparently acknowledging mistakes and turning missteps into improvements.",
            microHabit: "Conduct personal retrospectives after setbacks to extract concrete behavioral adjustments."
          },
          {
            name: "Growth Proactivity",
            definition: "Setting self-directed development objectives to continuously level up.",
            microHabit: "Schedule 90 minutes bi-weekly dedicated strictly to stretch skill building and documentation."
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
            definition: "Guiding team members with inquiring questions rather than direct commands.",
            microHabit: "Ask open-ended questions like 'What would you try first?' before proposing solutions."
          },
          {
            name: "Actionable Feedback",
            definition: "Delivering timely, constructive, and growth-oriented performance reviews.",
            microHabit: "Deliver constructive feedback within 24 hours of an event using Situation-Behavior-Impact."
          },
          {
            name: "Career Pathway Unblocking",
            definition: "Creating visibility and opportunities for direct reports' career advancement.",
            microHabit: "Dedicate one 1:1 monthly exclusively to long-term career aspirations and sponsorship."
          }
        ]
      },
      {
        name: "Resource Optimization",
        definition: "Allocating time, budget, and tools effectively to maximize team output without burnout.",
        children: [
          {
            name: "Workload Balancing",
            definition: "Distributing responsibilities fairly to sustain peak team energy without burnout.",
            microHabit: "Audit team capacity weekly and redistribute sprint tickets to prevent burnout."
          },
          {
            name: "Budget & Tool Stewardship",
            definition: "Investing resources prudently in high-leverage tools and processes.",
            microHabit: "Review software licenses quarterly to eliminate shelfware and reallocate funds."
          },
          {
            name: "Capacity Forecasting",
            definition: "Accurately sizing team bandwidth against quarterly and annual project loads.",
            microHabit: "Track historical sprint velocity to realistically size team commitments for the next quarter."
          }
        ]
      },
      {
        name: "Conflict Resolution",
        definition: "Identifying, addressing, and resolving interpersonal or operational friction within the team early.",
        children: [
          {
            name: "Friction Detection",
            definition: "Sensing early interpersonal tension before it escalates into productivity loss.",
            microHabit: "Observe non-verbal engagement cues in meetings and schedule 1:1 check-ins immediately."
          },
          {
            name: "Neutral Mediation",
            definition: "Facilitating open dialogue and mutual understanding between opposing views.",
            microHabit: "Have both parties articulate each other's perspective before facilitating resolution."
          },
          {
            name: "Agreement Alignment",
            definition: "Securing durable commitments and shared ground on team working norms.",
            microHabit: "Document shared team working agreements in writing after resolving disagreements."
          }
        ]
      },
      {
        name: "Operational Execution",
        definition: "Translating high-level company strategies into clear, measurable milestones for the team.",
        children: [
          {
            name: "Milestone Translation",
            definition: "Deconstructing company vision into concrete, trackable team deliverables.",
            microHabit: "Map every team task back to a key company strategic objective in sprint kickoffs."
          },
          {
            name: "Metric Alignment",
            definition: "Establishing unambiguous KPIs and progress indicators for the department.",
            microHabit: "Review leading and lagging KPIs with the team bi-weekly to calibrate focus."
          },
          {
            name: "Execution Cadence",
            definition: "Running productive standups, reviews, and syncs that sustain steady velocity.",
            microHabit: "Keep daily standups under 15 minutes by deferring deep-dives to parking-lot chats."
          }
        ]
      },
      {
        name: "Empathetic Leadership",
        definition: "Prioritizing team psychological safety, active listening, and individual well-being.",
        children: [
          {
            name: "Psychological Safety",
            definition: "Building an environment where team members share bold ideas without fear.",
            microHabit: "Publicly celebrate learning from well-intentioned failed experiments."
          },
          {
            name: "Empathetic Attunement",
            definition: "Demonstrating genuine care for individuals' well-being and personal situations.",
            microHabit: "Begin 1:1s with a personal temperature check before diving into project statuses."
          },
          {
            name: "Inclusive Decisions",
            definition: "Ensuring all voices and perspectives are actively considered in team decisions.",
            microHabit: "Invite input from quieter team members by soliciting thoughts asynchronously."
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
            definition: "Identifying technological and competitive disruptions well ahead of the curve.",
            microHabit: "Dedicate 2 hours monthly to external industry research, market reports, and peer networking."
          },
          {
            name: "Vision Articulation",
            definition: "Painting an inspiring, actionable multi-year vision for the division.",
            microHabit: "Communicate the multi-year division roadmap using a crisp, 1-page narrative."
          },
          {
            name: "Strategic Prioritization",
            definition: "Making disciplined bets on transformative long-term opportunities.",
            microHabit: "Say 'no' to good ideas that do not directly advance the top 3 annual strategic pillars."
          }
        ]
      },
      {
        name: "Stakeholder Influence",
        definition: "Aligning cross-functional executive peers and driving consensus on major organizational initiatives.",
        children: [
          {
            name: "Executive Consensus",
            definition: "Rallying peer department heads behind shared enterprise initiatives.",
            microHabit: "Pre-brief key cross-functional stakeholders 1:1 before high-stakes executive proposals."
          },
          {
            name: "Narrative Framing",
            definition: "Communicating business cases compellingly to executive leadership.",
            microHabit: "Lead executive proposals with business impact and ROI before detailing technical architecture."
          },
          {
            name: "Cross-Silo Coalition",
            definition: "Dismantling organizational silos through mutual incentives and shared goals.",
            microHabit: "Establish joint OKRs with peer departments to align cross-functional incentives."
          }
        ]
      },
      {
        name: "Change Management",
        definition: "Leading large-scale structural, technical, or cultural transformations smoothly across departments.",
        children: [
          {
            name: "Transformation Architecture",
            definition: "Designing phased transition roadmaps that maintain business continuity.",
            microHabit: "Break large structural shifts into phased 90-day pilot milestones."
          },
          {
            name: "Cultural Stewardship",
            definition: "Championing organizational values and morale through periods of uncertainty.",
            microHabit: "Model organizational core values visibly in all town halls and leadership meetings."
          },
          {
            name: "Change Communication",
            definition: "Proactively answering concerns and aligning company narrative across departments.",
            microHabit: "Host open-door AMA sessions during transitions to address team concerns transparently."
          }
        ]
      },
      {
        name: "Talent Architecture",
        definition: "Designing long-term workforce capabilities, succession plans, and organizational structures.",
        children: [
          {
            name: "Org Design",
            definition: "Structuring departments and reporting lines for agility and minimal bureaucracy.",
            microHabit: "Review team topology annually to remove reporting bottlenecks and empower pods."
          },
          {
            name: "Succession Pipeline",
            definition: "Cultivating a deep bench of future leaders and high-potential contributors.",
            microHabit: "Identify and actively sponsor successors for all critical tier and lead roles."
          },
          {
            name: "Capability Modeling",
            definition: "Anticipating organizational skills needed 2-3 years into the future.",
            microHabit: "Forecast skill gaps 24 months out to guide proactive hiring and upskilling programs."
          }
        ]
      },
      {
        name: "Fiscal Governance",
        definition: "Managing macro budgets, evaluating ROI on large initiatives, and ensuring long-term financial health.",
        children: [
          {
            name: "Macro Budget Control",
            definition: "Allocating multi-million dollar departmental budgets responsibly.",
            microHabit: "Monitor division P&L monthly against revenue forecasts to adjust spend dynamically."
          },
          {
            name: "ROI Evaluation",
            definition: "Measuring quantitative and qualitative return on major capital investments.",
            microHabit: "Establish clear post-mortem ROI assessments 6 months after deploying major capital projects."
          },
          {
            name: "Risk & Governance",
            definition: "Ensuring long-term organizational solvency, risk mitigation, and compliance.",
            microHabit: "Conduct quarterly risk audits covering security, regulatory, and technical debt exposure."
          }
        ]
      }
    ]
  }
];

// Helper mappings for fast definition and micro-habit lookup
export const competencyDefinitions = {};
export const competencyMicroHabits = {};

function indexCompetencyMetadata(nodes) {
  nodes.forEach(node => {
    if (node.definition) competencyDefinitions[node.name] = node.definition;
    if (node.microHabit) competencyMicroHabits[node.name] = node.microHabit;
    if (node.children) {
      indexCompetencyMetadata(node.children);
    }
  });
}
indexCompetencyMetadata(competencyFramework);
