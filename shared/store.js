/**
 * ImmersivePoint — Data Access Layer (Store)
 *
 * Dual-mode data access: Supabase when configured, localStorage otherwise.
 * Every public function returns { data, error } following Supabase conventions.
 */

import { supabase, isConfigured } from './supabase.js';
import { googleSync } from './google-sync.js';

/* ================================================================
   Helpers
   ================================================================ */

function uuid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

/** Generic localStorage CRUD helper. */
class LocalStore {
  constructor(key) {
    this._key = key;
  }

  _read() {
    try { return JSON.parse(localStorage.getItem(this._key) || '[]'); }
    catch { return []; }
  }

  _write(rows) {
    localStorage.setItem(this._key, JSON.stringify(rows));
  }

  getAll(filterFn) {
    let rows = this._read();
    if (filterFn) rows = rows.filter(filterFn);
    return { data: rows, error: null };
  }

  getById(id) {
    const row = this._read().find(r => r.id === id);
    return row
      ? { data: row, error: null }
      : { data: null, error: { message: 'Not found' } };
  }

  findOne(predicate) {
    const row = this._read().find(predicate);
    return row
      ? { data: row, error: null }
      : { data: null, error: { message: 'Not found' } };
  }

  upsert(record) {
    const rows = this._read();
    const idx = rows.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      rows[idx] = { ...rows[idx], ...record, updated_at: now() };
    } else {
      record.id = record.id || uuid();
      record.created_at = record.created_at || now();
      record.updated_at = now();
      rows.push(record);
    }
    this._write(rows);
    return { data: record, error: null };
  }

  remove(id) {
    const rows = this._read();
    const idx = rows.findIndex(r => r.id === id);
    if (idx < 0) return { data: null, error: { message: 'Not found' } };
    const [removed] = rows.splice(idx, 1);
    this._write(rows);
    return { data: removed, error: null };
  }
}

/* Local stores for each entity */
const ls = {
  sparkSessions:  new LocalStore('ip_spark_sessions'),
  passports:      new LocalStore('ip_passports'),
  contacts:       new LocalStore('ip_contacts'),
  orgs:           new LocalStore('ip_organizations'),
  interactions:   new LocalStore('ip_interactions'),
  vendors:        new LocalStore('ip_vendors'),
  deals:          new LocalStore('ip_deals'),
  mobileDevices:      new LocalStore('ip_mobile_devices'),
  mobileDeployments:  new LocalStore('ip_mobile_deployments'),
  mobileMaintenance:  new LocalStore('ip_mobile_maintenance'),
};

/* Google Sheets key mapping (entity -> sheet tab name) */
const gsKey = {
  sparkSessions:  'sparkSessions',
  passports:      'passports',
  contacts:       'contacts',
  orgs:           'organizations',
  deals:          'deals',
  mobileDevices:      'mobileDevices',
  mobileDeployments:  'mobileDeployments',
  mobileMaintenance:  'mobileMaintenance',
};

/** Fire-and-forget: sync a record to Google Sheets if configured. */
function _gsSave(entityKey, record) {
  const sheetKey = gsKey[entityKey];
  if (sheetKey && googleSync.isConfigured()) {
    googleSync.save(sheetKey, record).catch(() => {});
  }
}


/* ================================================================
   Spark Sessions
   ================================================================ */

export async function saveSparkSession(data) {
  if (isConfigured()) {
    const record = { ...data, id: data.id || uuid(), updated_at: now() };
    if (!data.id) record.created_at = now();
    const { data: row, error } = await supabase
      .from('spark_sessions')
      .upsert(record)
      .select()
      .single();
    return { data: row, error };
  }
  const result = ls.sparkSessions.upsert({ ...data });
  _gsSave('sparkSessions', result.data);
  return result;
}

export async function getSparkSessions(userId) {
  if (isConfigured()) {
    let query = supabase.from('spark_sessions').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    return { data, error };
  }
  return ls.sparkSessions.getAll(userId ? r => r.user_id === userId : null);
}

export async function getSparkSession(id) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('spark_sessions').select('*').eq('id', id).single();
    return { data, error };
  }
  return ls.sparkSessions.getById(id);
}


