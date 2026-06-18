/**
 * ImmersivePoint — HubSpot Data Seed
 *
 * Pre-populates the CRM with all contacts, organizations, and deals
 * from the ImmersivePoint HubSpot account. Only seeds if stores are empty.
 */

import { saveContact, saveOrg, saveDeal, getContacts, getOrgs, getDeals } from './store.js';

/* ================================================================
   Organization Data (58 companies from HubSpot)
   ================================================================ */

const ORGS = [
  { name: 'ImmersivePoint LLC', type: 'employer', website: 'immersivepoint.io', county: 'Carter', notes: "Eastern Kentucky's first immersive technology center and workforce development hub. FutureForge XR, AI Spark Studio, Maker Forge Studio, LBVR Arena." },
  { name: 'SOAR Innovation', type: 'nonprofit', website: 'soar-ky.org', county: 'Perry', notes: "Eastern Kentucky's designated Innovation Hub. Runs the Startup Appalachia Accelerator." },
  { name: 'Shaping Our Appalachian Region', type: 'nonprofit', website: 'soar-ky.org', county: 'Perry' },
  { name: 'EKCEP', type: 'nonprofit', website: 'ekcep.org', notes: 'Eastern Kentucky Concentrated Employment Program. Workforce development partner.' },
  { name: 'VictoryXR', type: 'partner', website: 'victoryxr.com', notes: 'VR education and enterprise immersive training platform.' },
  { name: 'Immersive History', type: 'partner', website: 'immersivehistory.com', notes: 'Creator of the Immersive Bible Experience (IBx) — faith-based VR content.' },
  { name: 'Georgia Institute of Technology', type: 'higher_education', website: 'gatech.edu' },
  { name: 'Ashland Community & Technical College', type: 'higher_education', website: 'ashland.kctcs.edu', notes: 'KCTCS college with workforce development division interested in VR training partnership.' },
  { name: 'Collins Career Technical Center', type: 'school', website: 'collins-cc.edu' },
  { name: 'DIVR Labs', type: 'partner', website: 'divrlabs.com' },
  { name: 'MIMBUS', type: 'partner', website: 'mimbus.com', notes: 'VR simulation content — welding training specialist.' },
  { name: 'Interplay Learning', type: 'partner', website: 'interplaylearning.com', notes: 'Skilled trades VR/AR training platform.' },
  { name: 'GWPro (GVR Training)', type: 'partner', website: 'gwpro.io', notes: 'VR Safety & HSE training. OSHA-compliant modules.' },
  { name: 'BeThere Immersive', type: 'partner', website: 'cosmicsauce.agency', notes: 'VR and AI workforce development. Flagship: RecruiterXR. Co-founded by Johnny Eaker.' },
  { name: 'Cosmic Sauce', type: 'partner', website: 'cosmicsauce.agency' },
  { name: 'Marshall University iCenter', type: 'higher_education', website: 'muicenter.com', notes: 'Center for Innovation and Entrepreneurship. Key contact: Tricia Ball.' },
  { name: 'Marshall University', type: 'higher_education', website: 'marshall.edu', county: 'Cabell' },
  { name: 'Morehead State University', type: 'higher_education', website: 'moreheadstate.edu', county: 'Rowan', notes: 'Tier 4 prospect. Rowan County anchor institution.' },
  { name: 'Kentucky Christian University', type: 'higher_education' },
  { name: 'Toyota Motor Manufacturing WV', type: 'employer', website: 'careers.toyota.com', notes: 'TIER 1. Produces ~1M engines/transmissions annually. Expanding hybrid production. Direct FutureForge XR curriculum match: electrical, hydraulics, PLCs, CNC, robotics.' },
  { name: 'Vertiv (Ironton)', type: 'employer', website: 'vertiv.com', notes: 'TIER 1. $50M expansion, 730 new jobs through 2029. Thermal mgmt systems for AI infrastructure. Needs scalable onboarding NOW.' },
  { name: 'Huntington Alloys Corp / Special Metals', type: 'employer', website: 'specialmetals.com', notes: 'TIER 2. One of the largest nickel alloy facilities in the world. Mimbus welding sim fit.' },
  { name: "King's Daughters Medical Center", type: 'healthcare', website: 'kdmc.com', county: 'Boyd', notes: 'TIER 2. Largest employer in Lawrence County OH. Operates Workforce Institute. UK-affiliated.' },
  { name: 'Mountain Health Network', type: 'healthcare', website: 'mhnetwork.org', notes: 'TIER 2. Largest employer in Cabell County. 23-county service area.' },
  { name: 'Steel of West Virginia', type: 'employer', website: 'steelofwv.com', notes: 'TIER 2. Major Cabell County manufacturer. Mimbus welding VR sims fit.' },
  { name: 'Marathon Petroleum (Ironton)', type: 'employer', website: 'marathonpetroleum.com', notes: 'TIER 3. Major Lawrence County employer. High-hazard environment. GWPro OSHA modules.' },
  { name: 'Ashland Inc. (Specialty Chemicals)', type: 'employer', website: 'ashland.com', notes: 'TIER 3. High-hazard work environment. GWPro OSHA/HSE modules fit.' },
  { name: 'St. Claire HealthCare', type: 'healthcare', website: 'st-claire.org', county: 'Rowan', notes: 'TIER 3. Largest rural hospital in region. 20 miles from Olive Hill.' },
  { name: 'Putnam County Schools', type: 'school', website: 'putnamschools.com', notes: 'TIER 3. Already partnered with Toyota 4T Academy.' },
  { name: 'Boyd County Schools', type: 'school', website: 'boyd.kyschools.us', county: 'Boyd', notes: 'TIER 4. Natural expansion from CCTC model.' },
  { name: 'Boyd County High School', type: 'school', county: 'Boyd', notes: 'Largest high school in target area. 928 students. Principal Ben Fritz (reform mindset).' },
  { name: 'Boyd County Middle School', type: 'school', county: 'Boyd', notes: 'Principal Shawn Thornbury. Feeder school for BCHS.' },
  { name: 'Journey to Healing Corp', type: 'healthcare', website: 'journeytohealing.org', county: 'Carter', notes: 'TIER 4. Olive Hill — ImmersivePoint backyard. Behavioral health workforce development.' },
  { name: 'River Metals Recycling', type: 'employer', website: 'rnr-inc.com', notes: 'TIER 4. Heavy equipment ops and metal recycling = safety sim opportunity.' },
  { name: 'East Carter High School', type: 'school', county: 'Carter', notes: "ImmersivePoint's home-county high school. 703 students, 60% economically disadvantaged." },
  { name: 'West Carter High School', type: 'school', county: 'Carter', notes: "Olive Hill = ImmersivePoint's literal backyard. Trimester scheduling." },
  { name: 'East Carter Middle School', type: 'school', county: 'Carter' },
  { name: 'West Carter Middle School', type: 'school', county: 'Carter', notes: 'Principal Kayla Bailey. Same town as Cosmic Center.' },
  { name: 'Rowan County Senior High School', type: 'school', county: 'Rowan', notes: 'Principal Lori Staggs. Near Morehead State University.' },
  { name: 'Rowan County Middle School', type: 'school', county: 'Rowan', notes: "Nationally recognized 'School to Watch.' 68% economically disadvantaged." },
  { name: 'Ashland Middle School', type: 'school', county: 'Boyd', notes: 'Part of Ashland Independent Schools.' },
  { name: 'Paul G. Blazer High School', type: 'school', county: 'Boyd', notes: 'Ashland Independent Schools. 7 buildings, 40 acres.' },
  { name: 'Carter County School District', type: 'school', website: 'carter.kyschools.us', county: 'Carter' },
  { name: 'Carter Nursing and Rehabilitation', type: 'healthcare', county: 'Carter', notes: '120 beds. 1-star CMS rating — admin pressure to differentiate.' },
  { name: 'Boyd Nursing and Rehabilitation', type: 'healthcare', county: 'Boyd', notes: '60 beds. 4-star Medicare. AHCA Tier 1 winner 2020.' },
  { name: 'Kingsbrook Lifecare Center', type: 'healthcare', county: 'Boyd', notes: '137 beds. Non-profit. Specializes in stroke, cardiac, memory care. Part of KDHS/UK system.' },
  { name: "KDMC Skilled Nursing Unit", type: 'healthcare', county: 'Boyd', notes: 'UK-affiliated. Operates Workforce Institute. Nursing Boot Camp Immersion Experience.' },
  { name: 'Life Care Center of Morehead', type: 'healthcare', county: 'Rowan', notes: '97 beds. Part of LCCA chain. Below-average short-term rehab = VR rehab tech hook.' },
  { name: 'Rowan County Senior Center (GADD)', type: 'government', county: 'Rowan', notes: 'Gateway Area Development District. Runs MotorMeals food truck covering 5 counties.' },
  { name: 'Community Trust Bank', type: 'employer', website: 'ctbi.com', county: 'Boyd' },
  { name: 'Kentucky APEX Accelerator (KSTC)', type: 'government', website: 'kstc.com' },
  { name: 'Southeast Kentucky Economic Development', type: 'government', website: 'skedcorp.com' },
  { name: 'Office of Congressman Hal Rogers (KY-05)', type: 'government', website: 'mail.house.gov' },
  { name: 'Pathways Inc.', type: 'healthcare', website: 'pathways-ky.org' },
  { name: 'Fair Chance Works', type: 'nonprofit', website: 'fairchanceworks.com' },
  { name: 'KSTC', type: 'government', website: 'kstc.com' },
  { name: 'Orascom Group', type: 'employer' },
  { name: 'HubSpot', type: 'partner', website: 'hubspot.com' },
];


