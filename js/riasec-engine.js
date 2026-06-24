/**
 * RIASEC Scoring Engine — Imagination Spark XR
 * 30 archetypes across 14 career pathways, scored from spatial interactions.
 */

const RIASEC_DIMENSIONS = ['R', 'I', 'A', 'S', 'E', 'C'];

const DIMENSION_LABELS = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional'
};

const ARCHETYPES = [
  { id: 'builder',            name: 'The Builder',            primary: 'R', secondary: 'C', pathway: 'skilled-trades' },
  { id: 'fabricator',         name: 'The Fabricator',         primary: 'R', secondary: 'I', pathway: 'advanced-manufacturing' },
  { id: 'field-tech',         name: 'The Field Tech',         primary: 'R', secondary: 'E', pathway: 'skilled-trades' },
  { id: 'welder',             name: 'The Welder',             primary: 'R', secondary: 'A', pathway: 'skilled-trades' },
  { id: 'machinist',          name: 'The Machinist',          primary: 'R', secondary: 'I', pathway: 'advanced-manufacturing' },
  { id: 'analyst',            name: 'The Analyst',            primary: 'I', secondary: 'C', pathway: 'data-analytics' },
  { id: 'researcher',         name: 'The Researcher',         primary: 'I', secondary: 'A', pathway: 'biotech-lab' },
  { id: 'diagnostician',      name: 'The Diagnostician',      primary: 'I', secondary: 'R', pathway: 'healthcare' },
  { id: 'systems-thinker',    name: 'The Systems Thinker',    primary: 'I', secondary: 'E', pathway: 'it-cybersecurity' },
  { id: 'lab-scientist',      name: 'The Lab Scientist',      primary: 'I', secondary: 'S', pathway: 'biotech-lab' },
  { id: 'designer',           name: 'The Designer',           primary: 'A', secondary: 'I', pathway: 'design-media' },
  { id: 'storyteller',        name: 'The Storyteller',        primary: 'A', secondary: 'S', pathway: 'design-media' },
  { id: 'architect',          name: 'The Architect',          primary: 'A', secondary: 'R', pathway: 'architecture-engineering' },
  { id: 'creative-tech',      name: 'The Creative Tech',      primary: 'A', secondary: 'E', pathway: 'design-media' },
  { id: 'artisan',            name: 'The Artisan',            primary: 'A', secondary: 'C', pathway: 'skilled-trades' },
  { id: 'mentor',             name: 'The Mentor',             primary: 'S', secondary: 'E', pathway: 'education-training' },
  { id: 'caregiver',          name: 'The Caregiver',          primary: 'S', secondary: 'I', pathway: 'healthcare' },
  { id: 'advocate',           name: 'The Advocate',           primary: 'S', secondary: 'A', pathway: 'community-services' },
  { id: 'counselor',          name: 'The Counselor',          primary: 'S', secondary: 'C', pathway: 'community-services' },
  { id: 'coach',              name: 'The Coach',              primary: 'S', secondary: 'R', pathway: 'education-training' },
  { id: 'entrepreneur',       name: 'The Entrepreneur',       primary: 'E', secondary: 'R', pathway: 'business-entrepreneurship' },
  { id: 'project-lead',       name: 'The Project Lead',       primary: 'E', secondary: 'S', pathway: 'project-management' },
  { id: 'dealmaker',          name: 'The Dealmaker',          primary: 'E', secondary: 'C', pathway: 'business-entrepreneurship' },
  { id: 'innovator',          name: 'The Innovator',          primary: 'E', secondary: 'I', pathway: 'business-entrepreneurship' },
  { id: 'promoter',           name: 'The Promoter',           primary: 'E', secondary: 'A', pathway: 'marketing-communications' },
  { id: 'organizer',          name: 'The Organizer',          primary: 'C', secondary: 'E', pathway: 'logistics-supply-chain' },
  { id: 'quality-controller', name: 'The Quality Controller', primary: 'C', secondary: 'R', pathway: 'advanced-manufacturing' },
  { id: 'data-steward',       name: 'The Data Steward',       primary: 'C', secondary: 'I', pathway: 'data-analytics' },
  { id: 'compliance-pro',     name: 'The Compliance Pro',     primary: 'C', secondary: 'S', pathway: 'finance-accounting' },
  { id: 'process-engineer',   name: 'The Process Engineer',   primary: 'C', secondary: 'A', pathway: 'logistics-supply-chain' }
];

