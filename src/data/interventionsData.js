/**
 * Curated 70-20-10 Learning Interventions, Reflections & Manager Enablement Catalog
 * Mapped to Competency & Values Framework with dynamic procedural fallbacks.
 */

import { allMicroHabits, allDefinitions, canonicalizeCompetency, getCategoryForCompetency, COMPETENCY_ALIASES } from '../lib/wheelTheme.js';

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
  },

  // =========================================================================
  // MANAGER TIER: PERFORMANCE ENABLEMENT
  // =========================================================================

  "Actionable Feedback": {
    experiential: {
      title: "24-Hour SBI Feedback Cadence",
      action: "Practice delivering constructive feedback within 24 hours of an event for the next month. Use the Situation-Behavior-Impact model to make feedback timely, growth-oriented, and performance-focused.",
      reflection: "How did delivering feedback promptly change the recipient's defensiveness compared to waiting for a formal check-in?",
      tag: "SBI Model",
      context: "24-Hour Turnaround"
    },
    social: {
      title: "Difficult Conversation Peer Role-Play",
      action: "Role-play a difficult performance conversation with a peer manager, asking them to push back on your framing and listen for explicit actionable guidance.",
      reflection: "What ambiguous phrasing did your peer help you improve?",
      tag: "Peer Role-Play",
      context: "Manager Calibration"
    },
    formal: {
      title: "Overcoming Ruinous Empathy",
      action: "Complete a micro-learning module on overcoming the \"ruinous empathy\" trap in performance evaluations.",
      reflection: "In what area are you currently withholding necessary feedback to preserve comfort?",
      tag: "Performance Study",
      context: "Micro-Learning"
    },
    managerUnblocker: "Review the manager's written feedback for a direct report before it is delivered to ensure the SBI model is applied objectively.",
    managerCoachingQuestion: "Which upcoming performance conversation feels most delicate right now, and how can we pressure-test your SBI framing before you deliver it?"
  },

  "Career Pathway Unblocking": {
    experiential: {
      title: "Dedicated Career Mapping 1:1s",
      action: "Dedicate one 1:1 for each direct report this month exclusively to mapping long-term career aspirations and creating visibility opportunities.",
      reflection: "Which employee's career goals surprised you, and why?",
      tag: "Career Mapping",
      context: "Monthly 1-on-1"
    },
    social: {
      title: "Internal Talent Sponsorship Observation",
      action: "Observe a senior leader in another department sourcing and advocating for internal talent. The best leaders don’t wait until the performance cycle.",
      reflection: "What internal networking channel are you underutilizing for your team's advancement?",
      tag: "Leader Shadowing",
      context: "Talent Advocacy"
    },
    formal: {
      title: "Succession & Internal Mobility Case Studies",
      action: "Study organizational case studies on succession planning and internal talent mobility.",
      reflection: "Who is the immediate successor for your most critical team member, and are they ready?",
      tag: "Case Study",
      context: "Succession Planning"
    },
    managerUnblocker: "Facilitate an introduction between the manager's high-performing direct report and a cross-functional director to aid their sponsorship efforts.",
    managerCoachingQuestion: "Which high-performing team member is ready for broader cross-functional visibility, and which senior leader should we introduce them to this quarter?"
  },

  "Developmental Coaching": {
    experiential: {
      title: "Open-Ended Inquiry Coaching 1:1s",
      action: "In your next three 1:1s, guide team members by asking open-ended questions like \"What would you try first?\" instead of proposing direct solutions.",
      reflection: "How did shifting from a 'fixer' to a 'coach' impact the employee's problem-solving ownership?",
      tag: "Coaching Practice",
      context: "1-on-1 Cadence"
    },
    social: {
      title: "Coaching Leader Observation & Feedback",
      action: "Ask a leader known for strong coaching skills to give you feedback so you can observe how they guide discussions without dictating outcomes.",
      reflection: "What conversational pivot did they use when you asked for the answer directly?",
      tag: "Mentorship",
      context: "Leader Observation"
    },
    formal: {
      title: "The GROW Coaching Model",
      action: "Review literature on the GROW model (Goal, Reality, Options, Will) for coaching direct reports.",
      reflection: "Which stage of the GROW model do you typically rush through?",
      tag: "Coaching Framework",
      context: "Literature Review"
    },
    managerUnblocker: "Brainstorm with the manager in your next 1:1 about how to prioritize long-term capability building over quick, short-term commands.",
    managerCoachingQuestion: "Where did you feel the strongest urge to jump in and solve a problem for a direct report this week, and what happened when you asked a question instead?"
  },

  // =========================================================================
  // MANAGER TIER: CONFLICT RESOLUTION
  // =========================================================================

  "Agreement Alignment": {
    experiential: {
      title: "Codified Post-Conflict Working Agreements",
      action: "Document shared team working agreements in writing immediately following the resolution of a disagreement to secure durable commitments.",
      reflection: "Which working norm required the most debate to secure shared ground?",
      tag: "Team Governance",
      context: "Working Norms"
    },
    social: {
      title: "Peer Review for Inclusion Blind Spots",
      action: "Partner with a peer manager to review your team's documented working norms and identify potential inclusion blind spots.",
      reflection: "What assumption about working styles was embedded in your initial agreements?",
      tag: "Peer Audit",
      context: "Norms Calibration"
    },
    formal: {
      title: "Consensus Building & Psychological Contracts",
      action: "Complete a course on consensus-building techniques and establishing psychological contracts.",
      reflection: "How often do you currently revisit working agreements once they are established?",
      tag: "Formal Course",
      context: "Team Alignment"
    },
    managerUnblocker: "Formally endorse the new team working agreements in a broader department setting to provide the manager with structural backing.",
    managerCoachingQuestion: "How are the new documented working agreements holding up under sprint pressure, and how can I visibly reinforce them across the wider department?"
  },

  "Friction Detection": {
    experiential: {
      title: "Non-Verbal Cue Radar & Rapid 1:1 Check-In",
      action: "Observe non-verbal engagement cues in meetings for two weeks, immediately scheduling a 1:1 check-in when you sense early interpersonal tension.",
      reflection: "Did the immediate check-in prevent a larger productivity loss, or was it a false alarm?",
      tag: "Early Detection",
      context: "Team Meetings"
    },
    social: {
      title: "Conflict Timeline Reverse-Engineering",
      action: "Discuss a recent team conflict with a mentor, reverse-engineering the timeline to identify missed warning signs.",
      reflection: "What specific non-verbal indicator did you dismiss as temporary stress?",
      tag: "Mentor Debrief",
      context: "Retrospective Analysis"
    },
    formal: {
      title: "Emotional Intelligence (EQ) & Team Dynamics",
      action: "Study emotional intelligence (EQ) models focused on reading team dynamics before they escalate.",
      reflection: "Which team member's communication style is hardest for you to read accurately?",
      tag: "EQ Framework",
      context: "Behavioral Study"
    },
    managerUnblocker: "Share observations with the manager about team dynamics they might miss when facilitating, acting as a secondary radar.",
    managerCoachingQuestion: "What subtle friction signals have you picked up in recent team syncs, and where would a second set of eyes from me be helpful?"
  },

  "Neutral Mediation": {
    experiential: {
      title: "Reciprocal Perspective-Taking Mediation",
      action: "Mediate a resolution to build mutual understanding, requiring both parties to articulate each other's perspective before choosing a way forward.",
      reflection: "How did the act of stating the opposing view change the emotional temperature of the dialogue?",
      tag: "Live Mediation",
      context: "Conflict Resolution"
    },
    social: {
      title: "Peer Manager Mediation Deconstruction",
      action: "Interview a peer manager about a recent mediation they facilitated, focusing on how they used neutrality and diverse questioning techniques.",
      reflection: "Where can you apply these skills to uncover implicit bias or a tendency to “leak” into the resolution?",
      tag: "Peer Interview",
      context: "Neutrality Practice"
    },
    formal: {
      title: "Alternative Dispute Resolution Principles",
      action: "Read foundational principles of alternative dispute resolution and open dialogue.",
      reflection: "Do you currently mediate to find the best solution, or simply the fastest compromise?",
      tag: "Dispute Resolution",
      context: "Foundational Reading"
    },
    managerUnblocker: "Step in to mediate if the conflict involves a systemic issue that surpasses the manager's span of control, preserving their neutrality.",
    managerCoachingQuestion: "Are any current team disagreements rooted in cross-departmental or systemic constraints where I should step in so you can preserve your neutrality?"
  },

  // =========================================================================
  // MANAGER TIER: RESOURCE OPTIMIZATION
  // =========================================================================

  "Budget & Tool Stewardship": {
    experiential: {
      title: "Quarterly Shelfware Audit & Reinvestment",
      action: "Review software licenses this quarter to eliminate shelfware, proactively investing those resources into high-leverage tools and processes.",
      reflection: "What emotional or structural resistance did you face when sunsetting the unused tool?",
      tag: "Resource Audit",
      context: "Quarterly Review"
    },
    social: {
      title: "IT & Procurement Redundancy Consultation",
      action: "Consult with the IT or Procurement team to understand the hidden administrative costs of maintaining multiple redundant processes.",
      reflection: "How much time is your team losing to context-switching between poorly integrated platforms?",
      tag: "Cross-Functional Sync",
      context: "Operational Cost"
    },
    formal: {
      title: "Zero-Based Budgeting Principles",
      action: "Complete a module on zero-based budgeting principles for prudent resource investment.",
      reflection: "If you had to rebuild your team's tool stack from scratch today, what would you cut?",
      tag: "Fiscal Discipline",
      context: "Self-Paced Module"
    },
    managerUnblocker: "Ask the manager to present a “tool rationalization” proposal based on their research, either 1:1 or to the entire team.",
    managerCoachingQuestion: "Based on your license and workflow audit, which low-value tool should we sunset this quarter and where should we reinvest those savings?"
  },

  "Capacity Forecasting": {
    experiential: {
      title: "Multi-Month Historical Bandwidth Sizing",
      action: "Review your team’s project timelines over one to six months to realistically size your team's bandwidth against next quarter's project loads.",
      reflection: "Where was the largest gap between your intuitive capacity estimate and the historical data?",
      tag: "Capacity Modeling",
      context: "Quarterly Planning"
    },
    social: {
      title: "PMO Overhead & Buffer Calibration",
      action: "Meet with a project management office (PMO) lead to discuss techniques for factoring paid time off and administrative overhead into forecasts.",
      reflection: "What buffer percentage should you start standardizing in your models?",
      tag: "PMO Consultation",
      context: "Forecasting Rigor"
    },
    formal: {
      title: "Overcoming the Planning Fallacy",
      action: "Review resource management literature on sizing commitments and avoiding the \"planning fallacy.\"",
      reflection: "Which stakeholder do you consistently over-promise capacity to out of a desire to please?",
      tag: "Resource Literature",
      context: "Decision Science"
    },
    managerUnblocker: "Defend the manager's data-backed capacity forecast when senior leadership requests additional scope.",
    managerCoachingQuestion: "What does your historical velocity data say about our true bandwidth for next quarter, and what scope trade-offs do you need me to back in leadership reviews?"
  },

  "Workload Balancing": {
    experiential: {
      title: "Weekly Capacity Audit & Load Redistribution",
      action: "Audit team capacity weekly and redistribute work to spread responsibilities fairly and prevent burnout.",
      reflection: "How did high performers react to having work redistributed, and how did you frame it?",
      tag: "Load Balancing",
      context: "Weekly Sprint Audit"
    },
    social: {
      title: "Senior-to-Junior Mentorship Load Transfer",
      action: "Pair a perpetually overloaded senior IC with a junior team member for a major deliverable, transferring the responsibility via mentorship.",
      reflection: "What tactical bottleneck did this pairing reveal in the senior IC's workflow?",
      tag: "Mentorship Pairing",
      context: "Delegation Practice"
    },
    formal: {
      title: "Dismantling the Hero Culture Trap",
      action: "Study organizational design principles regarding the \"hero culture\" trap and sustaining peak team energy.",
      reflection: "Are you currently rewarding fire-fighting behavior instead of sustainable fire-prevention?",
      tag: "Org Design",
      context: "Burnout Prevention"
    },
    managerUnblocker: "Consider approving temporary contractor support or extended deadlines if the manager requests breathing room to accurately rebalance the team.",
    managerCoachingQuestion: "Where is single-point-of-failure overload concentrated on your team right now, and do we need timeline relief or temporary support while you rebalance?"
  },

  // =========================================================================
  // MANAGER TIER: EMPATHETIC LEADERSHIP
  // =========================================================================

  "Empathetic Attunement": {
    experiential: {
      title: "1:1 Personal Temperature Check Ritual",
      action: "Begin all 1:1s for the next month with a personal temperature check to demonstrate genuine care for well-being before diving into project statuses.",
      reflection: "What critical context about an employee's performance did you uncover through this check-in?",
      tag: "Well-Being Ritual",
      context: "1-on-1 Cadence"
    },
    social: {
      title: "Empathetic Boundaries Peer Exchange",
      action: "Ask a highly empathetic peer manager how they maintain emotional boundaries while remaining deeply attuned to personal situations.",
      reflection: "What is your personal threshold for emotional fatigue, and how do you reset?",
      tag: "Peer Coaching",
      context: "Emotional Resilience"
    },
    formal: {
      title: "Trauma-Informed Leadership & Burnout Signals",
      action: "Complete a module on trauma-informed leadership and recognizing signs of severe burnout versus everyday stress.",
      reflection: "Which team member's recent drop in performance might be rooted in an undisclosed personal situation?",
      tag: "Leadership Module",
      context: "Well-Being Literacy"
    },
    managerUnblocker: "Model this behavior by dedicating the first 10 minutes of your 1:1 with this manager strictly to their own well-being.",
    managerCoachingQuestion: "Before we dive into metrics today, how are your own energy levels holding up as you support your team through their current workload?"
  },

  "Inclusive Decisions": {
    experiential: {
      title: "Asynchronous Pre-Meeting Ideation",
      action: "Invite input from quieter team members by soliciting thoughts asynchronously to ensure all voices are actively considered in decisions.",
      reflection: "How did separating the ideation from the live debate change the diversity of perspectives considered?",
      tag: "Inclusive Facilitation",
      context: "Async Ideation"
    },
    social: {
      title: "Live Sync Airtime & Inclusion Observer",
      action: "Have a trusted direct report act as an \"inclusion observer\" during a team sync and give you feedback on who dominated the airtime.",
      reflection: "Whose voice was unintentionally marginalized during the live decision-making process?",
      tag: "Upward Feedback",
      context: "Meeting Observation"
    },
    formal: {
      title: "Loudest-Voice Bias & Async Decision Models",
      action: "Read research on the \"loudest voice in the room\" bias and asynchronous decision-making models.",
      reflection: "How often do you mistake quick consensus for total agreement?",
      tag: "Decision Research",
      context: "Bias Mitigation"
    },
    managerUnblocker: "Visibly champion a solution that originated from a quiet team member to reinforce the value of the manager's inclusive process.",
    managerCoachingQuestion: "What insightful perspective surfaced through your asynchronous input process recently that we can spotlight and credit at the department level?"
  },

  "Psychological Safety": {
    experiential: {
      title: "Celebrating Learning from Failed Experiments",
      action: "Discuss and celebrate what the team learned from a well-intentioned failed experiment to build an environment where team members share bold ideas without fear.",
      reflection: "Did the team's willingness to brainstorm risky ideas increase in the subsequent weeks?",
      tag: "Culture Ritual",
      context: "Team Retrospective"
    },
    social: {
      title: "Cross-Functional Leader \"Failure Swap\"",
      action: "Facilitate a cross-functional \"failure swap\" with a small group of team leads, where you mutually share recent missteps to normalize vulnerability.",
      reflection: "How did hearing another leader's failure reduce your own fear of making mistakes?",
      tag: "Peer Vulnerability",
      context: "Leader Roundtable"
    },
    formal: {
      title: "Amy Edmondson's Psychological Safety Framework",
      action: "Review Amy Edmondson's foundational work on building psychological safety in the workplace.",
      reflection: "In what subtle ways might your current reaction to bad news be silencing your team?",
      tag: "Foundational Research",
      context: "Organizational Safety"
    },
    managerUnblocker: "Share one of your own recent executive-level failures with the manager's team to normalize risk-taking without fear from the top down.",
    managerCoachingQuestion: "What well-intentioned experiment on your team didn't pan out recently, and how can I join you in celebrating the learning with the group?"
  },

  // =========================================================================
  // MANAGER TIER: OPERATIONAL EXECUTION
  // =========================================================================

  "Execution Cadence": {
    experiential: {
      title: "15-Minute Time-Boxed Standup Discipline",
      action: "Keep daily standups under 15 minutes for one month by strictly deferring deep-dives to parking-lot chats, running syncs that sustain steady velocity.",
      reflection: "What time-wasting update habit did you have to aggressively break the team out of?",
      tag: "Ritual Discipline",
      context: "Daily Standups"
    },
    social: {
      title: "High-Velocity Team Sync Observation",
      action: "Attend the syncs of a highly productive engineering or product team to observe their facilitation rhythm.",
      reflection: "What facilitation constraint (e.g., a physical timer) can you adopt immediately?",
      tag: "Cross-Team Shadowing",
      context: "Facilitation Rhythm"
    },
    formal: {
      title: "Scrum Rituals & Blocker-Removal Principles",
      action: "Study Scrum principles regarding the purpose of running productive, time-boxed daily rituals.",
      reflection: "Are your current check-ins serving as true blockers-removal sessions, or just status reporting?",
      tag: "Agile Rituals",
      context: "Process Study"
    },
    managerUnblocker: "Decline to attend the team's daily standup, signaling trust in the manager's cadence and reducing the temptation for the team to status-report to the skip-level.",
    managerCoachingQuestion: "How has tightening your standup cadence affected daily team momentum, and what async summary format works best to keep me informed without attending?"
  },

  "Metric Alignment": {
    experiential: {
      title: "Bi-Weekly Leading & Lagging KPI Calibration",
      action: "Review leading and lagging KPIs with the team bi-weekly to calibrate focus and establish unambiguous progress indicators.",
      reflection: "Which metric did the team struggle most to connect to their daily tasks?",
      tag: "KPI Calibration",
      context: "Bi-Weekly Review"
    },
    social: {
      title: "Dashboard Audit for Vanity Metrics",
      action: "Partner with a data analyst or operations peer to audit your current dashboard and identify vanity metrics that should be removed.",
      reflection: "What metric were you tracking simply because it was easy to measure, rather than impactful?",
      tag: "Analytics Partnership",
      context: "Dashboard Audit"
    },
    formal: {
      title: "Outcome-Driven OKRs (\"Measure What Matters\")",
      action: "Read John Doerr's \"Measure What Matters\" to differentiate between establishing KPIs and driving outcomes.",
      reflection: "Are you currently managing your team toward effort (hours worked) or outcomes (value created)?",
      tag: "OKR Literature",
      context: "Outcome Management"
    },
    managerUnblocker: "Align the manager's departmental KPIs explicitly with the broader executive scorecard during the quarterly review.",
    managerCoachingQuestion: "Which vanity metrics did you strip from your dashboard, and how can we tighten the link between your team's leading indicators and the executive scorecard?"
  },

  "Milestone Translation": {
    experiential: {
      title: "Strategic Objective Sprint Kickoff Mapping",
      action: "Map every team task back to a key company strategic objective during sprint kickoffs to deconstruct vision into trackable deliverables.",
      reflection: "Which legacy project could you no longer justify when forced to tie it to the current company vision?",
      tag: "Strategic Mapping",
      context: "Sprint Kickoffs"
    },
    social: {
      title: "Cross-Departmental Milestone Through-Line Test",
      action: "Present your deconstructed milestones to a peer manager in a different department and ask if the through-line makes sense to an outsider.",
      reflection: "Where was your narrative relying on team-specific jargon rather than clear business value?",
      tag: "Peer Calibration",
      context: "Narrative Clarity"
    },
    formal: {
      title: "Cascading Goals & Strategic Alignment",
      action: "Complete a strategic alignment module on cascading goals and translating high-level vision into concrete tasks.",
      reflection: "At what layer in the organization does the strategic vision currently get lost in translation?",
      tag: "Strategy Module",
      context: "Goal Cascading"
    },
    managerUnblocker: "Provide the manager with an embargoed preview of upcoming strategic pivots so they can begin translating milestones before the public announcement.",
    managerCoachingQuestion: "As you mapped sprint deliverables to company objectives, which legacy work surfaced as misaligned that we should formally sunset?"
  }
};

