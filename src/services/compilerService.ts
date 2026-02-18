/**
 * Mock Compiler Service
 * Simulates backend compiler behavior for Feature DSL generation
 */

export interface CompilerRequest {
  input: string;
  units: string;
}

export interface CompilerResponse {
  success: boolean;
  dsl?: Record<string, unknown>;
  errors?: string[];
  error?: string;
  warnings?: string[];
}

/**
 * Mock compiler that generates a Feature DSL from natural language input
 */
export async function compileDesign(request: CompilerRequest): Promise<CompilerResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const { input, units } = request;

  // Validate input
  if (!input || input.trim().length === 0) {
    return {
      success: false,
      errors: ['Input description cannot be empty'],
    };
  }

  // Parse the input for common keywords
  const lowerInput = input.toLowerCase();
  const hasHoles = lowerInput.includes('hole') || lowerInput.includes('bolt');
  const hasBracket = lowerInput.includes('bracket') || lowerInput.includes('mount');
  const hasPlate = lowerInput.includes('plate') || lowerInput.includes('flat');
  const hasRound = lowerInput.includes('round') || lowerInput.includes('circular') || lowerInput.includes('cylinder');

  // Extract dimensions using regex
  const dimensionRegex = /(\d+(?:\.\d+)?)\s*(mm|cm|inch|in|"|')?/gi;
  const dimensions: number[] = [];
  let match;
  while ((match = dimensionRegex.exec(input)) !== null) {
    dimensions.push(parseFloat(match[1]));
  }

  // Generate mock DSL
  const dsl = {
    version: '1.0.0',
    metadata: {
      generatedAt: new Date().toISOString(),
      units: units,
      description: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
    },
    features: generateFeatures(input, dimensions, units),
    constraints: generateConstraints(input, dimensions),
    validationStatus: 'PASS',
    warnings: generateWarnings(input),
  };

  return {
    success: true,
    dsl,
  };
}

function generateFeatures(input: string, dimensions: number[], units: string) {
  const features = [];
  const lowerInput = input.toLowerCase();

  // Base feature
  if (lowerInput.includes('bracket') || lowerInput.includes('mount')) {
    features.push({
      type: 'Pad',
      name: 'mounting_bracket',
      width: dimensions[0] || 100,
      length: dimensions[1] || 150,
      height: dimensions[2] || 10,
      units: units,
    });
  } else if (lowerInput.includes('plate') || lowerInput.includes('flat')) {
    features.push({
      type: 'Pad',
      name: 'base_plate',
      width: dimensions[0] || 200,
      length: dimensions[1] || 200,
      height: dimensions[2] || 5,
      units: units,
    });
  } else {
    features.push({
      type: 'Pad',
      name: 'base_feature',
      width: dimensions[0] || 100,
      length: dimensions[1] || 100,
      height: dimensions[2] || 10,
      units: units,
    });
  }

  // Holes
  if (lowerInput.includes('hole') || lowerInput.includes('bolt')) {
    const holeCount = (input.match(/\d+\s*(?:bolt|hole)/gi) || []).length || 2;
    const holeDiameter = dimensions.find((d, i) => i > 0 && d < 20) || 6;
    const spacing = dimensions.find((d, i) => i > 1 && d > 20) || 50;

    for (let i = 0; i < holeCount; i++) {
      features.push({
        type: 'Hole',
        name: `hole_${i + 1}`,
        diameter: holeDiameter,
        depth: 'Through',
        position: {
          x: (spacing * i),
          y: 0,
        },
        units: units,
      });
    }
  }

  // Rounds/Fillets
  if (lowerInput.includes('round') || lowerInput.includes('fillet')) {
    features.push({
      type: 'Fillet',
      name: 'corner_fillet',
      radius: 2,
      units: units,
    });
  }

  return features;
}

function generateConstraints(input: string, dimensions: number[]) {
  const constraints = [];

  if (input.toLowerCase().includes('tolerance')) {
    constraints.push({
      type: 'Tolerance',
      value: '±0.1',
      applies_to: 'all_dimensions',
    });
  }

  if (input.toLowerCase().includes('material')) {
    constraints.push({
      type: 'Material',
      value: 'Aluminum 6061',
    });
  }

  if (input.toLowerCase().includes('strength') || input.toLowerCase().includes('load')) {
    constraints.push({
      type: 'LoadCase',
      maxLoad: '100 N',
      direction: 'vertical',
    });
  }

  return constraints.length > 0 ? constraints : [{ type: 'Standard', description: 'Default manufacturing constraints' }];
}

function generateWarnings(input: string): string[] {
  const warnings = [];

  if (input.length < 20) {
    warnings.push('Input description is quite brief. Consider adding more details for better results.');
  }

  if (!input.toLowerCase().match(/\d+/)) {
    warnings.push('No dimensions detected. Using default values.');
  }

  if (input.toLowerCase().includes('complex') || input.toLowerCase().includes('advanced')) {
    warnings.push('Complex geometry detected. Manual review recommended.');
  }

  return warnings;
}
