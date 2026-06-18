/**
 * ImmersivePoint — Data Access Layer (Store)
 *
 * Dual-mode data access: Supabase when configured, localStorage otherwise.
 * Every public function returns { data, error } following Supabase conventions.
 */

import { supabase, isConfigured } from './supabase.js';

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
};


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
  return ls.sparkSessions.upsert({ ...data });
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
  return ls.passports.upsert(record);
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
  return ls.contacts.upsert({ ...data });
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
  return ls.orgs.upsert({ ...data });
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
  return ls.interactions.upsert({ ...data });
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
  return ls.vendors.upsert({ ...data });
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
