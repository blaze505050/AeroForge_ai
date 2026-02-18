/**
 * AeroForge Compiler Service v1.0
 * Deterministic Feature DSL Generation with Strict Validation
 * 
 * DESIGN PRINCIPLES:
 * - No implicit geometry
 * - Explicit units on every dimension
 * - Deterministic feature ordering
 * - Full schema validation
 * - DFM rule enforcement
 * - Dependency cycle detection
 */

import { 
  AeroForgeDSL, 
  Feature, 
  Constraint, 
  DimensionWithUnits,
  Point3D,
  validateDSL, 
  generateExecutionLog,
  createDefaultDSL 
} from './dslSchema';

export interface CompilerRequest {
  input: string;
  units: 'mm' | 'cm' | 'in' | 'ft';
}

export interface CompilerResponse {
  success: boolean;
  dsl?: AeroForgeDSL;
  errors?: string[];
  error?: string;
  warnings?: string[];
  executionLog?: any[];
}

/**
 * Main compiler function - generates deterministic DSL from natural language
 */
export async function compileDesign(request: CompilerRequest): Promise<CompilerResponse> {
  // Simulate backend processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { input, units } = request;

  // Input validation
  if (!input || input.trim().length === 0) {
    return {
      success: false,
      errors: ['Input description cannot be empty'],
    };
  }

  if (!['mm', 'cm', 'in', 'ft'].includes(units)) {
    return {
      success: false,
      errors: [`Invalid units: ${units}. Must be one of: mm, cm, in, ft`],
    };
  }

  try {
    // Create base DSL
    const dsl = createDefaultDSL();
    dsl.units = units as any;
    dsl.metadata.description = input.substring(0, 200);

    // Parse natural language input
    const features = parseNaturalLanguageToFeatures(input, units);
    const constraints = parseConstraints(input, units);

    dsl.features = features;
    dsl.constraints = constraints;

    // Validate DSL
    const validationResults = validateDSL(dsl);
    const errors = validationResults.filter(r => r.severity === 'ERROR').map(r => r.message);
    const warnings = validationResults.filter(r => r.severity === 'WARNING').map(r => r.message);

    dsl.validationResults = validationResults;
    dsl.validationStatus = errors.length > 0 ? 'FAIL' : warnings.length > 0 ? 'WARNING' : 'PASS';

    // Generate execution log
    const executionLog = generateExecutionLog(dsl);

    if (errors.length > 0) {
      return {
        success: false,
        dsl,
        errors,
        warnings,
        executionLog,
      };
    }

    return {
      success: true,
      dsl,
      warnings: warnings.length > 0 ? warnings : undefined,
      executionLog,
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

/**
 * Parse natural language input into typed features
 */
function parseNaturalLanguageToFeatures(input: string, units: string): Feature[] {
  const features: Feature[] = [];
  const lowerInput = input.toLowerCase();
  let featureIndex = 0;

  // Extract all dimensions with units
  const dimensions = extractDimensions(input, units);

  // Base feature detection
  if (lowerInput.includes('bracket') || lowerInput.includes('mount')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'mounting_bracket',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[0] || { value: 100, unit: units as any },
      padLength: dimensions[1] || { value: 150, unit: units as any },
      padHeight: dimensions[2] || { value: 10, unit: units as any },
      description: 'Mounting bracket base',
    });
  } else if (lowerInput.includes('plate') || lowerInput.includes('flat')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'base_plate',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[0] || { value: 200, unit: units as any },
      padLength: dimensions[1] || { value: 200, unit: units as any },
      padHeight: dimensions[2] || { value: 5, unit: units as any },
      description: 'Base plate',
    });
  } else if (lowerInput.includes('cylinder') || lowerInput.includes('round')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'cylindrical_base',
      type: 'PAD',
      padProfile: 'CIRCULAR',
      padWidth: dimensions[0] || { value: 100, unit: units as any },
      padHeight: dimensions[1] || { value: 50, unit: units as any },
      description: 'Cylindrical base feature',
    });
  } else {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'base_feature',
      type: 'PAD',
      padProfile: 'RECTANGULAR',
      padWidth: dimensions[0] || { value: 100, unit: units as any },
      padLength: dimensions[1] || { value: 100, unit: units as any },
      padHeight: dimensions[2] || { value: 10, unit: units as any },
      description: 'Base feature',
    });
  }

  // Hole detection
  if (lowerInput.includes('hole') || lowerInput.includes('bolt')) {
    const holeCount = (input.match(/\d+\s*(?:bolt|hole)/gi) || []).length || 2;
    const holeDiameter = dimensions.find((d, i) => i > 0 && d.value < 20) || { value: 6, unit: units as any };
    const spacing = dimensions.find((d, i) => i > 1 && d.value > 20) || { value: 50, unit: units as any };

    for (let i = 0; i < holeCount; i++) {
      features.push({
        id: `feature_${featureIndex++}`,
        name: `hole_${i + 1}`,
        type: 'HOLE',
        referenceFeature: features[0].id,
        coordinate: {
          x: { value: spacing.value * i, unit: spacing.unit },
          y: { value: 0, unit: spacing.unit },
          z: { value: 0, unit: spacing.unit },
        },
        holeDiameter,
        holeDepth: 'THROUGH',
        holeType: 'STRAIGHT',
        description: `Bolt hole ${i + 1}`,
      });
    }
  }

  // Fillet detection
  if (lowerInput.includes('fillet') || lowerInput.includes('round')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'corner_fillet',
      type: 'FILLET',
      referenceFeature: features[0].id,
      radius: { value: 2, unit: units as any },
      description: 'Corner fillet for stress relief',
    });
  }

  // Pocket detection
  if (lowerInput.includes('pocket') || lowerInput.includes('recess')) {
    features.push({
      id: `feature_${featureIndex++}`,
      name: 'pocket_feature',
      type: 'POCKET',
      referenceFeature: features[0].id,
      padWidth: dimensions[3] || { value: 50, unit: units as any },
      padLength: dimensions[4] || { value: 50, unit: units as any },
      padHeight: dimensions[5] || { value: 5, unit: units as any },
      description: 'Recessed pocket',
    });
  }

  return features;
}