/* ================================================================
   Passports
   ================================================================ */

export async function savePassport(data) {
  if (isConfigured()) {
    const record = {
      ...data,
      id: data.id || uuid(),
      share_code: data.share_code || _generateShareCode(),
      updated_at: now(),
    };
    if (!data.id) record.created_at = now();
    const { data: row, error } = await supabase
      .from('passports')
      .upsert(record)
      .select()
      .single();
    return { data: row, error };
  }
  const record = { ...data };
  if (!record.share_code) record.share_code = _generateShareCode();
  const result = ls.passports.upsert(record);
  _gsSave('passports', result.data);
  return result;
}

export async function getPassports(userId) {
  if (isConfigured()) {
    let query = supabase.from('passports').select('*').order('created_at', { ascending: false });
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    return { data, error };
  }
  return ls.passports.getAll(userId ? r => r.user_id === userId : null);
}

export async function getPassport(id) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('passports').select('*').eq('id', id).single();
    return { data, error };
  }
  return ls.passports.getById(id);
}

export async function getPassportByShareCode(code) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('passports').select('*').eq('share_code', code).single();
    return { data, error };
  }
  return ls.passports.findOne(r => r.share_code === code);
}

function _generateShareCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}


/* ================================================================
   CRM Contacts
   ================================================================ */

export async function saveContact(data) {
  if (isConfigured()) {
    const record = { ...data, id: data.id || uuid(), updated_at: now() };
    if (!data.id) record.created_at = now();
    const { data: row, error } = await supabase
      .from('contacts')
      .upsert(record)
      .select()
      .single();
    return { data: row, error };
  }
  const result = ls.contacts.upsert({ ...data });
  _gsSave('contacts', result.data);
  return result;
}

export async function getContacts(filters) {
  if (isConfigured()) {
    let query = supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (filters) {
      if (filters.org_id)  query = query.eq('org_id', filters.org_id);
      if (filters.status)  query = query.eq('status', filters.status);
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }
    }
    const { data, error } = await query;
    return { data, error };
  }

  return ls.contacts.getAll(row => {
    if (!filters) return true;
    if (filters.org_id && row.org_id !== filters.org_id) return false;
    if (filters.status && row.status !== filters.status) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      const hay = `${row.first_name || ''} ${row.last_name || ''} ${row.email || ''}`.toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
}

export async function getContact(id) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('contacts').select('*').eq('id', id).single();
    return { data, error };
  }
  return ls.contacts.getById(id);
}

export async function deleteContact(id) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('contacts').delete().eq('id', id).select().single();
    return { data, error };
  }
  return ls.contacts.remove(id);
}


/* ================================================================
   Organizations
   ================================================================ */

export async function saveOrg(data) {
  if (isConfigured()) {
    const record = { ...data, id: data.id || uuid(), updated_at: now() };
    if (!data.id) record.created_at = now();
    const { data: row, error } = await supabase
      .from('organizations')
      .upsert(record)
      .select()
      .single();
    return { data: row, error };
  }
  const result = ls.orgs.upsert({ ...data });
  _gsSave('orgs', result.data);
  return result;
}

export async function getOrgs() {
  if (isConfigured()) {
    const { data, error } = await supabase.from('organizations').select('*').order('name');
    return { data, error };
  }
  return ls.orgs.getAll();
}

export async function getOrg(id) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single();
    return { data, error };
  }
  return ls.orgs.getById(id);
}


/* ================================================================
   Interactions
   ================================================================ */

export async function saveInteraction(data) {
  if (isConfigured()) {
    const record = { ...data, id: data.id || uuid(), updated_at: now() };
    if (!data.id) record.created_at = now();
    const { data: row, error } = await supabase
      .from('interactions')
      .upsert(record)
      .select()
      .single();
    return { data: row, error };
  }
  const result = ls.interactions.upsert({ ...data });
  _gsSave('interactions', result.data);
  return result;
}

export async function getInteractions(contactId) {
  if (isConfigured()) {
    let query = supabase.from('interactions').select('*').order('created_at', { ascending: false });
    if (contactId) query = query.eq('contact_id', contactId);
    const { data, error } = await query;
    return { data, error };
  }
  return ls.interactions.getAll(contactId ? r => r.contact_id === contactId : null);
}