const PATHWAYS = [
  { id: 'skilled-trades',            name: 'Skilled Trades',                 icon: '🔧' },
  { id: 'advanced-manufacturing',    name: 'Advanced Manufacturing',         icon: '⚙️' },
  { id: 'healthcare',                name: 'Healthcare',                     icon: '🏥' },
  { id: 'biotech-lab',               name: 'Biotech & Lab Sciences',         icon: '🔬' },
  { id: 'it-cybersecurity',          name: 'IT & Cybersecurity',             icon: '🔒' },
  { id: 'data-analytics',            name: 'Data & Analytics',               icon: '📊' },
  { id: 'design-media',              name: 'Design & Media',                 icon: '🎨' },
  { id: 'architecture-engineering',  name: 'Architecture & Engineering',     icon: '📐' },
  { id: 'education-training',        name: 'Education & Training',           icon: '📚' },
  { id: 'community-services',        name: 'Community Services',             icon: '🤝' },
  { id: 'business-entrepreneurship', name: 'Business & Entrepreneurship',    icon: '💼' },
  { id: 'project-management',        name: 'Project Management',             icon: '📋' },
  { id: 'marketing-communications',  name: 'Marketing & Communications',     icon: '📣' },
  { id: 'logistics-supply-chain',    name: 'Logistics & Supply Chain',       icon: '🚛' },
  { id: 'finance-accounting',        name: 'Finance & Accounting',           icon: '💰' }
];

class RIASECEngine {
  constructor() {
    this.scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    this.responses = [];
    this.questionIndex = 0;
  }

  recordInteraction(questionId, dimensionScores) {
    this.responses.push({ questionId, dimensionScores, timestamp: Date.now() });
    for (const [dim, value] of Object.entries(dimensionScores)) {
      if (this.scores[dim] !== undefined) {
        this.scores[dim] += value;
      }
    }
    this.questionIndex++;
  }

  getProgress() {
    return { current: this.questionIndex, total: VIGNETTE_QUESTIONS.length };
  }

  isComplete() {
    return this.questionIndex >= VIGNETTE_QUESTIONS.length;
  }

  getNormalizedScores() {
    const maxPossible = Math.max(...Object.values(this.scores), 1);
    const normalized = {};
    for (const dim of RIASEC_DIMENSIONS) {
      normalized[dim] = Math.round((this.scores[dim] / maxPossible) * 100);
    }
    return normalized;
  }

