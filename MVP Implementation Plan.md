# Competency Wheel MVP: Implementation Plan

**Goal:** Transform the single-file UI into a deployed Progressive Web App (PWA) with a Supabase backend, a desktop-optimized assessment, a radar report, and the dynamic wheel.

---

## Sprint 1: Data Architecture & Supabase Setup (90 mins)

*Goal: Move hardcoded data into a relational cloud database.*

1. **Supabase Initialization:** Create a new Supabase project.  
2. **Schema Creation:** Set up three primary tables using SQL:  
   * `frameworks` (Tiers, Macro Categories, Skills, Definitions).  
   * `assessments` (The ipsative pairings: Option A vs Option B).  
   * `profiles` (Basic user data/auth tied to sessions).  
3. **Data Ingestion:** Convert `assessment_pairings_balanced.md` into JSON and seed the Supabase database.  
4. **Client Setup:** Initialize the Supabase JS client in your codebase to fetch these pairings.

## Sprint 2: Build Pipeline & Routing Engine (90 mins)

*Goal: Upgrade from a single HTML file to a modular React app ready for PWA.*

1. **Vite Migration:** Initialize a standard React/Vite project (this makes PWA generation much easier than the Babel standalone script).  
2. **Component Separation:** Break `index.html` into modular files (`Wheel.jsx`, `DefinitionsPanel.jsx`, `App.jsx`).  
3. **State Machine:** Implement the new routing logic: `Welcome ➔ Tier Select ➔ Assessment (or) Explore ➔ Results ➔ Wheel`.

## Sprint 3: The Desktop Assessment UI (90 mins)

*Goal: Build the interactive testing interface.*

1. **Card Component:** Build the split-screen UI (Option A on left, Option B on right).  
2. **Interaction Logic:** Add focus on click handlers for desktop; mobile responsiveness is not part of the MVP.  
3. **State Tracking:** Create the array that stores user selections.  
   * *Crucial Logic:* When an option is bypassed, log it in an array so we can dynamically render the "Passed over in favor of \[X\]" pills later.

## Sprint 4: Scoring Engine & Radar Chart (90 mins)

*Goal: Calculate the math and visualize the leadership footprint.*

1. **The Tally Algorithm:** Write a reducer function that calculates the 0/1/2 scores at the end of the 15 questions.  
2. **Radar Integration:** Install a lightweight charting library (like `recharts` or `chart.js`).  
3. **Chart Rendering:** Map the user's Macro Category scores (aggregating the skill scores) to the vertices of the radar chart. Apply the multiplier (0=33%, 1=66%, 2=100%) to ensure the chart looks dynamic.

## Sprint 5: Results Report & Wheel Handoff (90 mins)

*Goal: Bridge the assessment results seamlessly into the core Wheel tool.*

1. **Results View:** Build the UI beneath the Radar Chart.  
2. **Dynamic Pills:** Render the Top 3 Strengths (2/2s) and Top 3 Focus Areas (0/2s). Underneath the Focus Areas, map the "Passed over in favor of..." data into Tailwind pills.  
3. **State Injection:** Wire the "Continue to Wheel" button so it takes the three 0/2 Focus Areas and pushes their specific ID paths into the `competencyPaths` state array, launching the Wheel in Focused Mode.

## Sprint 6: PWA Configuration & Deployment (90 mins)

*Goal: Push to production and allow users to install the app on their phones.*

1. **PWA Manifest:** Create `manifest.json` with your icon, theme colors (`#be185d`), and standalone display settings.  
2. **Service Worker:** Use a plugin like `vite-plugin-pwa` to cache the React bundle for offline loading.  
3. **GitHub Actions:** Set up a simple YAML workflow to automatically build the Vite project and deploy the `dist` folder to GitHub Pages whenever you push to the `main` branch.