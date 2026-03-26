import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Code2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DSLDocsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="w-full max-w-[120rem] mx-auto px-[8%] py-20">
          <div className="max-w-5xl">
            {/* Header */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-secondary-foreground/70">
                  Language Reference
                </span>
              </div>
              <h1 className="font-heading text-5xl font-bold text-primary mb-4">
                Design Language Specification
              </h1>
              <p className="font-paragraph text-lg text-foreground/70 max-w-3xl">
                Complete reference for the AeroForge design language. Deterministic, versioned, and fully validated.
              </p>
            </div>

            {/* Core Principles */}
            <div className="mb-16">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Core Principles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Explicit Units',
                    desc: 'Every dimension carries its unit. No implicit conversions.',
                  },
                  {
                    title: 'Deterministic Ordering',
                    desc: 'Features execute in strict sequence. No parallel or implicit dependencies.',
                  },
                  {
                    title: 'Named Features',
                    desc: 'Every feature has a unique ID and human-readable name for traceability.',
                  },
                  {
                    title: 'No Implicit Geometry',
                    desc: 'All geometry is explicit. No auto-repair or heuristic inference.',
                  },
                  {
                    title: 'Coordinate Systems',
                    desc: 'Global and feature-local coordinate systems are defined upfront.',
                  },
                  {
                    title: 'Full Validation',
                    desc: 'Schema, geometric, dependency, and DFM checks before execution.',
                  },
                ].map((principle, idx) => (
                  <div key={idx} className="p-6 border border-secondary/20 rounded bg-background">
                    <h3 className="font-heading text-lg font-bold text-primary mb-2">
                      {principle.title}
                    </h3>
                    <p className="font-paragraph text-sm text-foreground/70">
                      {principle.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* DSL Structure */}
            <div className="mb-16">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">DSL Structure</h2>

              <div className="bg-json-background p-6 rounded border border-secondary/20 font-mono text-xs overflow-auto mb-6">
                <pre className="text-foreground">{`{
  "version": "1.0",
  "metadata": {
    "title": string,
    "description": string,
    "author"?: string,
    "createdAt": ISO8601,
    "updatedAt": ISO8601
  },
  "units": "mm" | "cm" | "in" | "ft",
  "coordinateSystem": {
    "origin": [x, y, z],
    "xAxis": [x, y, z],
    "yAxis": [x, y, z],
    "zAxis": [x, y, z]
  },
  "features": Feature[],
  "constraints": Constraint[],
  "validationStatus": "PASS" | "FAIL" | "WARNING",
  "validationResults": ValidationResult[],
  "executionLog"?: ExecutionLog[]
}`}</pre>
              </div>

              <p className="font-paragraph text-sm text-foreground/70 mb-8">
                All fields are required unless marked with <code className="bg-json-background px-2 py-1 rounded">?</code>
              </p>
            </div>

            {/* Feature Types */}
            <div className="mb-16">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Feature Types</h2>

              <div className="space-y-6">
                {[
                  {
                    type: 'PAD',
                    desc: 'Extrude a rectangular or circular profile',
                    params: ['padWidth', 'padLength', 'padHeight', 'padProfile'],
                  },
                  {
                    type: 'POCKET',
                    desc: 'Cut a recessed feature into an existing face',
                    params: ['padWidth', 'padLength', 'padHeight', 'referenceFeature'],
                  },
                  {
                    type: 'HOLE',
                    desc: 'Create a hole with optional countersink/counterbore',
                    params: ['holeDiameter', 'holeDepth', 'holeType', 'coordinate'],
                  },
                  {
                    type: 'FILLET',
                    desc: 'Round edges with specified radius',
                    params: ['radius', 'referenceFeature'],
                  },
                  {
                    type: 'CHAMFER',
                    desc: 'Bevel edges with specified distance',
                    params: ['chamferDistance', 'referenceFeature'],
                  },
                  {
                    type: 'PATTERN',
                    desc: 'Replicate features in linear or circular array',
                    params: ['patternType', 'patternCount', 'patternSpacing', 'referenceFeature'],
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="border border-secondary/20 rounded p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-heading text-lg font-bold text-primary">
                        {feature.type}
                      </h3>
                      <span className="font-mono text-xs px-2 py-1 bg-accent/10 text-accent rounded">
                        Feature
                      </span>
                    </div>
                    <p className="font-paragraph text-sm text-foreground/70 mb-4">
                      {feature.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {feature.params.map((param) => (
                        <span key={param} className="font-mono text-xs px-2 py-1 bg-secondary/10 text-foreground/70 rounded">
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div className="mb-16">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Constraints</h2>

              <p className="font-paragraph text-sm text-foreground/70 mb-8">
                Constraints define manufacturing, material, and design requirements. They are validated before execution.
              </p>

              <div className="space-y-4">
                {[
                  { type: 'TOLERANCE', example: '±0.1 mm', desc: 'Dimensional tolerance' },
                  { type: 'MATERIAL', example: 'Aluminum 6061', desc: 'Material specification' },
                  { type: 'SURFACE_FINISH', example: 'Ra 1.6', desc: 'Surface finish requirement' },
                  { type: 'LOAD_CASE', example: '100 N', desc: 'Structural load specification' },
                  { type: 'THERMAL', example: '-40 to +85°C', desc: 'Thermal operating range' },
                  { type: 'CUSTOM', example: 'User-defined', desc: 'Custom constraint' },
                ].map((constraint, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 border border-secondary/20 rounded">
                    <div className="font-mono font-bold text-sm text-primary w-32">{constraint.type}</div>
                    <div className="flex-1">
                      <p className="font-paragraph text-sm text-foreground">{constraint.desc}</p>
                      <p className="font-mono text-xs text-foreground/60 mt-1">Example: {constraint.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Rules */}
            <div className="mb-16">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Validation Rules</h2>

              <div className="space-y-6">
                {[
                  {
                    title: 'Schema Validation',
                    rules: [
                      'Version must be exactly "1.0"',
                      'All required fields must be present',
                      'Feature IDs must be unique',
                      'Feature types must be valid',
                    ],
                  },
                  {
                    title: 'Geometric Validation',
                    rules: [
                      'Dimensions must be positive',
                      'Coordinates must be within reasonable bounds',
                      'Feature references must exist',
                      'No self-referencing features',
                    ],
                  },
                  {
                    title: 'Dependency Validation',
                    rules: [
                      'No circular dependencies',
                      'Features can only reference previously defined features',
                      'Reference features must exist in the DSL',
                    ],
                  },
                  {
                    title: 'Unit Consistency',
                    rules: [
                      'All dimensions must use declared units',
                      'Unit conversions are explicit',
                      'Mixed units within a feature are allowed if explicit',
                    ],
                  },
                  {
                    title: 'DFM (Design for Manufacturing)',
                    rules: [
                      'Hole diameter ≥ 0.5mm (CNC drilling)',
                      'Wall thickness ≥ 1mm (injection molding)',
                      'Fillet radius ≥ 0.5mm (machinability)',
                      'Feature spacing ≥ 2mm (tool clearance)',
                    ],
                  },
                ].map((section, idx) => (
                  <div key={idx} className="border border-secondary/20 rounded p-6">
                    <h3 className="font-heading text-lg font-bold text-primary mb-4">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.rules.map((rule, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-3 font-paragraph text-sm text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Example DSL */}
            <div className="mb-16">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Complete Example</h2>

              <div className="bg-json-background p-6 rounded border border-secondary/20 font-mono text-xs overflow-auto max-h-96">
                <pre className="text-foreground">{`{
  "version": "1.0",
  "metadata": {
    "title": "Mounting Bracket",
    "description": "Simple aluminum bracket with bolt holes",
    "author": "AeroForge Compiler",
    "createdAt": "2026-02-18T10:30:00Z",
    "updatedAt": "2026-02-18T10:30:00Z"
  },
  "units": "mm",
  "coordinateSystem": {
    "origin": [0, 0, 0],
    "xAxis": [1, 0, 0],
    "yAxis": [0, 1, 0],
    "zAxis": [0, 0, 1]
  },
  "features": [
    {
      "id": "feature_0",
      "name": "base_plate",
      "type": "PAD",
      "padProfile": "RECTANGULAR",
      "padWidth": { "value": 100, "unit": "mm" },
      "padLength": { "value": 150, "unit": "mm" },
      "padHeight": { "value": 10, "unit": "mm" },
      "description": "Base mounting plate"
    },
    {
      "id": "feature_1",
      "name": "hole_1",
      "type": "HOLE",
      "referenceFeature": "feature_0",
      "coordinate": {
        "x": { "value": 25, "unit": "mm" },
        "y": { "value": 75, "unit": "mm" },
        "z": { "value": 0, "unit": "mm" }
      },
      "holeDiameter": { "value": 6, "unit": "mm" },
      "holeDepth": "THROUGH",
      "holeType": "STRAIGHT"
    },
    {
      "id": "feature_2",
      "name": "hole_2",
      "type": "HOLE",
      "referenceFeature": "feature_0",
      "coordinate": {
        "x": { "value": 125, "unit": "mm" },
        "y": { "value": 75, "unit": "mm" },
        "z": { "value": 0, "unit": "mm" }
      },
      "holeDiameter": { "value": 6, "unit": "mm" },
      "holeDepth": "THROUGH",
      "holeType": "STRAIGHT"
    },
    {
      "id": "feature_3",
      "name": "corner_fillet",
      "type": "FILLET",
      "referenceFeature": "feature_0",
      "radius": { "value": 2, "unit": "mm" }
    }
  ],
  "constraints": [
    {
      "id": "constraint_0",
      "type": "TOLERANCE",
      "target": "all_dimensions",
      "value": "±0.1",
      "unit": "mm",
      "notes": "Standard manufacturing tolerance"
    },
    {
      "id": "constraint_1",
      "type": "MATERIAL",
      "target": "all_features",
      "value": "Aluminum 6061",
      "notes": "Lightweight, corrosion-resistant"
    }
  ],
  "validationStatus": "PASS",
  "validationResults": [],
  "executionLog": [
    {
      "featureId": "feature_0",
      "featureName": "base_plate",
      "timestamp": "2026-02-18T10:30:00.000Z",
      "status": "SUCCESS",
      "operation": "Execute PAD feature: base_plate",
      "geometryHash": "a1b2c3d4"
    }
  ]
}`}</pre>
              </div>
            </div>

            {/* Best Practices */}
            <div className="p-6 border border-accent/20 bg-accent/5 rounded">
              <h3 className="font-heading text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Best Practices
              </h3>
              <ul className="space-y-2 font-paragraph text-sm text-foreground/80">
                <li>✓ Always include explicit units on every dimension</li>
                <li>✓ Use descriptive feature names for traceability</li>
                <li>✓ Define coordinate systems upfront</li>
                <li>✓ Reference features by ID, not by position</li>
                <li>✓ Include all relevant constraints</li>
                <li>✓ Validate DSL before execution</li>
                <li>✓ Review execution logs for determinism verification</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