/* ================================================================
   Vendors
   ================================================================ */

export async function saveVendor(data) {
  if (isConfigured()) {
    const record = { ...data, id: data.id || uuid(), updated_at: now() };
    if (!data.id) record.created_at = now();
    const { data: row, error } = await supabase
      .from('vendors')
      .upsert(record)
      .select()
      .single();
    return { data: row, error };
  }
  const result = ls.vendors.upsert({ ...data });
  _gsSave('vendors', result.data);
  return result;
}

export async function getVendors() {
  if (isConfigured()) {
    const { data, error } = await supabase.from('vendors').select('*').order('name');
    return { data, error };
  }
  return ls.vendors.getAll();
}

export async function getVendor(id) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('vendors').select('*').eq('id', id).single();
    return { data, error };
  }
  return ls.vendors.getById(id);
}

export async function toggleVendor(id, active) {
  if (isConfigured()) {
    const { data, error } = await supabase
      .from('vendors')
      .update({ active, updated_at: now() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  const { data: vendor } = ls.vendors.getById(id);
  if (!vendor) return { data: null, error: { message: 'Vendor not found' } };
  vendor.active = active;
  return ls.vendors.upsert(vendor);
}


/* ================================================================
   Deals
   ================================================================ */

export async function saveDeal(data) {
  if (isConfigured()) {
    const record = { ...data, id: data.id || uuid(), updated_at: now() };
    if (!data.id) record.created_at = now();
    const { data: row, error } = await supabase
      .from('deals')
      .upsert(record)
      .select()
      .single();
    return { data: row, error };
  }
  const result = ls.deals.upsert({ ...data });
  _gsSave('deals', result.data);
  return result;
}

export async function getDeals(filters) {
  if (isConfigured()) {
    let query = supabase.from('deals').select('*').order('created_at', { ascending: false });
    if (filters) {
      if (filters.stage)      query = query.eq('stage', filters.stage);
      if (filters.org_id)     query = query.eq('org_id', filters.org_id);
      if (filters.contact_id) query = query.eq('contact_id', filters.contact_id);
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
    }
    const { data, error } = await query;
    return { data, error };
  }

  return ls.deals.getAll(row => {
    if (!filters) return true;
    if (filters.stage && row.stage !== filters.stage) return false;
    if (filters.org_id && row.org_id !== filters.org_id) return false;
    if (filters.contact_id && row.contact_id !== filters.contact_id) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!(row.name || '').toLowerCase().includes(s)) return false;
    }
    return true;
  });
}

export async function getDeal(id) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('deals').select('*').eq('id', id).single();
    return { data, error };
  }
  return ls.deals.getById(id);
}

export async function deleteDeal(id) {
  if (isConfigured()) {
    const { data, error } = await supabase.from('deals').delete().eq('id', id).select().single();
    return { data, error };
  }
  return ls.deals.remove(id);
}


/* ================================================================
   Mobile Ops — Devices
   ================================================================ */

export function getDevices() {
  return JSON.parse(localStorage.getItem('ip_mobile_devices') || '[]');
}
export function saveDevice(device) {
  const devices = getDevices();
  device.updated_at = new Date().toISOString();
  const idx = devices.findIndex(d => d.id === device.id);
  if (idx >= 0) { devices[idx] = { ...devices[idx], ...device }; }
  else { device.id = device.id || crypto.randomUUID(); device.created_at = new Date().toISOString(); devices.unshift(device); }
  localStorage.setItem('ip_mobile_devices', JSON.stringify(devices));
  _gsSave('mobileDevices', device);
  return device;
}
export function deleteDevice(id) {
  const devices = getDevices().filter(d => d.id !== id);
  localStorage.setItem('ip_mobile_devices', JSON.stringify(devices));
}

/* ================================================================
   Mobile Ops — Deployments
   ================================================================ */

