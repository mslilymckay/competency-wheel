/**
 * Curated 70-20-10 Learning Interventions, Reflections & Manager Enablement Catalog
 * Mapped to Competency & Values Framework with dynamic procedural fallbacks.
 */

import { allMicroHabits, allDefinitions, canonicalizeCompetency, getCategoryForCompetency } from '../lib/wheelTheme.js';

export const curatedInterventions = {
  "Timeline Reliability": {
    experiential: {
      title: "Cross-Functional Milestone Tracker",
      action: "Act as milestone tracker for a cross-functional project for two weeks, synthesizing Friday status updates.",
      reflection: "What patterns emerged in how peers estimated capacity versus actual output?",
      tag: "Project Lead",
      context: "Sprint Cycle"
    },
    social: {
      title: "Senior PM Playbook Interview",
      action: "Interview a senior project manager to learn their techniques for estimating duration and managing scope creep.",
      reflection: "Which tactical routine can you implement tomorrow?",
      tag: "Mentorship",
      context: "1-on-1 Inquiry"
    },
    formal: {
      title: "Agile Estimation Foundations",
      action: "Complete a foundational module on Agile sprint planning and velocity tracking.",
      reflection: "Where does your task management deviate most significantly from established Agile principles?",
      tag: "Agile Framework",
      context: "Self-Paced Module"
    },
    managerUnblocker: "Formally announce the employee's temporary tracking role to the project team to establish authority and ensure compliance.",
    managerCoachingQuestion: "In our next bi-weekly check-in, let's review your first Friday milestone synthesis together to calibrate tone and cross-functional expectations."
  },

  "Active Listening": {
    experiential: {
      title: "The 3-Voice Pause Technique",
      action: "In your next three meetings, intentionally wait to speak until at least three others have shared perspectives.",
      reflection: "What new ideas or points of view did this surface that might have otherwise been missed?",
      tag: "Meeting Practice",
      context: "Team Syncs"
    },
    social: {
      title: "Radical Candor Peer Feedback",
      action: "Ask a trusted peer for unfiltered feedback on whether you interrupt or rush to solutions during brainstorms.",
      reflection: "What physical or verbal cue can remind you to pause before formulating counter-arguments?",
      tag: "Peer Feedback",
      context: "Safe Feedback Loop"
    },
    formal: {
      title: "Tactical Empathy & W.A.I.T.",
      action: "Study the 'W.A.I.T. (Why Am I Talking)' framework and tactical empathy techniques for active listening.",
      reflection: "During which recurring meeting are you most susceptible to speaking out of turn, and why?",
      tag: "Framework Study",
      context: "Behavioral Model"
    },
    managerUnblocker: "Privately suggest two safe, constructive peers the employee could approach for the feedback exercise and encourage their participation.",
    managerCoachingQuestion: "What differences did you notice in group energy or engagement when you held back from speaking first?"
  },

  "Practical Solutions": {
    experiential: {
      title: "Workflow Automation / Template Sprint",
      action: "Identify one recurring manual task and build a basic automation, template, or checklist to resolve it this week.",
      reflection: "How many hours per month will this fix save for you and the broader team?",
      tag: "Quick Win",
      context: "Operational Lean"
    },
    social: {
      title: "Peer Stress-Testing Review",
      action: "Present a draft solution to a persistent problem in a peer review, asking the group to poke holes in your logic.",
      reflection: "Which critique improved the final iteration most, and how did you manage defensiveness?",
      tag: "Peer Review",
      context: "Collaborative Design"
    },
    formal: {
      title: "MVP Problem-Solving Case Study",
      action: "Read a case study on using a 'minimum viable product' (MVP) approach to resolve an operational bottleneck.",
      reflection: "How can you apply lean prototyping principles to a deliverable right now?",
      tag: "Case Study",
      context: "Agile Problem Solving"
    },
    managerUnblocker: "Protect two hours of the employee's schedule this week strictly dedicated to building and testing their workflow automation.",
    managerCoachingQuestion: "Where else in the department could this template or automation be leveraged once validated?"
  },

  "Continuous Learning": {
    experiential: {
      title: "Tool / Methodology Beta Pilot",
      action: "Volunteer to beta-test a new software tool or methodology the department is considering adopting.",
      reflection: "What onboarding hurdles did you experience that you can help the team avoid?",
      tag: "Pilot Lead",
      context: "Innovation Test"
    },
    social: {
      title: "15-Minute Craft Tech Talk",
      action: "Lead a 15-minute presentation or asynchronous thread summarizing a recent industry trend or tool update.",
      reflection: "What follow-up questions from peers revealed gaps in your own understanding?",
      tag: "Knowledge Sharing",
      context: "Team All-Hands"
    },
    formal: {
      title: "Specialized Domain Credential",
      action: "Complete a specialized micro-credential or technical module directly relevant to your domain.",
      reflection: "How does this conceptual knowledge alter your approach to a current in-flight project?",
      tag: "Credential / Cert",
      context: "Structured Course"
    },
    managerUnblocker: "Add the employee's 15-minute presentation to the official agenda for the upcoming department all-hands meeting.",
    managerCoachingQuestion: "How can we turn what you learned into an internal standard operating procedure for the rest of the group?"
  },

  "Constructive Correction": {
    experiential: {
      title: "Blameless Post-Mortem Briefing",
      action: "Distribute an objective 'lessons learned' document following a recent deliverable that missed a target or deadline.",
      reflection: "Which gap was structural/systemic versus driven by individual execution errors?",
      tag: "Accountability",
      context: "Team Retrospective"
    },
    social: {
      title: "Controllables-Only Mentorship Sync",
      action: "Discuss a recent misstep with a mentor, focusing strictly on variables within your direct control.",
      reflection: "What specific action will you take differently when a similar variable arises in the future?",
      tag: "Mentorship",
      context: "1-on-1 Mentorship"
    },
    formal: {
      title: "Psychological Safety & Growth Mindset",
      action: "Review organizational research on Amy Edmondson's psychological safety and Carol Dweck's growth mindset.",
      reflection: "In what scenario last week did you exhibit a fixed mindset reaction, and what triggered it?",
      tag: "Research Synthesis",
      context: "Academic Research"
    },
    managerUnblocker: "Publicly thank the employee in a team setting for sharing their 'lessons learned' document to reinforce a culture of psychological safety.",
    managerCoachingQuestion: "What systemic support or guardrail can I put in place to ensure this failure mode doesn't happen again?"
  }
};

