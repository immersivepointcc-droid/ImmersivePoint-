/**
 * ImmersivePoint — Google Apps Script Backend
 *
 * Deploy this as a Google Apps Script Web App to use Google Sheets
 * as the backend for the ImmersivePoint platform.
 *
 * SETUP:
 * 1. Create a new Google Sheet
 * 2. Open Extensions → Apps Script
 * 3. Paste this entire file into Code.gs
 * 4. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL
 * 6. Paste it into ImmersivePoint's settings (Settings panel or .env)
 *
 * SHEETS (auto-created on first request):
 *   Careers       — workforce data for Spark (editable by facilitators)
 *   SparkSessions — completed assessments
 *   Passports     — credential documents
 *   Contacts      — CRM contacts
 *   Organizations — partner orgs
 *   Deals         — CRM pipeline
 */

// ── CONFIG ────────────────────────────────────────────────

const SHEET_NAMES = {
  careers:       'Careers',
  sparkSessions: 'SparkSessions',
  passports:     'Passports',
  contacts:      'Contacts',
  organizations: 'Organizations',
  deals:         'Deals',
};

const HEADERS = {
  careers: [
    'name','codes','pay','region','why','train','growth','vxr','active'
  ],
  sparkSessions: [
    'id','candidate_name','archetype','archetype_who','riasec_code',
    'scores_R','scores_I','scores_A','scores_S','scores_E','scores_C',
    'beh_curiosity','beh_collaboration','beh_resilience','beh_execution','beh_autonomy',
    'careers_json','status','completed_at','created_at'
  ],
  passports: [
    'id','share_code','full_name','date','cohort','site','facilitator',
    'p1','p2','p3',
    'i1','i2','i3','i4','i5','i6','i7','i8','i9',
    'credentials_json','notes','flawless','spark_session_id',
    'created_at','updated_at'
  ],
  contacts: [
    'id','first_name','last_name','email','phone','title','org_id','org_name',
    'status','tags','notes','created_at','updated_at'
  ],
  organizations: [
    'id','name','type','website','address','city','state','zip',
    'contact_name','contact_email','status','notes','created_at','updated_at'
  ],
  deals: [
    'id','name','amount','stage','priority','org_id','org_name',
    'contact_id','contact_name','close_date','notes','created_at','updated_at'
  ],
};

// ── ENTRY POINTS ──────────────────────────────────────────

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const params = e.parameter || {};
  const action = params.action || 'ping';
  const sheet  = params.sheet  || '';

  try {
    let result;

    switch (action) {
      case 'ping':
        result = { ok: true, message: 'ImmersivePoint API is live' };
        break;

      case 'init':
        result = initAllSheets();
        break;

      case 'read':
        result = readSheet(sheet);
        break;

      case 'write':
        const body = JSON.parse(e.postData ? e.postData.contents : '{}');
        result = writeRow(sheet, body);
        break;

      case 'update':
        const updateBody = JSON.parse(e.postData ? e.postData.contents : '{}');
        result = updateRow(sheet, updateBody);
        break;

      case 'delete':
        result = deleteRow(sheet, params.id);
        break;

      case 'seed_careers':
        result = seedCareers();
        break;

      default:
        result = { error: 'Unknown action: ' + action };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── SHEET HELPERS ─────────────────────────────────────────

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ws = ss.getSheetByName(name);
  if (!ws) {
    ws = ss.insertSheet(name);
    ws.appendRow(headers);
    ws.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#0D1B2A')
      .setFontColor('#00D4FF');
    ws.setFrozenRows(1);
  }
  return ws;
}

function initAllSheets() {
  const created = [];
  for (const [key, name] of Object.entries(SHEET_NAMES)) {
    getOrCreateSheet(name, HEADERS[key]);
    created.push(name);
  }
  return { ok: true, sheets: created };
}

function readSheet(sheetKey) {
  const name = SHEET_NAMES[sheetKey];
  if (!name) return { error: 'Unknown sheet: ' + sheetKey };

  const headers = HEADERS[sheetKey];
  const ws = getOrCreateSheet(name, headers);
  const data = ws.getDataRange().getValues();

  if (data.length <= 1) return { data: [] };

  const headerRow = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headerRow.length; j++) {
      let val = data[i][j];
      const h = headerRow[j];
      // Parse JSON columns
      if ((h === 'careers_json' || h === 'credentials_json' || h === 'codes' || h === 'tags') && typeof val === 'string' && val.startsWith('[')) {
        try { val = JSON.parse(val); } catch(e) {}
      }
      row[h] = val;
    }
    rows.push(row);
  }

  return { data: rows };
}

