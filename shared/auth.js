/**
 * ImmersivePoint — Auth Module
 *
 * Provides sign-up, sign-in, sign-out, role checks, and auth guards.
 * Falls back to a localStorage mock when Supabase is not configured so the
 * app remains usable in demo / offline / development mode.
 */

import { supabase, isConfigured } from './supabase.js';

/* ---- Allowed roles ---------------------------------------- */
const VALID_ROLES = ['user', 'facilitator', 'partner', 'admin'];

/* ================================================================
   localStorage Fallback
   ================================================================ */

const LS_USER_KEY  = 'ip_auth_user';
const LS_USERS_KEY = 'ip_auth_users';

function _lsGetUsers() {
  try { return JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]'); }
  catch { return []; }
}

function _lsSaveUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}

function _lsSetCurrent(user) {
  if (user) {
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LS_USER_KEY);
  }
  // Notify listeners
  _authListeners.forEach(fn => {
    try { fn(user ? 'SIGNED_IN' : 'SIGNED_OUT', user); } catch { /* noop */ }
  });
}

function _lsGetCurrent() {
  try { return JSON.parse(localStorage.getItem(LS_USER_KEY)); }
  catch { return null; }
}

/* ================================================================
   Public API
   ================================================================ */

/**
 * Create a new account.
 * @param {string} email
 * @param {string} password
 * @param {string} role — one of VALID_ROLES
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function signUp(email, password, role = 'user') {
  if (!VALID_ROLES.includes(role)) {
    return { data: null, error: { message: `Invalid role "${role}". Must be one of: ${VALID_ROLES.join(', ')}` } };
  }

  if (isConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });
    return { data, error };
  }

  // localStorage fallback
  const users = _lsGetUsers();
  if (users.find(u => u.email === email)) {
    return { data: null, error: { message: 'An account with this email already exists.' } };
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    password, // stored in plain text — demo only
    user_metadata: { role },
    created_at: new Date().toISOString(),
  };
  users.push(user);
  _lsSaveUsers(users);
  _lsSetCurrent(user);
  return { data: { user }, error: null };
}

/**
 * Sign in with email and password.
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export async function signIn(email, password) {
  if (isConfigured()) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  const users = _lsGetUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { data: null, error: { message: 'Invalid email or password.' } };
  }
  _lsSetCurrent(user);
  return { data: { user }, error: null };
}

/**
 * Sign out the current user.
 * @returns {Promise<{error: object|null}>}
 */
export async function signOut() {
  if (isConfigured()) {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  _lsSetCurrent(null);
  return { error: null };
}

/**
 * Returns the currently authenticated user, or null.
 * @returns {Promise<object|null>}
 */
export async function getUser() {
  if (isConfigured()) {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  return _lsGetCurrent();
}

/**
 * Returns the role string from the current user's metadata.
 * @returns {Promise<string|null>}
 */
export async function getRole() {
  const user = await getUser();
  if (!user) return null;
  return user.user_metadata?.role || 'user';
}

/**
 * Auth guard — redirects to the login page when the user is not
 * authenticated or does not hold one of the allowed roles.
 *
 * @param {string[]} [allowedRoles] — if omitted, any authenticated user passes.
 * @returns {Promise<object>} the current user (if authorised).
 */
export async function requireAuth(allowedRoles) {
  const user = await getUser();

  if (!user) {
    window.location.href = '/index.html';
    // Return a never-resolving promise so the caller's code stops.
    return new Promise(() => {});
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = user.user_metadata?.role || 'user';
    if (!allowedRoles.includes(role)) {
      window.location.href = '/index.html';
      return new Promise(() => {});
    }
  }

  return user;
}

/* ---- Auth state listener ---------------------------------- */

const _authListeners = new Set();

/**
 * Subscribe to auth state changes.
 * @param {Function} callback — receives (event, user)
 * @returns {Function} unsubscribe
 */
export function onAuthChange(callback) {
  _authListeners.add(callback);

  if (isConfigured()) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => callback(event, session?.user ?? null)
    );
    return () => {
      _authListeners.delete(callback);
      subscription.unsubscribe();
    };
  }

  // For the localStorage fallback the callback only fires on explicit
  // signIn / signOut / signUp calls (handled in _lsSetCurrent).
  return () => _authListeners.delete(callback);
}

export { VALID_ROLES };
