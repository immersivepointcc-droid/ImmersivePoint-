/**
 * Digital Passport — writes RIASEC results in futureforge-scenario-schema-v1 format.
 * Queues writes offline; syncs when connectivity returns.
 */

const SCHEMA_VERSION = 'futureforge-scenario-schema-v1';
const PASSPORT_STORE_KEY = 'immersivepoint-passport';
const SYNC_QUEUE_KEY = 'immersivepoint-sync-queue';

class DigitalPassport {
  constructor() {
    this.learnerId = this._getOrCreateLearnerId();
  }

  _getOrCreateLearnerId() {
    let id = localStorage.getItem('immersivepoint-learner-id');
    if (!id) {
      id = 'learner-' + crypto.randomUUID();
      localStorage.setItem('immersivepoint-learner-id', id);
    }
    return id;
  }

  writeResult(riasecResults) {
    const record = {
      schema: SCHEMA_VERSION,
      version: '1.0.0',
      learnerId: this.learnerId,
      scenarioId: 'imagination-spark-xr',
      scenarioType: 'career-discovery',
      provider: 'immersivepoint',
      timestamp: new Date().toISOString(),
      duration: this._calculateDuration(riasecResults.responses),
      modality: this._detectModality(),
      payload: {
        assessment: 'riasec-spatial',
        scores: riasecResults.scores,
        rawScores: riasecResults.rawScores,
        topDimensions: riasecResults.topDimensions,
        archetype: {
          id: riasecResults.archetype.id,
          name: riasecResults.archetype.name,
          primary: riasecResults.archetype.primary,
          secondary: riasecResults.archetype.secondary
        },
        pathways: {
          primary: riasecResults.pathways.primary,
          related: riasecResults.pathways.related
        },
        interactions: riasecResults.responses.map(r => ({
          questionId: r.questionId,
          scores: r.dimensionScores,
          timestamp: r.timestamp
        }))
      }
    };

    this._saveLocal(record);
    this._queueSync(record);
    return record;
  }

  _calculateDuration(responses) {
    if (responses.length < 2) return 0;
    return responses[responses.length - 1].timestamp - responses[0].timestamp;
  }

  _detectModality() {
    if (navigator.xr) return 'xr';
    if ('ontouchstart' in window) return 'touch';
    return 'desktop';
  }

  _saveLocal(record) {
    const existing = JSON.parse(localStorage.getItem(PASSPORT_STORE_KEY) || '[]');
    existing.push(record);
    localStorage.setItem(PASSPORT_STORE_KEY, JSON.stringify(existing));
  }

  _queueSync(record) {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    queue.push(record);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));

    if (navigator.onLine) {
      this._attemptSync();
    }
  }

  async _attemptSync() {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
    if (queue.length === 0) return;

    // Stub: replace with actual Passport API endpoint
    console.log(`[Passport] ${queue.length} record(s) ready to sync`);
    console.log('[Passport] Sync endpoint not yet configured — records queued locally');
  }

  getHistory() {
    return JSON.parse(localStorage.getItem(PASSPORT_STORE_KEY) || '[]');
  }

  getPendingSyncCount() {
    return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]').length;
  }
}

export { DigitalPassport };