/* ================================================================
   Contact Data (36 contacts from HubSpot)
   ================================================================ */

const CONTACTS = [
  { first_name: 'Marc', last_name: 'Bullard', email: 'immersivepointcc@gmail.com', phone: '(304) 421-0594', org_name: 'ImmersivePoint LLC', status: 'active', tags: ['founder', 'customer'] },
  { first_name: 'Colt', last_name: 'Swint', email: 'colt.swint@soar-ky.org', phone: '', org_name: 'SOAR Innovation', status: 'active', tags: ['startup-pipeline', 'customer'] },
  { first_name: 'Jarad', last_name: 'Fugate', email: 'jarad.fugate@soar-ky.org', phone: '(606) 691-0667', org_name: 'SOAR Innovation', status: 'active', tags: ['startup-success', 'opportunity'] },
  { first_name: 'Larry', last_name: 'Ward', email: 'wardlb@collins-cc.edu', phone: '', org_name: 'Collins Career Technical Center', status: 'active', tags: ['opportunity'] },
  { first_name: 'Tomáš', last_name: 'Neubauer', email: 'tomas.neubauer@divrlabs.com', phone: '', org_name: 'DIVR Labs', status: 'active', tags: ['opportunity', 'xr-vendor'] },
  { first_name: 'John', last_name: 'King', email: 'john@victoryxr.com', phone: '', org_name: 'VictoryXR', status: 'active', tags: ['opportunity', 'xr-platform'] },
  { first_name: 'Jarom', last_name: 'Sidwell', email: 'jsidwell@immersivehistory.com', phone: '', org_name: 'Immersive History', status: 'active', tags: ['opportunity', 'content-partner'] },
  { first_name: 'Cameron', last_name: 'Rose', email: 'crose63@gatech.edu', phone: '', org_name: 'Georgia Institute of Technology', status: 'active', tags: ['opportunity', 'stem-research'] },
  { first_name: 'Anzor', last_name: 'Shouk', email: 'anzor.shouk@gwpro.io', phone: '+971561867506', org_name: 'GWPro (GVR Training)', status: 'active', tags: ['opportunity', 'xr-vendor', 'international'] },
  { first_name: 'Catherine', last_name: 'Gilman', email: 'catherine.gilman@interplaylearning.com', phone: '4696998598', org_name: 'Interplay Learning', status: 'active', tags: ['opportunity', 'skilled-trades'] },
  { first_name: 'Laurent', last_name: 'Da Dalto', email: 'laurent.dadalto@mimbus.com', phone: '', org_name: 'MIMBUS', status: 'active', tags: ['opportunity', 'ceo', 'welding-vr'] },
  { first_name: 'Peter', last_name: 'Gosselar', email: 'peter.gosselar@mimbus.com', phone: '3124719920', org_name: 'MIMBUS', status: 'active', tags: ['opportunity', 'customer-success'] },
  { first_name: 'Tricia', last_name: 'Ball', email: 'ballt@marshall.edu', phone: '(304) 696-5120', org_name: 'Marshall University iCenter', status: 'active', tags: ['opportunity', 'higher-ed', 'icenter'] },
  { first_name: 'Johnny', last_name: 'Eaker', email: 'johnny@cosmicsauce.agency', phone: '(573) 239-8148', org_name: 'BeThere Immersive', status: 'active', tags: ['opportunity', 'strategic-partner', 'recruiterxr'] },
  { first_name: 'EKCEP', last_name: 'Partner', email: 'info@ekcep.org', phone: '(606) 435-4646', org_name: 'EKCEP', status: 'active', tags: ['workforce-dev', 'partner'] },
  { first_name: 'Scott', last_name: 'Stuckey', email: 'scott@fairchanceworks.com', phone: '(606) 404-2115', org_name: 'Fair Chance Works', status: 'prospect', tags: ['lead', 'president'] },
  { first_name: 'James', last_name: 'Chinn', email: 'jchinn@pathways-ky.org', phone: '(606) 324-3005 ext. 4076', org_name: 'Pathways Inc.', status: 'prospect', tags: ['lead', 'employment-specialist'] },
  { first_name: 'Natalie', last_name: 'Heighton', email: 'heightna@ctbi.com', phone: '(606) 329-6019', org_name: 'Community Trust Bank', status: 'prospect', tags: ['lead', 'commercial-lender'] },
  { first_name: 'Kristin', last_name: 'Webb', email: 'webbkr@ctbi.com', phone: '(606) 571-6216', org_name: 'Community Trust Bank', status: 'prospect', tags: ['lead', 'vp'] },
  { first_name: 'Eric', last_name: 'Byrd', email: 'ebyrd@kstc.com', phone: '(606) 794-4078', org_name: 'Kentucky APEX Accelerator (KSTC)', status: 'prospect', tags: ['lead', 'procurement'] },
  { first_name: 'Jennifer', last_name: 'Wells', email: 'jennifer.wells@soar-ky.org', phone: '(606) 766-1160', org_name: 'Shaping Our Appalachian Region', status: 'prospect', tags: ['lead', 'outreach'] },
  { first_name: 'Brett', last_name: 'Traver', email: 'brett@skedcorp.com', phone: '(606) 677-6100', org_name: 'Southeast Kentucky Economic Development', status: 'prospect', tags: ['lead', 'executive-director'] },
  { first_name: 'Adam', last_name: 'Rice', email: 'adamrice@mail.house.gov', phone: '(606) 886-0844', org_name: 'Office of Congressman Hal Rogers (KY-05)', status: 'prospect', tags: ['lead', 'government', 'field-rep'] },
  { first_name: 'Lori', last_name: 'Staggs', email: '', phone: '6067848928', org_name: 'Rowan County Senior High School', status: 'prospect', tags: ['lead', 'principal'] },
  { first_name: 'Shawn', last_name: 'Thornbury', email: '', phone: '6069284141', org_name: 'Boyd County Middle School', status: 'prospect', tags: ['lead', 'principal'] },
  { first_name: 'Ben', last_name: 'Fritz', email: '', phone: '6069287100', org_name: 'Boyd County High School', status: 'prospect', tags: ['lead', 'principal', 'reform-mindset'] },
  { first_name: 'Kayla', last_name: 'Bailey', email: '', phone: '6062865354', org_name: 'West Carter Middle School', status: 'prospect', tags: ['lead', 'principal'] },
  { first_name: 'Zack', last_name: 'Moore', email: '', phone: '6064746696', org_name: 'West Carter High School', status: 'prospect', tags: ['lead', 'principal'] },
  { first_name: 'Jessica', last_name: 'Duncan', email: 'jessica.duncan@carter.kyschools.us', phone: '6064746696', org_name: 'East Carter High School', status: 'prospect', tags: ['lead', 'frysc'] },
  { first_name: 'Kelley', last_name: 'Moore', email: 'kelley.moore@carter.kyschools.us', phone: '6064745714', org_name: 'East Carter Middle School', status: 'prospect', tags: ['lead', 'principal'] },
  { first_name: 'Gina', last_name: 'Thompson', email: '', phone: '6067848466', org_name: 'Rowan County Senior Center (GADD)', status: 'prospect', tags: ['lead', 'director'] },
  { first_name: 'William', last_name: 'Hurst', email: '', phone: '6067847581', org_name: 'Carter Nursing and Rehabilitation', status: 'prospect', tags: ['lead', 'administrator'] },
  { first_name: 'Michael', last_name: 'Thompson', email: '', phone: '6063274557', org_name: 'Boyd Nursing and Rehabilitation', status: 'prospect', tags: ['lead', 'administrator'] },
  { first_name: 'Jane', last_name: 'Blankenship', email: '', phone: '6063241414', org_name: 'Kingsbrook Lifecare Center', status: 'prospect', tags: ['lead', 'administrator'] },
  { first_name: 'Samuel', last_name: 'Wright II', email: '', phone: '6069282963', org_name: 'Boyd Nursing and Rehabilitation', status: 'prospect', tags: ['lead', 'administrator'] },
];


