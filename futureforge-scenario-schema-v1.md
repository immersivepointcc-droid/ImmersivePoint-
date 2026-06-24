# FutureForge Scenario Schema v1

Schema for Digital Passport records written by any ImmersivePoint scenario provider.

## Record Structure

```json
{
  "schema": "futureforge-scenario-schema-v1",
  "version": "1.0.0",
  "learnerId": "learner-<uuid>",
  "scenarioId": "imagination-spark-xr | ed-triage | mimbus-welding | ...",
  "scenarioType": "career-discovery | skill-assessment | simulation",
  "provider": "immersivepoint | mimbus | interplay | gwpro",
  "timestamp": "ISO-8601",
  "duration": 180000,
  "modality": "xr | touch | desktop",
  "payload": {
    // Provider-specific data — shape varies by scenarioType
  }
}
```

## Imagination Spark XR Payload

```json
{
  "assessment": "riasec-spatial",
  "scores": { "R": 80, "I": 60, "A": 40, "S": 30, "E": 50, "C": 20 },
  "rawScores": { "R": 12, "I": 9, "A": 6, "S": 4, "E": 7, "C": 3 },
  "topDimensions": [
    { "dimension": "R", "label": "Realistic", "score": 12 }
  ],
  "archetype": {
    "id": "welder",
    "name": "The Welder",
    "primary": "R",
    "secondary": "A"
  },
  "pathways": {
    "primary": { "id": "skilled-trades", "name": "Skilled Trades", "icon": "wrench" },
    "related": []
  },
  "interactions": [
    { "questionId": "welding-bay", "scores": { "R": 5, "A": 1 }, "timestamp": 1700000000 }
  ]
}
```

## Rules

1. Every provider writes the same top-level shape; `payload` is provider-specific.
2. Records are stored locally first (localStorage), queued for sync.
3. `learnerId` is device-stable, generated on first visit.
4. `modality` is auto-detected at write time.
5. Passport API endpoint replaces the stub in `passport.js` when available.