  getTopDimensions(count = 3) {
    return RIASEC_DIMENSIONS
      .map(d => ({ dimension: d, label: DIMENSION_LABELS[d], score: this.scores[d] }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  getArchetype() {
    const top = this.getTopDimensions(2);
    const primary = top[0].dimension;
    const secondary = top[1].dimension;

    let match = ARCHETYPES.find(a => a.primary === primary && a.secondary === secondary);
    if (!match) {
      match = ARCHETYPES.find(a => a.primary === primary);
    }
    return match;
  }

  getPathways() {
    const archetype = this.getArchetype();
    const primaryPathway = PATHWAYS.find(p => p.id === archetype.pathway);

    const top3 = this.getTopDimensions(3);
    const relatedArchetypes = ARCHETYPES.filter(a =>
      top3.some(t => t.dimension === a.primary) && a.id !== archetype.id
    );

    const relatedPathwayIds = [...new Set(relatedArchetypes.map(a => a.pathway))];
    const relatedPathways = relatedPathwayIds
      .filter(id => id !== primaryPathway.id)
      .map(id => PATHWAYS.find(p => p.id === id))
      .slice(0, 3);

    return { primary: primaryPathway, related: relatedPathways };
  }

  getResults() {
    return {
      scores: this.getNormalizedScores(),
      rawScores: { ...this.scores },
      topDimensions: this.getTopDimensions(),
      archetype: this.getArchetype(),
      pathways: this.getPathways(),
      responses: this.responses,
      completedAt: new Date().toISOString()
    };
  }

  reset() {
    this.scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    this.responses = [];
    this.questionIndex = 0;
  }
}

const VIGNETTE_QUESTIONS = [
  {
    id: 'welding-bay',
    title: 'The Welding Bay',
    environment: 'welding',
    prompt: 'You step into a fabrication shop. Sparks fly as steel meets flame. What draws your attention?',
    choices: [
      { label: 'Pick up the torch and lay a bead', scores: { R: 5, A: 1 }, spatialTarget: 'torch' },
      { label: 'Inspect the weld quality chart',   scores: { I: 4, C: 2 }, spatialTarget: 'chart' },
      { label: 'Sketch a new bracket design',      scores: { A: 5, R: 1 }, spatialTarget: 'blueprint' }
    ]
  },
  {
    id: 'clinic-floor',
    title: 'The Clinic Floor',
    environment: 'clinic',
    prompt: 'A busy community health clinic. Patients wait, screens show vitals, a training room is open.',
    choices: [
      { label: 'Check the patient vitals monitor', scores: { I: 4, S: 2 }, spatialTarget: 'monitor' },
      { label: 'Greet the waiting patients',       scores: { S: 5, E: 1 }, spatialTarget: 'patients' },
      { label: 'Review the training schedule',     scores: { C: 4, S: 2 }, spatialTarget: 'schedule' }
    ]
  },
  {
    id: 'cnc-shop',
    title: 'The CNC Shop',
    environment: 'cnc',
    prompt: 'Precision machines hum. A part needs programming, quality checks are due, and a new hire needs orientation.',
    choices: [
      { label: 'Program the CNC machine',        scores: { R: 4, I: 3 }, spatialTarget: 'cnc-panel' },
      { label: 'Run quality measurements',        scores: { C: 5, I: 1 }, spatialTarget: 'caliper' },
      { label: 'Show the new hire around',         scores: { S: 4, E: 2 }, spatialTarget: 'new-hire' }
    ]
  },
  {
    id: 'design-studio',
    title: 'The Design Studio',
    environment: 'studio',
    prompt: 'A bright studio with drafting tables, 3D printers, and client mood boards.',
    choices: [
      { label: 'Start sketching on the tablet',   scores: { A: 5, I: 1 }, spatialTarget: 'tablet' },
      { label: 'Check the 3D printer output',      scores: { R: 4, A: 2 }, spatialTarget: 'printer' },
      { label: 'Present concepts to the client',   scores: { E: 4, A: 2 }, spatialTarget: 'client' }
    ]
  },
  {
    id: 'server-room',
    title: 'The Server Room',
    environment: 'server',
    prompt: 'Blinking LEDs, cool air, racks of servers. An alert flashes on the monitoring dashboard.',
    choices: [
      { label: 'Investigate the security alert',  scores: { I: 5, C: 1 }, spatialTarget: 'dashboard' },
      { label: 'Cable-manage the messy rack',      scores: { R: 3, C: 3 }, spatialTarget: 'rack' },
      { label: 'Brief the team on the incident',   scores: { E: 4, S: 2 }, spatialTarget: 'team' }
    ]
  },
  {
    id: 'community-center',
    title: 'The Community Center',
    environment: 'community',
    prompt: 'An after-school program is underway. Kids need tutoring, a mural is half-painted, and the budget needs review.',
    choices: [
      { label: 'Sit with the kids and tutor',     scores: { S: 5, A: 1 }, spatialTarget: 'tutoring-table' },
      { label: 'Finish painting the mural',        scores: { A: 4, S: 2 }, spatialTarget: 'mural' },
      { label: 'Balance the program budget',        scores: { C: 4, E: 2 }, spatialTarget: 'budget-desk' }
    ]
  },
  {
    id: 'warehouse',
    title: 'The Warehouse',
    environment: 'warehouse',
    prompt: 'A logistics hub: forklifts, inventory scanners, a dispatch board, and a team meeting about to start.',
    choices: [
      { label: 'Optimize the loading sequence',   scores: { C: 4, R: 2 }, spatialTarget: 'dispatch-board' },
      { label: 'Drive the forklift to stage loads', scores: { R: 5, E: 1 }, spatialTarget: 'forklift' },
      { label: 'Lead the shift briefing',           scores: { E: 5, S: 1 }, spatialTarget: 'podium' }
    ]
  },
  {
    id: 'biotech-lab',
    title: 'The Biotech Lab',
    environment: 'lab',
    prompt: 'Microscopes, centrifuges, and a clean room. A sample needs analysis, protocols need updating, results need presenting.',
    choices: [
      { label: 'Analyze the sample under the scope', scores: { I: 5, R: 1 }, spatialTarget: 'microscope' },
      { label: 'Update the lab protocols',            scores: { C: 4, I: 2 }, spatialTarget: 'protocol-binder' },
      { label: 'Present findings to the PI',          scores: { E: 3, I: 2, S: 1 }, spatialTarget: 'whiteboard' }
    ]
  },
  {
    id: 'startup-office',
    title: 'The Startup Office',
    environment: 'startup',
    prompt: 'Whiteboards covered in ideas, a pitch deck open on screen, and a prototype on the workbench.',
    choices: [
      { label: 'Tinker with the prototype',       scores: { R: 4, I: 2 }, spatialTarget: 'workbench' },
      { label: 'Refine the pitch deck',            scores: { E: 5, A: 1 }, spatialTarget: 'screen' },
      { label: 'Map out the business model',        scores: { E: 3, C: 3 }, spatialTarget: 'whiteboard' }
    ]
  },
  {
    id: 'outdoor-site',
    title: 'The Job Site',
    environment: 'outdoor',
    prompt: 'A construction site at golden hour. Blueprints on the tailgate, a surveyor\'s level, and a crew waiting for direction.',
    choices: [
      { label: 'Set up the surveyor\'s level',     scores: { R: 4, C: 2 }, spatialTarget: 'level' },
      { label: 'Study the blueprints',              scores: { I: 3, A: 3 }, spatialTarget: 'blueprints' },
      { label: 'Rally the crew and assign tasks',   scores: { E: 4, S: 2 }, spatialTarget: 'crew' }
    ]
  }
];

export { RIASECEngine, VIGNETTE_QUESTIONS, ARCHETYPES, PATHWAYS, RIASEC_DIMENSIONS, DIMENSION_LABELS };
