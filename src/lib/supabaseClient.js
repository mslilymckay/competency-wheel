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

import { assessmentData } from '../data/assessmentData.js';

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
  return assessmentData[tier] || [];
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
 * Fetch all framework rows across all tiers for dynamic hydration
 */
export async function fetchAllFrameworks() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('frameworks')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
      console.warn('Supabase fetchAllFrameworks returned empty or error:', error);
    } catch (err) {
      console.warn('Error querying Supabase all frameworks:', err);
    }
  }
  return null;
}

/**
 * Sign up a new user with Supabase Auth and insert profile
 */
export async function signUpUser({ email, password, displayName }) {
  const cleanName = (displayName || '').trim();
  if (!supabase) {
    const mockUser = {
      id: localStore.getProfileId(),
      email,
      displayName: cleanName || email.split('@')[0]
    };
    return { user: mockUser, error: null };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: cleanName
        }
      }
    });

    if (authError) {
      return { user: null, error: authError };
    }

    const authUser = authData?.user;
    if (!authUser) {
      return { user: null, error: new Error('Failed to create user account') };
    }

    // Upsert into public.profiles
    const profilePayload = {
      id: authUser.id,
      email: authUser.email || email,
      display_name: cleanName || authUser.email?.split('@')[0],
      current_tier: 'ic'
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload);

    if (profileError) {
      console.warn('Failed to upsert profile record in Supabase:', profileError);
    }

    const userObj = {
      id: authUser.id,
      email: authUser.email,
      displayName: cleanName || authUser.email?.split('@')[0]
    };

    return { user: userObj, error: null };
  } catch (err) {
    console.error('Unexpected error during sign up:', err);
    return { user: null, error: err };
  }
}

/**
 * Sign in existing user with Supabase Auth
 */
export async function signInUser({ email, password }) {
  if (!supabase) {
    const mockUser = {
      id: localStore.getProfileId(),
      email,
      displayName: email.split('@')[0]
    };
    return { user: mockUser, error: null };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return { user: null, error: authError };
    }

    const authUser = authData?.user;
    if (!authUser) {
      return { user: null, error: new Error('User not found') };
    }

    let displayName = authUser.user_metadata?.display_name;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('id', authUser.id)
        .single();

      if (profile?.display_name) {
        displayName = profile.display_name;
      }

      if (!profile?.email && authUser.email) {
        await supabase
          .from('profiles')
          .update({ email: authUser.email })
          .eq('id', authUser.id);
      }
    } catch (e) {
      console.warn('Failed to fetch profile during sign in:', e);
    }

    const userObj = {
      id: authUser.id,
      email: authUser.email,
      displayName: displayName || authUser.email?.split('@')[0]
    };

    return { user: userObj, error: null };
  } catch (err) {
    console.error('Unexpected error during sign in:', err);
    return { user: null, error: err };
  }
}

/**
 * Sign out current user from Supabase
 */
export async function signOutUser() {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error signing out:', e);
    }
  }
}

/**
 * Permanently delete user assessment results, profile record, and active session
 */
export async function deleteUserData(userId) {
  if (supabase && userId) {
    try {
      // 1. Delete all saved assessment results
      const { error: resultsError } = await supabase
        .from('assessment_results')
        .delete()
        .eq('profile_id', userId);
      if (resultsError) {
        console.warn('Error deleting assessment results from Supabase:', resultsError);
      }

      // 2. Delete profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (profileError) {
        console.warn('Error deleting profile record from Supabase:', profileError);
      }
    } catch (err) {
      console.error('Unexpected error deleting user data in Supabase:', err);
    }
  }

  // 3. Clear local storage
  localStore.clearCurrentSession();
  try {
    localStorage.removeItem(STORAGE_KEY_ASSESSMENTS);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
  } catch (e) {
    // ignore
  }

  // 4. Sign out auth session
  await signOutUser();
}

/**
 * Get current active session user
 */
export async function getCurrentUser() {
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    let displayName = session.user.user_metadata?.display_name;
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', session.user.id)
        .single();

      if (profile?.display_name) {
        displayName = profile.display_name;
      }
    } catch (e) {
      // ignore
    }

    return {
      id: session.user.id,
      email: session.user.email,
      displayName: displayName || session.user.email?.split('@')[0]
    };
  } catch (e) {
    console.warn('Error getting session user:', e);
    return null;
  }
}

/**
 * Save assessment results to both Supabase and localStorage
 */
export async function saveAssessmentResult({ tier, scores, strengths, focusAreas, bypassLog, profileId }) {
  const finalProfileId = profileId || localStore.getProfileId();
  const record = {
    id: 'res_' + Date.now(),
    profile_id: profileId || null,
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
      const payload = {
        tier,
        scores,
        strengths,
        focus_areas: focusAreas,
        bypass_log: bypassLog
      };

      if (profileId) {
        payload.profile_id = profileId;
      }

      const { data, error } = await supabase
        .from('assessment_results')
        .insert([payload])
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

/**
 * Fetch the latest assessment result for a user, optionally filtered by tier
 */
export async function fetchLatestAssessmentResult(profileId, tier = null) {
  if (!supabase || !profileId) {
    const saved = localStore.getSavedAssessments();
    if (tier) {
      return saved.find(a => a.tier === tier) || null;
    }
    return saved[0] || null;
  }

  try {
    let query = supabase
      .from('assessment_results')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (tier) {
      query = query.eq('tier', tier);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      const row = data[0];
      return {
        id: row.id,
        tier: row.tier,
        scores: row.scores || {},
        strengths: row.strengths || [],
        focusAreas: row.focus_areas || [],
        bypassLog: row.bypass_log || [],
        createdAt: row.created_at
      };
    }
  } catch (err) {
    console.warn('Error fetching latest assessment result:', err);
  }

  // Fallback to local storage
  const saved = localStore.getSavedAssessments();
  if (tier) {
    return saved.find(a => a.tier === tier) || null;
  }
  return saved[0] || null;
}

/**
 * Fetch learning interventions by tier and optionally competency
 */
export async function fetchInterventions(tier = 'ic', competency = null) {
  if (supabase) {
    try {
      let query = supabase
        .from('interventions')
        .select('*')
        .eq('tier', tier)
        .order('sort_order', { ascending: true });

      if (competency) {
        query = query.eq('competency', competency);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
      console.warn('Supabase interventions query returned empty or error:', error);
    } catch (err) {
      console.warn('Error querying Supabase interventions:', err);
    }
  }
  return null;
}

/**
 * Fetch all learning interventions across all tiers for dynamic hydration
 */
export async function fetchAllInterventions() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
      console.warn('Supabase fetchAllInterventions returned empty or error:', error);
    } catch (err) {
      console.warn('Error querying Supabase all interventions:', err);
    }
  }
  return null;
}