function syncInterventionAliases() {
  curatedInterventions["Skill Continuous Learning"] = curatedInterventions["Continuous Learning"];
  curatedInterventions["Constructive Self-Correction"] = curatedInterventions["Constructive Correction"];
  Object.entries(COMPETENCY_ALIASES).forEach(([alias, canonical]) => {
    if (curatedInterventions[canonical] && !curatedInterventions[alias]) {
      curatedInterventions[alias] = curatedInterventions[canonical];
    } else if (curatedInterventions[alias] && !curatedInterventions[canonical]) {
      curatedInterventions[canonical] = curatedInterventions[alias];
    }
  });
}

syncInterventionAliases();

/**
 * Dynamically hydrate the in-memory interventions catalog with real-time rows from public.interventions
 */
export function applyHydratedInterventions(rows) {
  if (!rows || rows.length === 0) return false;

  try {
    const grouped = {};
    rows.forEach(row => {
      const compName = row.competency?.trim();
      if (!compName) return;

      if (!grouped[compName]) {
        grouped[compName] = {
          category: row.category,
          tier: row.tier,
          managerUnblocker: row.manager_unblocker,
          managerCoachingQuestion: row.manager_coaching_question
        };
      }

      const bucketKey = (row.bucket || '').toLowerCase();
      if (bucketKey === 'experiential' || bucketKey === 'social' || bucketKey === 'formal') {
        grouped[compName][bucketKey] = {
          title: row.title,
          action: row.action,
          reflection: row.reflection,
          tag: row.tag,
          context: row.context_modifier || row.context || ''
        };
      }

      if (row.manager_unblocker) {
        grouped[compName].managerUnblocker = row.manager_unblocker;
      }
      if (row.manager_coaching_question) {
        grouped[compName].managerCoachingQuestion = row.manager_coaching_question;
      }
    });

    Object.entries(grouped).forEach(([compName, entry]) => {
      if (entry.experiential && entry.social && entry.formal) {
        curatedInterventions[compName] = entry;
        const canonical = canonicalizeCompetency(compName);
        if (canonical && canonical !== compName) {
          curatedInterventions[canonical] = entry;
        }
      }
    });

    syncInterventionAliases();
    return true;
  } catch (err) {
    console.error('Error applying hydrated interventions:', err);
    return false;
  }
}

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
      category: curated.category || category,
      definition,
      microHabit,
      ...curated
    };
  }

  // 3. Fallback Generation for other skills/values
  const isValues = tier === 'values';
  const isLeaderUnblockerTier = tier === 'manager' || tier === 'director';
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
    managerUnblocker: isLeaderUnblockerTier
      ? `Protect 2 hours of strategic bandwidth this sprint for the leader's development, and provide executive sponsorship on their initial experiment.`
      : `Protect 2 hours of focused schedule bandwidth this sprint for the employee's development, and provide feedback on their initial experiment.`,
    managerCoachingQuestion: `What specific roadblock can I help clear so you have the authority and time to execute on this growth objective?`
  };
}