/* ================================================================
   Deal Data (38 deals from HubSpot)
   ================================================================ */

const DEALS = [
  { name: 'EKCEP Partnership - FutureForge XR Pilot', org_name: 'EKCEP', stage: 'qualified_to_buy', amount: 250000, forecast_amount: 250000, deal_type: 'newbusiness' },
  { name: 'FutureForge XR - $250K Pilot Grant Proposal', org_name: 'ImmersivePoint LLC', stage: 'presentation_scheduled', amount: 250000, forecast_amount: 250000, deal_type: 'newbusiness' },
  { name: 'FutureForge XR Licensing - Pilot Prospect Pipeline', org_name: 'ImmersivePoint LLC', stage: 'appointment_scheduled', amount: 175000, forecast_amount: 175000, deal_type: 'newbusiness', close_date: '2026-06-30' },
  { name: 'ACTC - FutureForge XR Licensing', org_name: 'Ashland Community & Technical College', stage: 'appointment_scheduled', amount: 45000, forecast_amount: 45000, deal_type: 'newbusiness', close_date: '2026-05-31' },
  { name: 'FutureForge XR Licensing - Template Deal', org_name: 'ImmersivePoint LLC', stage: 'appointment_scheduled', amount: 35000, forecast_amount: 35000, deal_type: 'newbusiness', close_date: '2026-05-15' },
  { name: 'Collins Community College - FutureForge XR Licensing', org_name: 'Collins Career Technical Center', contact_name: 'Larry Ward', stage: 'qualified_to_buy', amount: 25000, forecast_amount: 25000, close_date: '2026-04-30' },
  { name: 'Startup Appalachia Accelerator – SOAR Innovation', org_name: 'SOAR Innovation', contact_name: 'Colt Swint', stage: 'closed_won', amount: 5000, forecast_amount: 5000, deal_type: 'newbusiness' },
  { name: 'Immersive Bible Experience – Content License + Rev Share', org_name: 'Immersive History', contact_name: 'Jarom Sidwell', stage: 'presentation_scheduled', amount: 2000, forecast_amount: 2000, deal_type: 'newbusiness', close_date: '2026-05-01' },
  { name: 'ImmersivePoint Grand Opening - VR Arcade Launch', org_name: 'ImmersivePoint LLC', stage: 'appointment_scheduled', deal_type: 'newbusiness' },
  { name: 'VictoryXR – Platform Partnership', org_name: 'VictoryXR', contact_name: 'John King', stage: 'appointment_scheduled', deal_type: 'newbusiness', close_date: '2026-06-30' },
  { name: 'Cameron Rose / Georgia Tech – STEM Partnership', org_name: 'Georgia Institute of Technology', contact_name: 'Cameron Rose', stage: 'appointment_scheduled', deal_type: 'newbusiness', close_date: '2026-07-31' },
  { name: 'ACTC Workforce Partnership – Ashland Community & Technical College', org_name: 'Ashland Community & Technical College', stage: 'appointment_scheduled', deal_type: 'newbusiness', close_date: '2026-09-30' },
  { name: 'Marshall University — XR Curriculum Partnership', org_name: 'Marshall University', stage: 'appointment_scheduled' },
  { name: 'Marshall iCenter — XR Partnership', org_name: 'Marshall University iCenter', contact_name: 'Tricia Ball', stage: 'appointment_scheduled' },
  { name: 'MSU — FutureForge XR Partnership', org_name: 'Morehead State University', stage: 'appointment_scheduled' },
  { name: 'Kentucky Christian University – XR Innovation Hub Partnership', org_name: 'Kentucky Christian University', stage: 'appointment_scheduled', priority: 'high' },
  { name: 'BeThere Immersive – Strategic Partnership', org_name: 'BeThere Immersive', contact_name: 'Johnny Eaker', stage: 'appointment_scheduled' },
  { name: 'MIMBUS — VR Simulation Content Partnership', org_name: 'MIMBUS', stage: 'appointment_scheduled' },
  { name: 'Interplay Learning — Skilled Trades Training Partnership', org_name: 'Interplay Learning', contact_name: 'Catherine Gilman', stage: 'appointment_scheduled' },
  { name: 'GWPro — VR Safety & HSE Training Partnership', org_name: 'GWPro (GVR Training)', contact_name: 'Anzor Shouk', stage: 'appointment_scheduled' },
  { name: 'DIVR Labs — InstaVR Demo', org_name: 'DIVR Labs', contact_name: 'Tomáš Neubauer', stage: 'presentation_scheduled', close_date: '2026-04-15' },
  { name: 'Collins CC — Larry Ward', org_name: 'Collins Career Technical Center', contact_name: 'Larry Ward', stage: 'appointment_scheduled', close_date: '2026-04-30' },
  { name: 'ACTC Workforce Partnership', org_name: 'Ashland Community & Technical College', stage: 'appointment_scheduled', close_date: '2026-04-30' },
  { name: 'Morgan Stanley ISV Application', stage: 'qualified_to_buy', close_date: '2026-03-31' },
  { name: 'Toyota WV — FutureForge XR Pilot', org_name: 'Toyota Motor Manufacturing WV', stage: 'appointment_scheduled' },
  { name: 'Vertiv Ironton — Onboarding XR Scale', org_name: 'Vertiv (Ironton)', stage: 'appointment_scheduled' },
  { name: 'Huntington Alloys — Safety XR', org_name: 'Huntington Alloys Corp / Special Metals', stage: 'appointment_scheduled' },
  { name: 'KDMC — Clinical Skills XR', org_name: "King's Daughters Medical Center", stage: 'appointment_scheduled' },
  { name: 'Mountain Health — Clinical XR Training', org_name: 'Mountain Health Network', stage: 'appointment_scheduled' },
  { name: 'St. Claire — Clinical XR Training', org_name: 'St. Claire HealthCare', stage: 'appointment_scheduled' },
  { name: 'Steel of WV — Welding/Fabrication XR', org_name: 'Steel of West Virginia', stage: 'appointment_scheduled' },
  { name: 'Marathon Ironton — Safety/Operations XR', org_name: 'Marathon Petroleum (Ironton)', stage: 'appointment_scheduled' },
  { name: 'Ashland Inc — Chemical Safety XR', org_name: 'Ashland Inc. (Specialty Chemicals)', stage: 'appointment_scheduled' },
  { name: 'River Metals — Safety XR', org_name: 'River Metals Recycling', stage: 'appointment_scheduled' },
  { name: 'Boyd County — FutureForge XR', org_name: 'Boyd County Schools', stage: 'appointment_scheduled' },
  { name: 'Putnam CTE — FutureForge XR', org_name: 'Putnam County Schools', stage: 'appointment_scheduled' },
  { name: 'Journey to Healing — Staff XR Training', org_name: 'Journey to Healing Corp', stage: 'appointment_scheduled' },
];