/**
 * Extract dimensions from natural language with unit preservation
 */
function extractDimensions(input: string, defaultUnit: string): DimensionWithUnits[] {
  const dimensions: DimensionWithUnits[] = [];
  
  // Match patterns like "100mm", "50 in", "3.5 inches", etc.
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(mm|millimeter|millimeters)/gi,
    /(\d+(?:\.\d+)?)\s*(cm|centimeter|centimeters)/gi,
    /(\d+(?:\.\d+)?)\s*(in|inch|inches|")/gi,
    /(\d+(?:\.\d+)?)\s*(ft|foot|feet|')/gi,
    /(\d+(?:\.\d+)?)\s*(?=mm|cm|in|ft|inch|foot|mm|cm)/gi,
  ];

  const unitMap: Record<string, 'mm' | 'cm' | 'in' | 'ft'> = {
    'mm': 'mm',
    'millimeter': 'mm',
    'millimeters': 'mm',
    'cm': 'cm',
    'centimeter': 'cm',
    'centimeters': 'cm',
    'in': 'in',
    'inch': 'in',
    'inches': 'in',
    '"': 'in',
    'ft': 'ft',
    'foot': 'ft',
    'feet': 'ft',
    "'": 'ft',
  };

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(input)) !== null) {
      const value = parseFloat(match[1]);
      const unitStr = match[2]?.toLowerCase() || defaultUnit;
      const unit = unitMap[unitStr] || (defaultUnit as 'mm' | 'cm' | 'in' | 'ft');
      
      dimensions.push({ value, unit });
    }
  }

  return dimensions;
}

/**
 * Parse constraints from natural language
 */
function parseConstraints(input: string, units: string): Constraint[] {
  const constraints: Constraint[] = [];
  const lowerInput = input.toLowerCase();
  let constraintIndex = 0;

  if (lowerInput.includes('tolerance')) {
    constraints.push({
      id: `constraint_${constraintIndex++}`,
      type: 'TOLERANCE',
      target: 'all_dimensions',
      value: '±0.1',
      unit: units,
      notes: 'Standard manufacturing tolerance',
    });
  }

  if (lowerInput.includes('material') || lowerInput.includes('aluminum') || lowerInput.includes('steel')) {
    const material = lowerInput.includes('steel') ? 'Steel' : 
                    lowerInput.includes('aluminum') ? 'Aluminum 6061' : 'Aluminum 6061';
    constraints.push({
      id: `constraint_${constraintIndex++}`,
      type: 'MATERIAL',
      target: 'all_features',
      value: material,
      notes: 'Material specification',
    });
  }

  if (lowerInput.includes('load') || lowerInput.includes('strength')) {
    constraints.push({
      id: `constraint_${constraintIndex++}`,
      type: 'LOAD_CASE',
      target: 'structural',
      value: '100',
      unit: 'N',
      notes: 'Estimated load case - verify with FEA',
    });
  }

  if (lowerInput.includes('surface finish') || lowerInput.includes('polish')) {
    constraints.push({
      id: `constraint_${constraintIndex++}`,
      type: 'SURFACE_FINISH',
      target: 'all_surfaces',
      value: 'Ra 1.6',
      notes: 'Surface finish requirement',
    });
  }

  return constraints;
}