export function getDeployments() {
  return JSON.parse(localStorage.getItem('ip_mobile_deployments') || '[]');
}
export function saveDeployment(dep) {
  const deps = getDeployments();
  dep.updated_at = new Date().toISOString();
  const idx = deps.findIndex(d => d.id === dep.id);
  if (idx >= 0) { deps[idx] = { ...deps[idx], ...dep }; }
  else { dep.id = dep.id || crypto.randomUUID(); dep.created_at = new Date().toISOString(); deps.unshift(dep); }
  localStorage.setItem('ip_mobile_deployments', JSON.stringify(deps));
  _gsSave('mobileDeployments', dep);
  return dep;
}
export function deleteDeployment(id) {
  const deps = getDeployments().filter(d => d.id !== id);
  localStorage.setItem('ip_mobile_deployments', JSON.stringify(deps));
}

/* ================================================================
   Mobile Ops — Maintenance Log
   ================================================================ */

export function getMaintenanceLogs() {
  return JSON.parse(localStorage.getItem('ip_mobile_maintenance') || '[]');
}
export function saveMaintenanceLog(log) {
  const logs = getMaintenanceLogs();
  log.updated_at = new Date().toISOString();
  const idx = logs.findIndex(l => l.id === log.id);
  if (idx >= 0) { logs[idx] = { ...logs[idx], ...log }; }
  else { log.id = log.id || crypto.randomUUID(); log.created_at = new Date().toISOString(); logs.unshift(log); }
  localStorage.setItem('ip_mobile_maintenance', JSON.stringify(logs));
  _gsSave('mobileMaintenance', log);
  return log;
}
export function deleteMaintenanceLog(id) {
  const logs = getMaintenanceLogs().filter(l => l.id !== id);
  localStorage.setItem('ip_mobile_maintenance', JSON.stringify(logs));
}


/* ================================================================
   Google Sheets — Bulk Sync
   ================================================================ */

/** Map of localStorage entity key -> Google Sheets tab name (only entities with a sheet). */
const _syncMap = {
  sparkSessions:      'sparkSessions',
  passports:          'passports',
  contacts:           'contacts',
  orgs:               'organizations',
  deals:              'deals',
  mobileDevices:      'mobileDevices',
  mobileDeployments:  'mobileDeployments',
  mobileMaintenance:  'mobileMaintenance',
};

/**
 * Push ALL localStorage data to Google Sheets (full upload).
 * Skipped if Supabase is the primary store or Google is not configured.
 * @returns {Promise<{results: object, error: string|null}>}
 */
export async function syncAllToCloud() {
  if (isConfigured()) {
    return { results: {}, error: 'Supabase is the primary store; Google Sheets sync skipped.' };
  }
  if (!googleSync.isConfigured()) {
    return { results: {}, error: 'Google Sheets is not configured.' };
  }

  const results = {};
  const entries = Object.entries(_syncMap);

  await Promise.all(entries.map(async ([lsKey, sheetKey]) => {
    const { data: rows } = ls[lsKey].getAll();
    let ok = 0;
    let fail = 0;
    for (const row of rows) {
      const { error } = await googleSync.save(sheetKey, row);
      if (error) fail++; else ok++;
    }
    results[sheetKey] = { pushed: ok, failed: fail };
  }));

  return { results, error: null };
}

/**
 * Pull ALL data from Google Sheets and merge into localStorage.
 * For each entity, cloud records are merged by id (cloud wins on conflict).
 * Skipped if Supabase is the primary store or Google is not configured.
 * @returns {Promise<{results: object, error: string|null}>}
 */
export async function syncAllFromCloud() {
  if (isConfigured()) {
    return { results: {}, error: 'Supabase is the primary store; Google Sheets sync skipped.' };
  }
  if (!googleSync.isConfigured()) {
    return { results: {}, error: 'Google Sheets is not configured.' };
  }

  const results = {};
  const entries = Object.entries(_syncMap);

  await Promise.all(entries.map(async ([lsKey, sheetKey]) => {
    const { data: cloudRows, error } = await googleSync.readAll(sheetKey);
    if (error) {
      results[sheetKey] = { merged: 0, error: error.message || error };
      return;
    }
    let merged = 0;
    for (const row of cloudRows) {
      if (!row.id) continue;
      ls[lsKey].upsert(row);
      merged++;
    }
    results[sheetKey] = { merged, error: null };
  }));

  return { results, error: null };
}