function writeRow(sheetKey, record) {
  const name = SHEET_NAMES[sheetKey];
  if (!name) return { error: 'Unknown sheet: ' + sheetKey };

  const headers = HEADERS[sheetKey];
  const ws = getOrCreateSheet(name, headers);

  if (!record.id) record.id = Utilities.getUuid();
  if (!record.created_at) record.created_at = new Date().toISOString();
  record.updated_at = new Date().toISOString();

  const row = headers.map(h => {
    const val = record[h];
    if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
      return JSON.stringify(val);
    }
    return val !== undefined ? val : '';
  });

  ws.appendRow(row);
  return { data: record };
}

function updateRow(sheetKey, record) {
  const name = SHEET_NAMES[sheetKey];
  if (!name) return { error: 'Unknown sheet: ' + sheetKey };

  const headers = HEADERS[sheetKey];
  const ws = getOrCreateSheet(name, headers);
  const data = ws.getDataRange().getValues();

  const idCol = headers.indexOf('id');
  if (idCol < 0) return { error: 'No id column in ' + sheetKey };

  record.updated_at = new Date().toISOString();

  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === record.id) {
      const row = headers.map(h => {
        if (record[h] !== undefined) {
          const val = record[h];
          if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
            return JSON.stringify(val);
          }
          return val;
        }
        return data[i][headers.indexOf(h)] || '';
      });
      ws.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return { data: record };
    }
  }

  // Not found — insert new
  return writeRow(sheetKey, record);
}

function deleteRow(sheetKey, id) {
  const name = SHEET_NAMES[sheetKey];
  if (!name) return { error: 'Unknown sheet: ' + sheetKey };

  const headers = HEADERS[sheetKey];
  const ws = getOrCreateSheet(name, headers);
  const data = ws.getDataRange().getValues();

  const idCol = headers.indexOf('id');
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === id) {
      ws.deleteRow(i + 1);
      return { ok: true, deleted: id };
    }
  }

  return { error: 'Row not found: ' + id };
}

// ── SEED CAREERS ──────────────────────────────────────────
// Pre-populates the Careers sheet with Eastern Kentucky workforce data.

