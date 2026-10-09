import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Storage adapter with local-first fallback
 */
const STORAGE_KEY_SELECTIONS = 'competency_wheel_selections';
const STORAGE_KEY_ASSESSMENTS = 'competency_wheel_assessments';
const STORAGE_KEY_ACTIVE_SESSION = 'competency_wheel_session';
const STORAGE_KEY_PROFILE = 'competency_wheel_profile_id';

export const localStore = {
  getSelections() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SELECTIONS);
      return data ? JSON.parse(data) : { competencies: [], values: [] };
    } catch {
      return { competencies: [], values: [] };
    }
  },

  saveSelections(selections) {
    try {
      localStorage.setItem(STORAGE_KEY_SELECTIONS, JSON.stringify(selections));
    } catch (e) {
      console.error('Failed to save selections locally', e);
    }
  },

  getSavedAssessments() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ASSESSMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAssessment(assessment) {
    try {
      const list = this.getSavedAssessments();
      const updated = [assessment, ...list.filter(a => a.id !== assessment.id)];
      localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save assessment', e);
      return [];
    }
  },

  clearCurrentSession() {
    localStorage.removeItem(STORAGE_KEY_SELECTIONS);
  },

  getProfileId() {
    try {
      let id = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (!id) {
        id = 'anon_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem(STORAGE_KEY_PROFILE, id);
      }
      return id;
    } catch {
      return 'anon_guest';
    }
  }
};

/**
 * Fetch assessment questions by tier ('ic', 'manager', 'director', 'values')
 */
export async function fetchAssessments(tier = 'ic') {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('tier', tier)
        .order('pair_id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
      console.warn('Supabase fetch failed or returned empty, using fallback:', error);
    } catch (err) {
      console.warn('Error querying Supabase assessments:', err);
    }
  }
  return null;
}

/**
 * Fetch framework definitions by tier ('ic', 'manager', 'director', 'values')
 */
export async function fetchFramework(tier = 'ic') {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('frameworks')
        .select('*')
        .eq('tier', tier)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
      console.warn('Supabase fetch failed or returned empty:', error);
    } catch (err) {
      console.warn('Error querying Supabase frameworks:', err);
    }
  }
  return null;
}

/**
 * Save assessment results to both Supabase and localStorage
 */
export async function saveAssessmentResult({ tier, scores, strengths, focusAreas, bypassLog }) {
  const profileId = localStore.getProfileId();
  const record = {
    id: 'res_' + Date.now(),
    tier,
    scores,
    strengths,
    focus_areas: focusAreas,
    bypass_log: bypassLog,
    created_at: new Date().toISOString()
  };

  // Always cache locally first
  localStore.saveAssessment(record);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .insert([{
          tier,
          scores,
          strengths,
          focus_areas: focusAreas,
          bypass_log: bypassLog
        }])
        .select();

      if (error) {
        console.warn('Failed to persist assessment result to Supabase:', error);
      } else if (data && data[0]) {
        return data[0];
      }
    } catch (err) {
      console.warn('Error saving result to Supabase:', err);
    }
  }

  return record;
}