/**
 * Builds the comprehensive AI Coaching Prompt (Google Gemini Ready)
 */
export function buildTailoredPrompt({ level = "Professional", tier = "ic", blueprints = [] }) {
  const isLeaderUnblockerTier = tier === 'manager' || tier === 'director' || level === 'Manager' || level === 'Director';
  const unblockerLabel = isLeaderUnblockerTier ? 'Leader Alignment' : 'Manager Alignment';
  const scriptLabel = isLeaderUnblockerTier ? 'Leader 1-on-1 Alignment Script' : 'Manager 1-on-1 Alignment Script';
  const partnerNoun = isLeaderUnblockerTier ? 'senior leader' : 'manager';

  const compLines = blueprints.map(bp => {
    return `• ${bp.name} (${bp.category})
    - Daily Micro-Habit: "${bp.microHabit}"
    - 70% Experiential Target: ${bp.experiential.action}
    - 20% Social Mentorship: ${bp.social.action}
    - 10% Formal Study: ${bp.formal.action}
    - ${unblockerLabel}: ${bp.managerUnblocker}`;
  }).join('\n\n');

  return `I am currently working as a ${level} looking to accelerate my leadership growth and alignment with our organizational values.

Here are my selected target focus areas and 70-20-10 growth blueprint:

${compLines}

Please act as an executive leadership coach and generate:
1. A 30-Day Milestone Sprint Roadmap breaking down the experiential assignments above into week-by-week deliverables.
2. A ${scriptLabel}: 3 targeted questions I can bring to my ${partnerNoun} to secure their sponsorship and unblocking commitments.
3. 3 Reflective Journaling Prompts for my 30-day self-evaluation to measure behavioral change.`;
}