function seedCareers() {
  const careers = [
    {name:"Registered Nurse (RN)",codes:'["SI","IS","SC","SR"]',pay:"$58-78K",region:"UK King's Daughters (Ashland) · St. Claire (Morehead) · regional clinics",why:"Direct human impact, steady demand, pathway from CNA → LPN → RN. ACTC and Morehead State offer in-region programs.",train:"2-year ADN (ACTC) or 4-year BSN (Morehead/Marshall)",growth:"12% (much faster than avg)",vxr:"Nursing Assistant Career Experience — 19 hands-on simulations · Cadaver Lab Anatomy · 50+ AI patient scenarios",active:true},
    {name:"Industrial Electrician",codes:'["RC","RI","CR","RE"]',pay:"$55-82K",region:"Regional manufacturing · Toyota (Georgetown/WV) · Marathon (Catlettsburg) · industrial contractors",why:"High-demand trade, strong wages, manufacturers actively recruiting. Union apprenticeships pay while you learn.",train:"IBEW apprenticeship (4-5 yr paid) or ACTC electrical tech AAS",growth:"6% + high replacement demand",vxr:"Trades Career Experience — 15 hands-on simulations · OSHA Warehouse Safety · Electrical Systems sandbox · NCCER PACT Core certification prep",active:true},
    {name:"Diesel / Heavy Equipment Technician",codes:'["RC","RE","RI"]',pay:"$48-72K",region:"Coal fleet services · CAT dealers · highway construction · logging companies",why:"Every truck, dozer, and loader in the coalfields needs a mechanic. Transition path for ex-miners who know machinery.",train:"ACTC diesel tech AAS · manufacturer certs (CAT, Cummins)",growth:"5%",vxr:"Trades Career Experience — 15 hands-on simulations · Heavy equipment maintenance labs · OSHA safety certification",active:true},
    {name:"Respiratory Therapist",codes:'["IS","SI","IR"]',pay:"$52-68K",region:"Appalachian Regional Healthcare · Pikeville Medical · home health agencies",why:"Lung disease rates in coal counties drive constant demand. 2-year degree, quick entry.",train:"AAS Respiratory Care (ACTC partner programs)",growth:"14%",vxr:"Healthcare Career Experience — Patient assessment simulations · Ventilator management · Pulmonary diagnostics",active:true},
    {name:"Cybersecurity Analyst",codes:'["IC","CI","IR"]',pay:"$70-105K (remote)",region:"Remote + KY National Guard cyber unit · Appalachian regional banks · hospital IT",why:"100% remote-eligible, high pay. Federal CyberCorps programs offer free tuition in exchange for service.",train:"Morehead State cyber program · WGU online · CompTIA path",growth:"32%",vxr:"Tech Career Experience — Network defense simulations · Ethical hacking labs · Security operations center scenarios",active:true},
    {name:"Software Developer",codes:'["IC","IA","IR"]',pay:"$65-110K (remote)",region:"Remote + Interapt · tech startups",why:"Remote-first industry; Eastern KY has programs (Interapt) that train local devs.",train:"Interapt apprenticeship · Morehead CS · self-taught + bootcamp",growth:"25%",vxr:"Tech Career Experience — Drones & Robotics (15 simulations) · Build-to-Learn Studio · 3D creator environments",active:true},
    {name:"Environmental / Mine Reclamation Tech",codes:'["RI","IR","RE"]',pay:"$42-65K",region:"OSMRE · state DEP · reclamation contractors · watershed groups",why:"Millions in federal funds for reclaiming old mine sites. Leverages existing land knowledge.",train:"ACTC environmental tech AAS · Morehead environmental science BS",growth:"8% + federal funding surge",vxr:"Environmental Science Experience — Water quality testing · Soil remediation · Drone surveying simulations",active:true},
    {name:"Lineman / Powerline Technician",codes:'["RE","RC","ER"]',pay:"$62-92K",region:"AEP (Appalachian Power) · Kentucky Power · rural electric co-ops · contractors",why:"Storm damage + grid upgrades = chronic shortage. High pay, union benefits, outdoor work.",train:"NLC or SLTC line programs · utility apprenticeships (4 yr paid)",growth:"9%",vxr:"Trades Career Experience — Pole climbing simulations · High voltage safety · Storm restoration scenarios",active:true},
    {name:"Machinist / CNC Programmer",codes:'["RC","RI","CR"]',pay:"$45-68K",region:"Braidy Industries (Ashland) · regional job shops · auto-parts supply chain",why:"Advanced manufacturing is the region's growth edge. CNC operators are scarce and well-paid.",train:"ACTC machine tool AAS · NIMS credentials",growth:"7%",vxr:"Advanced Manufacturing Experience — CNC programming · Precision measurement · Quality control simulations",active:true},
    {name:"Addiction Counselor / Social Worker",codes:'["SA","SE","SI"]',pay:"$38-55K",region:"KDAP-funded programs · Mountain Comp Care · Pathways · regional health depts",why:"Opioid-crisis funding → growing field. Every county needs more counselors. Deeply meaningful work.",train:"MSW (Marshall/Morehead) or CADC certification",growth:"18%",vxr:"Behavioral Health Experience — Crisis intervention · Motivational interviewing · Group therapy facilitation",active:true},
    {name:"Welder / Pipefitter",codes:'["RC","RE","CR"]',pay:"$50-78K",region:"Pipeline projects · power plants · fabrication shops · shipyards (Huntington)",why:"Portable skill — travel jobs pay premium. Local demand from plant maintenance and infrastructure.",train:"ACTC welding AAS · AWS certs · UA apprenticeship for pipefitting",growth:"4% + high replacement",vxr:"Trades Career Experience — Welding technique simulations · Blueprint reading · Pipe fitting scenarios · AWS certification prep",active:true},
    {name:"Drone / Geospatial Technician",codes:'["RI","IR","IC"]',pay:"$45-72K",region:"Mine mapping · forestry surveys · utility inspections · precision ag",why:"FAA Part 107 license in weeks. Combines outdoor work with tech. Growing use in mining, timber, and farming.",train:"Part 107 + geospatial certificate (online or MSU)",growth:"15%",vxr:"Drone Operations Experience — Flight simulations · Mapping & surveying · Inspection techniques · FAA Part 107 prep",active:true},
    {name:"Small Business / E-Commerce Operator",codes:'["EC","ES","EA"]',pay:"Variable ($30-80K+)",region:"Main Street programs · SOAR · Shaping Our Future · regional tourism",why:"Etsy + Shopify let artisans sell globally from a holler. Heritage crafts, agritourism, and maker-spaces are booming.",train:"SCORE mentoring · SBA courses · EKU small-business program",growth:"N/A (entrepreneurial)",vxr:"Business Operations Experience — E-commerce setup · Financial planning · Marketing strategy · Customer service scenarios",active:true},
    {name:"Medical Lab Technician",codes:'["CI","IC","IR"]',pay:"$42-58K",region:"Regional hospitals · LabCorp partner sites · public health labs",why:"Behind-the-scenes healthcare role with great job security. 2-year degree, less patient contact.",train:"MLT AAS (ACTC/Morehead) + ASCP certification",growth:"7%",vxr:"Lab Science Experience — Specimen analysis · Diagnostic testing · Lab safety protocols · Equipment calibration",active:true},
  ];

  const ws = getOrCreateSheet(SHEET_NAMES.careers, HEADERS.careers);
  // Clear existing data (keep header)
  if (ws.getLastRow() > 1) {
    ws.deleteRows(2, ws.getLastRow() - 1);
  }

  careers.forEach(c => {
    ws.appendRow(HEADERS.careers.map(h => c[h] !== undefined ? c[h] : ''));
  });

  return { ok: true, count: careers.length };
}