/**
 * Builds a complete blueprint object for any competency or value behavior,
 * pulling from the curated catalog if available, or generating a high-quality contextual fallback.
 */
export function getBlueprintForCompetency(competencyName, tier = 'ic') {
  if (!competencyName) return null;
  const canonical = canonicalizeCompetency(competencyName);
  
  // 1. Daily Micro-Habit (Day 1 Ritual)
  const microHabit = allMicroHabits[canonical] || allMicroHabits[competencyName] || "Practice daily behavioral consistency in this domain.";
  const definition = allDefinitions[canonical] || allDefinitions[competencyName] || "Core organizational competency benchmark.";
  const category = getCategoryForCompetency(canonical, tier) || getCategoryForCompetency(competencyName, tier) || (tier === 'values' ? 'Core Value' : 'Competency Area');

  // 2. Check Curated Interventions
  const curated = curatedInterventions[canonical] || curatedInterventions[competencyName];
  if (curated) {
    return {
      name: canonical,
      category,
      definition,
      microHabit,
      ...curated
    };
  }

  // 3. Fallback Generation for other skills/values
  const isValues = tier === 'values';
  return {
    name: canonical,
    category,
    definition,
    microHabit,
    experiential: {
      title: isValues ? `${canonical} in Action` : `${canonical} Stretch Initiative`,
      action: isValues
        ? `Lead a bounded 2-week team experiment actively modeling '${canonical}' during daily project deliverables and team interactions.`
        : `Take ownership of a bounded 2-week stretch assignment focused on elevating your '${canonical}' performance.`,
      reflection: `What operational or communication friction did you encounter, and how did you navigate it?`,
      tag: "Experiential Lead",
      context: "On-the-Job Practice"
    },
    social: {
      title: "Senior Peer Inquiry & Calibration",
      action: `Conduct a 30-minute structured interview with a colleague recognized for exemplary ${canonical} to unpack their personal playbook.`,
      reflection: `What is one practical habit or boundary they model that you can implement this week?`,
      tag: "Mentorship",
      context: "1-on-1 Shadowing"
    },
    formal: {
      title: "Foundational Model & Case Study",
      action: `Study a seminal article, industry standard, or case study directly analyzing ${canonical} in high-performing teams.`,
      reflection: `Where does your current working style diverge most from established best practices?`,
      tag: "Formal Study",
      context: "Framework Analysis"
    },
    managerUnblocker: `Protect 2 hours of focused schedule bandwidth this sprint for the employee's development, and provide feedback on their initial experiment.`,
    managerCoachingQuestion: `What specific roadblock can I help clear so you have the authority and time to execute on this growth objective?`
  };
}

/**
 * Builds the comprehensive AI Coaching Prompt (Google Gemini Ready)
 */
export function buildTailoredPrompt({ level = "Professional", blueprints = [] }) {
  const compLines = blueprints.map(bp => {
    return `• ${bp.name} (${bp.category})
    - Daily Micro-Habit: "${bp.microHabit}"
    - 70% Experiential Target: ${bp.experiential.action}
    - 20% Social Mentorship: ${bp.social.action}
    - 10% Formal Study: ${bp.formal.action}
    - Manager Alignment: ${bp.managerUnblocker}`;
  }).join('\n\n');

  return `I am currently working as a ${level} looking to accelerate my leadership growth and alignment with our organizational values.

Here are my selected target focus areas and 70-20-10 growth blueprint:

${compLines}

Please act as an executive leadership coach and generate:
1. A 30-Day Milestone Sprint Roadmap breaking down the experiential assignments above into week-by-week deliverables.
2. A Manager 1-on-1 Alignment Script: 3 targeted questions I can bring to my manager to secure their sponsorship and unblocking commitments.
3. 3 Reflective Journaling Prompts for my 30-day self-evaluation to measure behavioral change.`;
}
