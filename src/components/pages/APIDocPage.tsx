import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Code2, Server, Database, Lock, ArrowRight } from 'lucide-react';

export default function APIDocPage() {
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
                  REST API Specification
                </span>
              </div>
              <h1 className="font-heading text-5xl font-bold text-primary mb-4">
                AeroForge API v1.0
              </h1>
              <p className="font-paragraph text-lg text-foreground/70 max-w-3xl">
                Deterministic CAD compilation via REST endpoints. All responses are deterministic and reproducible.
              </p>
            </div>

            {/* Important Notice */}
            <div className="mb-12 p-6 border border-accent/20 bg-accent/5 rounded">
              <div className="flex gap-3">
                <Server className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg text-primary mb-2">API Specification Defined</h3>
                  <p className="font-paragraph text-base text-foreground/80">
                    The following API contract is defined for backend implementation. Execution backend runs locally or in private infrastructure. No public endpoints are currently available.
                  </p>
                </div>
              </div>
            </div>

            {/* Base URL */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">Base URL</h2>
              <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-sm">
                <code className="text-foreground">https://api.aeroforge.local/v1</code>
              </div>
              <p className="font-paragraph text-sm text-foreground/70 mt-3">
                Private infrastructure. Authentication via API key in Authorization header.
              </p>
            </div>

            {/* Authentication */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6" />
                Authentication
              </h2>
              <div className="bg-json-background p-6 rounded border border-secondary/20">
                <p className="font-paragraph text-sm text-foreground/80 mb-4">
                  All requests require an API key in the Authorization header:
                </p>
                <div className="bg-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto">
                  <code className="text-foreground">
                    Authorization: Bearer &lt;api_key&gt;
                  </code>
                </div>
              </div>
            </div>

            {/* Endpoints */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Endpoints</h2>

              {/* POST /compile */}
              <div className="mb-12 border border-secondary/20 rounded overflow-hidden">
                <div className="bg-json-background p-6 border-b border-secondary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-1 bg-accent text-accent-foreground rounded">
                      POST
                    </span>
                    <code className="font-mono text-sm text-foreground">/compile</code>
                  </div>
                  <p className="font-paragraph text-sm text-foreground/70">
                    Compile natural language input into deterministic Feature DSL
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Request */}
                  <div>
                    <h4 className="font-heading text-lg font-bold text-primary mb-3">Request Body</h4>
                    <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto">
                      <pre className="text-foreground">{`{
  "input": "Create a mounting bracket with two 6mm bolt holes spaced 50mm apart",
  "units": "mm"
}`}</pre>
                    </div>
                  </div>

                  {/* Response Success */}
                  <div>
                    <h4 className="font-heading text-lg font-bold text-primary mb-3">Response (200 OK)</h4>
                    <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto max-h-96">
                      <pre className="text-foreground">{`{
  "success": true,
  "dsl": {
    "version": "1.0",
    "metadata": {
      "title": "Mounting Bracket",
      "description": "Create a mounting bracket...",
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
        "name": "mounting_bracket",
        "type": "PAD",
        "padProfile": "RECTANGULAR",
        "padWidth": { "value": 100, "unit": "mm" },
        "padLength": { "value": 150, "unit": "mm" },
        "padHeight": { "value": 10, "unit": "mm" }
      },
      {
        "id": "feature_1",
        "name": "hole_1",
        "type": "HOLE",
        "referenceFeature": "feature_0",
        "holeDiameter": { "value": 6, "unit": "mm" },
        "holeDepth": "THROUGH",
        "holeType": "STRAIGHT"
      }
    ],
    "constraints": [
      {
        "id": "constraint_0",
        "type": "TOLERANCE",
        "target": "all_dimensions",
        "value": "±0.1",
        "unit": "mm"
      }
    ],
    "validationStatus": "PASS",
    "validationResults": [],
    "executionLog": [
      {
        "featureId": "feature_0",
        "featureName": "mounting_bracket",
        "timestamp": "2026-02-18T10:30:00.000Z",
        "status": "SUCCESS",
        "operation": "Execute PAD feature: mounting_bracket",
        "geometryHash": "a1b2c3d4"
      }
    ]
  },
  "executionLog": [...]
}`}</pre>
                    </div>
                  </div>

                  {/* Response Error */}
                  <div>
                    <h4 className="font-heading text-lg font-bold text-primary mb-3">Response (400 Bad Request)</h4>
                    <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto">
                      <pre className="text-foreground">{`{
  "success": false,
  "errors": [
    "Input description cannot be empty"
  ]
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* GET /dsl/:id */}
              <div className="mb-12 border border-secondary/20 rounded overflow-hidden">
                <div className="bg-json-background p-6 border-b border-secondary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-1 bg-blue-600 text-white rounded">
                      GET
                    </span>
                    <code className="font-mono text-sm text-foreground">/dsl/:id</code>
                  </div>
                  <p className="font-paragraph text-sm text-foreground/70">
                    Retrieve a previously compiled DSL by ID
                  </p>
                </div>

                <div className="p-6">
                  <h4 className="font-heading text-lg font-bold text-primary mb-3">Path Parameters</h4>
                  <div className="bg-json-background p-4 rounded border border-secondary/20">
                    <div className="font-mono text-sm text-foreground">
                      <div className="mb-2"><span className="text-accent">id</span> (string): DSL identifier</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* POST /validate */}
              <div className="mb-12 border border-secondary/20 rounded overflow-hidden">
                <div className="bg-json-background p-6 border-b border-secondary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-1 bg-accent text-accent-foreground rounded">
                      POST
                    </span>
                    <code className="font-mono text-sm text-foreground">/validate</code>
                  </div>
                  <p className="font-paragraph text-sm text-foreground/70">
                    Validate an existing DSL against schema and DFM rules
                  </p>
                </div>

                <div className="p-6">
                  <h4 className="font-heading text-lg font-bold text-primary mb-3">Request Body</h4>
                  <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto">
                    <pre className="text-foreground">{`{
  "dsl": { /* full DSL object */ }
}`}</pre>
                  </div>
                </div>
              </div>

              {/* POST /execute */}
              <div className="border border-secondary/20 rounded overflow-hidden">
                <div className="bg-json-background p-6 border-b border-secondary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-1 bg-accent text-accent-foreground rounded">
                      POST
                    </span>
                    <code className="font-mono text-sm text-foreground">/execute</code>
                  </div>
                  <p className="font-paragraph text-sm text-foreground/70">
                    Execute a validated DSL and generate deterministic geometry
                  </p>
                </div>

                <div className="p-6">
                  <h4 className="font-heading text-lg font-bold text-primary mb-3">Request Body</h4>
                  <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto">
                    <pre className="text-foreground">{`{
  "dsl": { /* full DSL object */ },
  "format": "step" | "stl" | "json"
}`}</pre>
                  </div>
                  <p className="font-paragraph text-sm text-foreground/70 mt-4">
                    <strong>Note:</strong> STEP/STL export requires deterministic local execution engine. JSON export always available.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Types */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Data Types</h2>

              <div className="space-y-8">
                {/* Feature Type */}
                <div className="border border-secondary/20 rounded p-6">
                  <h3 className="font-heading text-lg font-bold text-primary mb-4">Feature</h3>
                  <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto">
                    <pre className="text-foreground">{`{
  "id": string,
  "name": string,
  "type": "PAD" | "POCKET" | "HOLE" | "FILLET" | "CHAMFER" | "PATTERN" | "SHELL" | "DRAFT" | "RIB" | "AIRFOIL",
  "referenceFeature"?: string,
  "coordinate"?: Point3D,
  "padWidth"?: DimensionWithUnits,
  "padLength"?: DimensionWithUnits,
  "padHeight"?: DimensionWithUnits,
  "padProfile"?: "RECTANGULAR" | "CIRCULAR" | "CUSTOM",
  "holeDiameter"?: DimensionWithUnits,
  "holeDepth"?: DimensionWithUnits | "THROUGH",
  "holeType"?: "STRAIGHT" | "COUNTERSINK" | "COUNTERBORE",
  "radius"?: DimensionWithUnits,
  "description"?: string,
  "suppressionFlag"?: boolean
}`}</pre>
                  </div>
                </div>

                {/* DimensionWithUnits Type */}
                <div className="border border-secondary/20 rounded p-6">
                  <h3 className="font-heading text-lg font-bold text-primary mb-4">DimensionWithUnits</h3>
                  <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto">
                    <pre className="text-foreground">{`{
  "value": number,
  "unit": "mm" | "cm" | "in" | "ft"
}`}</pre>
                  </div>
                </div>

                {/* Constraint Type */}
                <div className="border border-secondary/20 rounded p-6">
                  <h3 className="font-heading text-lg font-bold text-primary mb-4">Constraint</h3>
                  <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs overflow-auto">
                    <pre className="text-foreground">{`{
  "id": string,
  "type": "TOLERANCE" | "MATERIAL" | "SURFACE_FINISH" | "LOAD_CASE" | "THERMAL" | "CUSTOM",
  "target": string,
  "value": string,
  "unit"?: string,
  "notes"?: string
}`}</pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Codes */}
            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Error Codes</h2>

              <div className="space-y-3">
                {[
                  { code: 400, message: 'Bad Request - Invalid input or malformed DSL' },
                  { code: 401, message: 'Unauthorized - Missing or invalid API key' },
                  { code: 403, message: 'Forbidden - Insufficient permissions' },
                  { code: 404, message: 'Not Found - DSL or resource not found' },
                  { code: 422, message: 'Unprocessable Entity - Validation failed' },
                  { code: 500, message: 'Internal Server Error - Backend execution failed' },
                ].map((error) => (
                  <div key={error.code} className="flex items-center gap-4 p-4 border border-secondary/20 rounded">
                    <div className="font-mono font-bold text-lg text-primary w-16">{error.code}</div>
                    <div className="font-paragraph text-sm text-foreground">{error.message}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate Limiting */}
            <div className="mb-12 p-6 border border-secondary/20 bg-secondary/5 rounded">
              <h3 className="font-heading text-lg font-bold text-primary mb-3">Rate Limiting</h3>
              <p className="font-paragraph text-sm text-foreground/80">
                API requests are rate-limited to 100 requests per minute per API key. Responses include rate limit headers:
              </p>
              <div className="bg-json-background p-4 rounded border border-secondary/20 font-mono text-xs mt-3 overflow-auto">
                <code className="text-foreground">{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1645100400`}</code>
              </div>
            </div>

            {/* Implementation Notes */}
            <div className="p-6 border border-accent/20 bg-accent/5 rounded">
              <h3 className="font-heading text-lg font-bold text-primary mb-3">Implementation Notes</h3>
              <ul className="space-y-2 font-paragraph text-sm text-foreground/80">
                <li>✓ All responses are deterministic and reproducible</li>
                <li>✓ DSL v1.0 is strict and versioned</li>
                <li>✓ No implicit geometry generation</li>
                <li>✓ Full validation before execution</li>
                <li>✓ Execution logs are timestamped and traceable</li>
                <li>✓ Geometry hashes enable reproducibility verification</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
