/**
 * ImmersivePoint — Google Sheets Sync Layer
 *
 * Client-side sync between localStorage and a Google Apps Script web app
 * deployed as a REST API. All public methods return { data, error } to match
 * the convention established in store.js.
 *
 * The Google Apps Script deployment URL is persisted in localStorage under
 * the key `ip_google_script_url`.
 */

/* ================================================================
   Constants
   ================================================================ */

const STORAGE_KEY = 'ip_google_script_url';

/** Request timeout in milliseconds. */
const TIMEOUT_MS = 10_000;

/** Valid sheet keys accepted by the Apps Script backend. */
const VALID_SHEETS = [
  'careers',
  'sparkSessions',
  'passports',
  'contacts',
  'organizations',
  'deals',
];

/** Valid API actions. */
const VALID_ACTIONS = ['ping', 'init', 'read', 'write', 'update', 'delete'];

/* ================================================================
   Helpers
   ================================================================ */

/**
 * Wraps a fetch call with an AbortController timeout.
 * @param {string}        url
 * @param {RequestInit}   opts
 * @returns {Promise<Response>}
 */
function fetchWithTimeout(url, opts = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...opts, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

/**
 * Build a consistent error result.
 * @param {string} message
 * @returns {{ data: null, error: { message: string } }}
 */
function err(message) {
  return { data: null, error: { message } };
}

/**
 * Build a consistent success result.
 * @param {*} data
 * @returns {{ data: *, error: null }}
 */
function ok(data) {
  return { data, error: null };
}

/* ================================================================
   GoogleSync Class
   ================================================================ */

export class GoogleSync {
  /* --------------------------------------------------------------
     Configuration
     -------------------------------------------------------------- */

  /**
   * Returns true when a Google Apps Script URL has been saved.
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.getScriptUrl();
  }

  /**
   * Persist the Apps Script deployment URL.
   * @param {string} url
   */
  setScriptUrl(url) {
    localStorage.setItem(STORAGE_KEY, url.trim());
  }

  /**
   * Read the stored Apps Script deployment URL.
   * @returns {string|null}
   */
  getScriptUrl() {
    return localStorage.getItem(STORAGE_KEY) || null;
  }

  /* --------------------------------------------------------------
     Low-level transport
     -------------------------------------------------------------- */

  /**
   * Send a GET request to the Apps Script backend.
   * @param {string} action   One of VALID_ACTIONS.
   * @param {string} [sheet]  Sheet key (required for most actions).
   * @param {Object} [extra]  Additional query-string params.
   * @returns {Promise<{ data: *, error: *}>}
   */
  async _get(action, sheet, extra = {}) {
    if (!this.isConfigured()) return err('Google Sync is not configured');

    const base = this.getScriptUrl();
    const params = new URLSearchParams({ action, ...extra });
    if (sheet) params.set('sheet', sheet);
    const url = `${base}?${params.toString()}`;

    try {
      const res = await fetchWithTimeout(url, { mode: 'cors' });
      const json = await res.json();
      if (!res.ok) return err(json.error || `HTTP ${res.status}`);
      return ok(json.data !== undefined ? json.data : json);
    } catch (e) {
      if (e.name === 'AbortError') return err('Request timed out');
      return err(e.message || 'Network error');
    }
  }

  /**
   * Send a POST request to the Apps Script backend.
   * @param {string}  action  One of VALID_ACTIONS.
   * @param {string}  [sheet] Sheet key.
   * @param {Object}  body    JSON payload.
   * @returns {Promise<{ data: *, error: *}>}
   */
  async _post(action, sheet, body = {}) {
    if (!this.isConfigured()) return err('Google Sync is not configured');

    const base = this.getScriptUrl();
    const params = new URLSearchParams({ action });
    if (sheet) params.set('sheet', sheet);
    const url = `${base}?${params.toString()}`;

    try {
      const res = await fetchWithTimeout(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) return err(json.error || `HTTP ${res.status}`);
      return ok(json.data !== undefined ? json.data : json);
    } catch (e) {
      if (e.name === 'AbortError') return err('Request timed out');
      return err(e.message || 'Network error');
    }
  }

  /* --------------------------------------------------------------
     Public API
     -------------------------------------------------------------- */

  /**
   * Test connectivity to the Apps Script backend.
   * @returns {Promise<{ data: *, error: *}>}
   */
  async ping() {
    return this._get('ping');
  }

  /**
   * Fetch all rows from a sheet.
   * @param {string} sheetKey  One of VALID_SHEETS.
   * @returns {Promise<{ data: Array|null, error: *}>}
   */
  async readAll(sheetKey) {
    if (!VALID_SHEETS.includes(sheetKey)) {
      return err(`Unknown sheet: ${sheetKey}`);
    }
    return this._get('read', sheetKey);
  }

  /**
   * Upsert a single record. If `record.id` exists the row is updated;
   * otherwise a new row is written.
   * @param {string} sheetKey
   * @param {Object} record
   * @returns {Promise<{ data: *, error: *}>}
   */
  async save(sheetKey, record) {
    if (!VALID_SHEETS.includes(sheetKey)) {
      return err(`Unknown sheet: ${sheetKey}`);
    }
    const action = record.id ? 'update' : 'write';
    return this._post(action, sheetKey, record);
  }

  /**
   * Delete a record by id.
   * @param {string} sheetKey
   * @param {string} id
   * @returns {Promise<{ data: *, error: *}>}
   */
  async remove(sheetKey, id) {
    if (!VALID_SHEETS.includes(sheetKey)) {
      return err(`Unknown sheet: ${sheetKey}`);
    }
    return this._post('delete', sheetKey, { id });
  }

  /* --------------------------------------------------------------
     Bulk sync helpers
     -------------------------------------------------------------- */

  /**
   * Push an array of local records to the cloud sheet. Each record is
   * sent as an individual write/update call.
   * @param {string}  sheetKey
   * @param {Array}   localData
   * @returns {Promise<{ data: { saved: number, errors: string[] }, error: null }>}
   */
  async syncToCloud(sheetKey, localData) {
    if (!VALID_SHEETS.includes(sheetKey)) {
      return err(`Unknown sheet: ${sheetKey}`);
    }
    if (!Array.isArray(localData)) {
      return err('localData must be an array');
    }

    let saved = 0;
    const errors = [];

    for (const record of localData) {
      const { error } = await this.save(sheetKey, record);
      if (error) {
        errors.push(error.message || 'Unknown error');
      } else {
        saved++;
      }
    }

    return ok({ saved, errors });
  }

  /**
   * Pull all records from the cloud sheet, merge them into localStorage
   * (cloud wins on conflict by id), and return the merged set.
   * @param {string} sheetKey
   * @returns {Promise<{ data: Array|null, error: *}>}
   */
  async syncFromCloud(sheetKey) {
    if (!VALID_SHEETS.includes(sheetKey)) {
      return err(`Unknown sheet: ${sheetKey}`);
    }

    const { data: cloudRows, error } = await this.readAll(sheetKey);
    if (error) return { data: null, error };
    if (!Array.isArray(cloudRows)) return err('Unexpected response from cloud');

    // Map sheet keys to the localStorage keys used by store.js.
    const lsKeyMap = {
      careers:       'ip_careers',
      sparkSessions: 'ip_spark_sessions',
      passports:     'ip_passports',
      contacts:      'ip_contacts',
      organizations: 'ip_organizations',
      deals:         'ip_deals',
    };

    const lsKey = lsKeyMap[sheetKey];
    let localRows = [];
    try {
      localRows = JSON.parse(localStorage.getItem(lsKey) || '[]');
    } catch {
      localRows = [];
    }

    // Merge: cloud version wins where ids overlap; local-only rows kept.
    const seen = new Set();
    const merged = [];

    for (const row of cloudRows) {
      merged.push(row);
      if (row.id) seen.add(row.id);
    }

    for (const row of localRows) {
      if (row.id && !seen.has(row.id)) {
        merged.push(row);
      }
    }

    localStorage.setItem(lsKey, JSON.stringify(merged));
    return ok(merged);
  }

  /* --------------------------------------------------------------
     Domain-specific helpers
     -------------------------------------------------------------- */

  /**
   * Fetch the Careers sheet and return an array of career objects.
   * The `codes` field is stored as a JSON string in the sheet and is
   * parsed into an array here.
   * @returns {Promise<{ data: Array<{name:string, codes:string[], pay:string, region:string, why:string, train:string, growth:string, vxr:string, active:boolean}>|null, error: *}>}
   */
  async loadCareers() {
    const { data, error } = await this.readAll('careers');
    if (error) return { data: null, error };
    if (!Array.isArray(data)) return err('Unexpected careers response');

    const careers = data.map(row => ({
      name:   row.name   || '',
      codes:  _parseCodes(row.codes),
      pay:    row.pay    || '',
      region: row.region || '',
      why:    row.why    || '',
      train:  row.train  || '',
      growth: row.growth || '',
      vxr:    row.vxr    || '',
      active: row.active !== undefined ? row.active : true,
    }));

    return ok(careers);
  }
}

/* ================================================================
   Internal helpers
   ================================================================ */

/**
 * Safely parse the `codes` column which may be a JSON string, an array,
 * or a plain comma-separated string.
 * @param {*} raw
 * @returns {string[]}
 */
function _parseCodes(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string' || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [raw];
  } catch {
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }
}

/* ================================================================
   Singleton export
   ================================================================ */

/** @type {GoogleSync} */
export const googleSync = new GoogleSync();
