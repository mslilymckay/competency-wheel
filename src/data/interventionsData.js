/**
 * Curated 70-20-10 Learning Interventions, Reflections & Manager Enablement Catalog
 * Mapped to Competency & Values Framework with dynamic procedural fallbacks.
 */

import { allMicroHabits, allDefinitions, canonicalizeCompetency, getCategoryForCompetency } from '../lib/wheelTheme.js';

export const curatedInterventions = {
  // =========================================================================
  // ACTION ORIENTATION
  // =========================================================================

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

  "High-Quality Delivery": {
    experiential: {
      title: "Formal Pre-Flight Self-QA Checklist",
      action: "Implement a formal 'self-QA' checklist before submitting your next three major deliverables.",
      reflection: "Which recurring error did this checklist catch before it reached the broader team?",
      tag: "Quality Assurance",
      context: "Pre-Submission Protocol"
    },
    social: {
      title: "Mutual High-Detail Peer Review",
      action: "Partner with a peer known for high attention to detail and conduct a mutual review of each other's work prior to final submission.",
      reflection: "What specific formatting or structural choice did your peer make that you can adopt? What did you see in their work that you could emulate?",
      tag: "Peer Review",
      context: "Partner Exchange"
    },
    formal: {
      title: "Lean Six Sigma Mistake-Proofing (Poka-Yoke)",
      action: "Read an article or module on Lean Six Sigma principles related to defect reduction in knowledge work.",
      reflection: "How can you apply the concept of 'poka-yoke' (mistake-proofing) to your daily routine?",
      tag: "Lean Methodology",
      context: "Defect Reduction"
    },
    managerUnblocker: "Allocate an extra 10% buffer time to the employee's next deadline specifically designated for comprehensive self-review.",
    managerCoachingQuestion: "Which recurring error caught by your self-QA checklist surprised you most, and how can we turn that check into a team-wide standard?"
  },

  "Execution Efficiency": {
    experiential: {
      title: "Calendar Audit & Async Optimization",
      action: "Audit your calendar for the next two weeks and decline or propose async alternatives for any meeting where you aren't an active contributor.",
      reflection: "How many hours were reclaimed, and how were they reallocated?",
      tag: "Time Management",
      context: "Schedule Streamlining"
    },
    social: {
      title: "Productivity Champion Shadowing",
      action: "Shadow a highly productive peer for half a day to observe how they manage their inbox, task list, and context-switching.",
      reflection: "What boundary-setting technique did they use that you often struggle with?",
      tag: "Peer Shadowing",
      context: "Workflow Observation"
    },
    formal: {
      title: "Deep Work & Eisenhower Prioritization",
      action: "Review the Eisenhower Matrix or 'Deep Work' principles for prioritizing high-impact tasks.",
      reflection: "Which quadrant of the matrix do you default to when feeling overwhelmed?",
      tag: "Focus Framework",
      context: "Task Prioritization"
    },
    managerUnblocker: "Support the employee in declining non-essential meetings and formally approve their proposed asynchronous communication channels.",
    managerCoachingQuestion: "How many reclaimed hours were you able to convert into uninterrupted deep work this week, and how can I help protect those blocks?"
  },

  // =========================================================================
  // COLLABORATIVE COMMUNICATION
  // =========================================================================

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

  "Transparent Sharing": {
    experiential: {
      title: "Working Out Loud Weekly Sync",
      action: "Start a 'working out loud' habit by posting a brief, bulleted weekly update of your progress, blockers, and next steps in a public team channel.",
      reflection: "What unanticipated help or resources did this visibility unlock?",
      tag: "Public Update",
      context: "Async Channel"
    },
    social: {
      title: "Cross-Functional Information Audit",
      action: "Ask a cross-functional partner if there is a piece of data or context your team holds that would make their job easier if shared regularly.",
      reflection: "Where were you making assumptions about what others already knew?",
      tag: "Stakeholder Inquiry",
      context: "Cross-Team Alignment"
    },
    formal: {
      title: "Radical Transparency Case Study",
      action: "Read a case study on organizations that practice 'Radical Transparency' and open-source internal communication.",
      reflection: "What is the line between helpful transparency and over-communication in your current environment?",
      tag: "Case Study",
      context: "Communication Strategy"
    },
    managerUnblocker: "Be the first to comment on and celebrate the employee's weekly public update to signal that this behavior is highly valued.",
    managerCoachingQuestion: "What feedback or unanticipated cross-functional assistance came in after sharing your working-out-loud update this week?"
  },

  "Constructive Teaming": {
    experiential: {
      title: "Proactive Peer Partnership & Support",
      action: "Identify a peer you have experienced recent friction with and proactively offer to assist them with one of their current high-priority tasks.",
      reflection: "How did shifting from a transactional to a supportive posture change the dynamic?",
      tag: "Relationship Building",
      context: "Direct Collaboration"
    },
    social: {
      title: "Team Recognition & Kudos Facilitation",
      action: "Facilitate a brief 'kudos' segment at the start of your next team meeting, explicitly recognizing the hidden work of two peers.",
      reflection: "How did acknowledging others' contributions impact the group's overall energy?",
      tag: "Recognition Ritual",
      context: "Team Meeting"
    },
    formal: {
      title: "Tuckman Model of Team Dynamics",
      action: "Study the Tuckman model of team development (Forming, Storming, Norming, Performing).",
      reflection: "Which phase is your immediate team currently in, and what specific behavior is needed to advance?",
      tag: "Organizational Theory",
      context: "Team Development"
    },
    managerUnblocker: "Delegate a small, low-risk collaborative task entirely to this employee and a peer they need to build better rapport with.",
    managerCoachingQuestion: "How did stepping in to support your peer shift the collaboration dynamic, and what can we do to keep that momentum going?"
  },

  // =========================================================================
  // PROBLEM SOLVING
  // =========================================================================

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

  "Roadblock Diagnosis": {
    experiential: {
      title: "Visual Workflow Bottleneck Mapping",
      action: "The next time a process stalls, map the exact workflow on a whiteboard or virtual canvas to identify the specific step where the breakdown occurred, before proposing a fix.",
      reflection: "Did the visual map reveal a different root cause than your initial assumption?",
      tag: "Process Mapping",
      context: "Visual Diagnostics"
    },
    social: {
      title: "5 Whys Root-Cause Facilitation",
      action: "Facilitate a '5 Whys' root-cause analysis session with a small group of peers regarding a recent project delay.",
      reflection: "At which 'Why' did the team's consensus start to fracture?",
      tag: "Root Cause Analysis",
      context: "Peer Retrospective"
    },
    formal: {
      title: "Systems Thinking: Symptoms vs. Root Causes",
      action: "Complete a brief module on Systems Thinking and distinguishing between symptoms and root causes.",
      reflection: "Which recurring team complaint is actually just a symptom of a deeper structural issue?",
      tag: "Systems Thinking",
      context: "Diagnostic Framework"
    },
    managerUnblocker: "During the next 1-on-1, resist giving the employee the answer to a blocker; instead, ask them to visually step through the issue with you.",
    managerCoachingQuestion: "When you stepped through the workflow map, what structural variable surfaced that wasn't visible in the initial post-mortem?"
  },

  "Scoped Execution": {
    experiential: {
      title: "Rigid 'Out-of-Scope' Boundary Negotiation",
      action: "Draft a rigid 'out of scope' list alongside your next project plan, and explicitly negotiate it with stakeholders before beginning work.",
      reflection: "Which out-of-scope item was hardest to defend? What was the outcome, and why?",
      tag: "Scope Management",
      context: "Stakeholder Alignment"
    },
    social: {
      title: "Scope Negotiation & Boundary Playbook",
      action: "Interview a project manager or senior IC about how they gracefully say 'no' to scope creep without alienating stakeholders.",
      reflection: "What specific phrasing can you adopt to protect your operational boundaries?",
      tag: "Mentorship",
      context: "Tactical Inquiry"
    },
    formal: {
      title: "Agile Scope Control & Anti-Gold-Plating",
      action: "Review documentation on Agile scope management and the concept of 'gold plating' in project deliverables.",
      reflection: "In what area are you most likely to over-deliver at the expense of efficiency?",
      tag: "Agile Governance",
      context: "Best Practice Guide"
    },
    managerUnblocker: "Act as an escalation point to defend the employee's defined scope if stakeholders attempt to bypass the agreed-upon boundaries.",
    managerCoachingQuestion: "What stakeholder pressures challenged your 'out-of-scope' list, and how can I reinforce your boundaries in project steering reviews?"
  },

  // =========================================================================
  // FUNCTIONAL EXPERTISE
  // =========================================================================

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

  "Technical Mastery": {
    experiential: {
      title: "Advanced Toolset Feature Stretch Task",
      action: "Take on a complex stretch task that requires you to use an advanced feature or technique within your core toolset that you haven't mastered yet.",
      reflection: "How did pushing the tool's limits change your perspective on its everyday utility?",
      tag: "Technical Stretch",
      context: "Core Architecture"
    },
    social: {
      title: "SME Co-Working & Pair-Programming",
      action: "Pair-program or co-work with a recognized subject matter expert on a complex deliverable for one hour.",
      reflection: "What keyboard shortcut, mental model, or micro-habit did the expert use that you can adopt?",
      tag: "Pair Collaboration",
      context: "Expert Observation"
    },
    formal: {
      title: "Core Platform Technical Deep-Dive",
      action: "Read the official technical documentation or release notes for a core platform your team relies on.",
      reflection: "Which underutilized feature could solve a current team pain point?",
      tag: "Technical Docs",
      context: "System Mastery"
    },
    managerUnblocker: "Route a high-complexity, non-urgent ticket or request specifically to this employee to allow them room to practice the advanced skill.",
    managerCoachingQuestion: "What advanced technique or micro-habit from your pairing session can we incorporate into our internal engineering/craft guides?"
  },

  "Quality Standards": {
    experiential: {
      title: "Definition of Done (DoD) Standard Rubric",
      action: "Create a strict 'definition of done' rubric for your most common deliverable and apply it for one month.",
      reflection: "How did standardizing the benchmark reduce the mental fatigue of finishing a task?",
      tag: "Craft Standards",
      context: "Operational Rubric"
    },
    social: {
      title: "Stakeholder Quality Calibration Interview",
      action: "Ask an internal stakeholder (client) to rate your recent deliverables against their expected quality standards and explain any gaps.",
      reflection: "Where did your definition of 'quality' misalign with the stakeholder's actual needs?",
      tag: "Client Feedback",
      context: "Stakeholder Sync"
    },
    formal: {
      title: "Cost of Poor Quality (COPQ) & Velocity Study",
      action: "Study the concept of 'Cost of Poor Quality' (COPQ) and how rework impacts organizational velocity.",
      reflection: "Calculate a rough estimate of how much time was lost to rework on your last major project.",
      tag: "Quality Management",
      context: "Operational Economics"
    },
    managerUnblocker: "Review and formally endorse the employee's 'definition of done' rubric so they have leadership backing when enforcing it.",
    managerCoachingQuestion: "Where did stakeholder quality perceptions differ from your baseline rubric, and how can we bridge that expectations gap?"
  },

  // =========================================================================
  // PERSONAL ACCOUNTABILITY
  // =========================================================================

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
  },

  "Ownership Mindset": {
    experiential: {
      title: "End-to-End DRI Ownership Initiative",
      action: "Volunteer to act as the single directly responsible individual (DRI) for an ambiguous, unowned internal initiative from end to end.",
      reflection: "How did being the final point of accountability change your decision-making speed?",
      tag: "Direct Accountability",
      context: "Internal Initiative"
    },
    social: {
      title: "Vulnerable Decision Post-Mortem",
      action: "Present a project post-mortem to the team where you explicitly highlight a decision you made that failed, and the steps you took to recover it.",
      reflection: "How did owning the failure publicly impact the team's trust in your leadership?",
      tag: "Transparent Review",
      context: "Team All-Hands"
    },
    formal: {
      title: "Extreme Ownership: Driver vs. Passenger Mindset",
      action: "Read 'Extreme Ownership' concepts or literature on the psychological transition from a passenger to a driver in the workplace.",
      reflection: "Where are you currently blaming external circumstances for a lack of progress?",
      tag: "Leadership Literature",
      context: "Accountability Principles"
    },
    managerUnblocker: "Assign the employee a specific DRI role and publicly step back, explicitly directing team questions to the employee.",
    managerCoachingQuestion: "As the single DRI on this initiative, what decision felt riskiest to make independently, and how did stepping into full ownership feel?"
  },

  "Growth Proactivity": {
    experiential: {
      title: "Targeted Stretch Project & Learning Cohort",
      action: "Work with your manager to identify a stretch project or technical cohort to drive your continued growth.",
      reflection: "What did you learn, and what types of experiences yielded the highest retention for you?",
      tag: "Growth Stretch",
      context: "Development Goal"
    },
    social: {
      title: "Cross-Departmental Career Exploration Chat",
      action: "Schedule a 'career exploration' coffee chat with a leader in a different department whose career trajectory you admire.",
      reflection: "What non-linear lateral move did they make that accelerated their long-term growth?",
      tag: "Career Mentorship",
      context: "Informational Interview"
    },
    formal: {
      title: "SMART Goals & Individual Development Planning (IDP)",
      action: "Complete a module on creating SMART goals and individual development plans (IDPs).",
      reflection: "Is your current career goal actionable within the next six months, or is it too vague?",
      tag: "Goal Setting",
      context: "Personal Growth Framework"
    },
    managerUnblocker: "Dedicate a full 1-on-1 exclusively to reviewing the employee's self-directed project ideas and connecting them with relevant cross-departmental mentors.",
    managerCoachingQuestion: "Which insights from your cross-departmental coffee chat resonated most with where you want your career to head over the next 12 to 18 months?"
  }
};

// Aliases matching canonical names in competencyData.js and assessmentData.js
curatedInterventions["Skill Continuous Learning"] = curatedInterventions["Continuous Learning"];
curatedInterventions["Constructive Self-Correction"] = curatedInterventions["Constructive Correction"];

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

  // 2. Check Curated Interventions (checks canonical, original name, and aliases)
  const curated = curatedInterventions[canonical] || curatedInterventions[competencyName] || curatedInterventions[competencyName?.trim()];
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