/* ================================================================
   Seed Function
   ================================================================ */

export async function seedFromHubSpot() {
  const { data: existingOrgs } = await getOrgs();
  const { data: existingContacts } = await getContacts();
  const { data: existingDeals } = await getDeals();

  if (existingOrgs?.length > 0 || existingContacts?.length > 0 || existingDeals?.length > 0) {
    return { seeded: false, message: 'Data already exists — skipping seed.' };
  }

  const orgMap = {};

  for (const org of ORGS) {
    const { data } = await saveOrg(org);
    if (data) orgMap[org.name] = data.id;
  }

  const contactMap = {};

  for (const c of CONTACTS) {
    const record = { ...c };
    if (record.org_name) {
      record.org_id = orgMap[record.org_name] || null;
      delete record.org_name;
    }
    if (record.tags) {
      record.tags = JSON.stringify(record.tags);
    }
    const { data } = await saveContact(record);
    if (data) {
      const key = `${c.first_name} ${c.last_name}`;
      contactMap[key] = data.id;
    }
  }

  for (const d of DEALS) {
    const record = { ...d };
    if (record.org_name) {
      record.org_id = orgMap[record.org_name] || null;
      delete record.org_name;
    }
    if (record.contact_name) {
      record.contact_id = contactMap[record.contact_name] || null;
      delete record.contact_name;
    }
    if (record.close_date) {
      record.close_date = new Date(record.close_date).toISOString();
    }
    await saveDeal(record);
  }

  return {
    seeded: true,
    counts: {
      organizations: ORGS.length,
      contacts: CONTACTS.length,
      deals: DEALS.length,
    },
  };
}
