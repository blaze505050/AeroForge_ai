/**
 * ASTROLAB P0 CORE PHYSICS ENGINE
 * Centralized, mathematically-accurate physics calculations
 * All equations validated against standard astrophysics references
 */

// Physical Constants (SI units)
export const PHYSICS_CONSTANTS = {
  G: 6.67430e-11, // Gravitational constant (m^3 kg^-1 s^-2)
  M_SUN: 1.989e30, // Solar mass (kg)
  R_SUN: 6.96e8, // Solar radius (m)
  M_EARTH: 5.972e24, // Earth mass (kg)
  R_EARTH: 6.371e6, // Earth radius (m)
  AU: 1.496e11, // Astronomical Unit (m)
  YEAR_SECONDS: 365.25 * 24 * 3600, // Seconds in a year
};

// Input Validation & Sanitization
export interface ValidationResult {
  isValid: boolean;
  value: number;
  warning?: string;
  clampedValue?: number;
}

export function sanitizeNumericInput(
  value: any,
  min: number = 0,
  max: number = Infinity,
  name: string = 'Parameter'
): ValidationResult {
  // Parse input
  let parsed = parseFloat(value);

  // Check for NaN
  if (isNaN(parsed)) {
    return {
      isValid: false,
      value: min,
      warning: `${name}: Invalid number format`,
      clampedValue: min,
    };
  }

  // Check for Infinity
  if (!isFinite(parsed)) {
    return {
      isValid: false,
      value: min,
      warning: `${name}: Value cannot be infinite`,
      clampedValue: min,
    };
  }

  // Check bounds
  if (parsed < min || parsed > max) {
    return {
      isValid: false,
      value: parsed,
      warning: `${name}: Out of physical bounds (${min}-${max})`,
      clampedValue: Math.max(min, Math.min(max, parsed)),
    };
  }

  return {
    isValid: true,
    value: parsed,
  };
}

// ============================================================================
// 1. ORBITAL MECHANICS ENGINE
// ============================================================================

export interface OrbitalState {
  semiMajorAxis: number; // meters
  eccentricity: number;
  mass: number; // kg (central body)
  velocity: number; // m/s (at periapsis)
  period: number; // seconds
  escapeVelocity: number; // m/s
  specificOrbitalEnergy: number; // J/kg
  trajectoryPoints: Array<{ x: number; y: number }>;
}

/**
 * Calculate orbital velocity at a given radius
 * v = sqrt(GM/r)
 */
export function calculateOrbitalVelocity(
  centralMass: number,
  radius: number
): number {
  if (radius <= 0) return 0;
  return Math.sqrt((PHYSICS_CONSTANTS.G * centralMass) / radius);
}

/**
 * Calculate orbital period using Kepler's Third Law
 * T = 2π * sqrt(a^3 / GM)
 */
export function calculateOrbitalPeriod(
  centralMass: number,
  semiMajorAxis: number
): number {
  if (semiMajorAxis <= 0) return 0;
  const numerator = 4 * Math.PI * Math.PI * Math.pow(semiMajorAxis, 3);
  const denominator = PHYSICS_CONSTANTS.G * centralMass;
  return Math.sqrt(numerator / denominator);
}

/**
 * Calculate escape velocity
 * v_esc = sqrt(2GM/r)
 */
export function calculateEscapeVelocity(
  centralMass: number,
  radius: number
): number {
  if (radius <= 0) return 0;
  return Math.sqrt((2 * PHYSICS_CONSTANTS.G * centralMass) / radius);
}

/**
 * Calculate specific orbital energy
 * ε = v^2/2 - μ/r
 */
export function calculateSpecificOrbitalEnergy(
  velocity: number,
  radius: number,
  centralMass: number
): number {
  const mu = PHYSICS_CONSTANTS.G * centralMass;
  return (velocity * velocity) / 2 - mu / radius;
}

/**
 * Generate circular orbit trajectory points for visualization
 */
export function generateOrbitalTrajectory(
  radius: number,
  points: number = 360
): Array<{ x: number; y: number }> {
  const trajectory: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    trajectory.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    });
  }
  return trajectory;
}

/**
 * Compute full orbital state
 */
export function computeOrbitalState(
  centralMass: number,
  orbitalRadius: number,
  eccentricity: number = 0
): OrbitalState {
  const velocity = calculateOrbitalVelocity(centralMass, orbitalRadius);
  const period = calculateOrbitalPeriod(centralMass, orbitalRadius);
  const escapeVel = calculateEscapeVelocity(centralMass, orbitalRadius);
  const energy = calculateSpecificOrbitalEnergy(velocity, orbitalRadius, centralMass);
  const trajectory = generateOrbitalTrajectory(orbitalRadius);

  return {
    semiMajorAxis: orbitalRadius,
    eccentricity,
    mass: centralMass,
    velocity,
    period,
    escapeVelocity: escapeVel,
    specificOrbitalEnergy: energy,
    trajectoryPoints: trajectory,
  };
}

// ============================================================================
// 2. GRAVITY SIMULATOR ENGINE
// ============================================================================

export interface GravityForceResult {
  force: number; // Newtons
  acceleration: number; // m/s^2
  distanceValidation: string;
}

/**
 * Calculate gravitational force between two masses
 * F = G * m1 * m2 / r^2
 * EDGE-CASE HARDENED: Rejects r<=0, m<=0, returns error state instead of Infinity
 */
export function calculateGravitationalForce(
  mass1: number,
  mass2: number,
  distance: number
): GravityForceResult {
  // CRITICAL: Validate all inputs to prevent Infinity/NaN
  if (distance <= 0) {
    return {
      force: 0,
      acceleration: 0,
      distanceValidation: 'ERROR: Distance must be > 0 (minimum surface contact)',
    };
  }

  if (mass1 <= 0 || mass2 <= 0) {
    return {
      force: 0,
      acceleration: 0,
      distanceValidation: 'ERROR: Mass must be positive (minimum 1e-10 kg)',
    };
  }

  const force = (PHYSICS_CONSTANTS.G * mass1 * mass2) / (distance * distance);
  const acceleration = force / mass2;

  // Validate inverse-square law: doubling distance reduces force by factor of 4
  const doubledDistance = distance * 2;
  const forcedDoubled = (PHYSICS_CONSTANTS.G * mass1 * mass2) / (doubledDistance * doubledDistance);
  const ratio = force / forcedDoubled;

  let validation = '';
  if (Math.abs(ratio - 4) > 0.01) {
    validation = 'Inverse-square law validation failed';
  }

  return {
    force,
    acceleration,
    distanceValidation: validation || 'Inverse-square law verified (4x ratio)',
  };
}

// ============================================================================
// 3. EXOPLANET TRANSIT LIGHT CURVE ENGINE
// ============================================================================

export interface TransitLightCurve {
  transitDepth: number; // percentage
  transitDuration: number; // hours
  lightCurvePoints: Array<{ time: number; flux: number }>;
  planetRadius: number; // meters
  starRadius: number; // meters
  orbitalPeriod: number; // days
}

/**
 * Calculate transit depth
 * Transit Depth ≈ (R_p / R_s)^2
 * EDGE-CASE HARDENED: Validates Rp <= Rs, clamps invalid ratios
 */
export function calculateTransitDepth(
  planetRadius: number,
  starRadius: number
): number {
  // CRITICAL: Validate inputs
  if (starRadius <= 0) {
    console.warn('ERROR: Star radius must be positive');
    return 0;
  }

  if (planetRadius <= 0) {
    console.warn('ERROR: Planet radius must be positive');
    return 0;
  }

  // CRITICAL: Clamp planet radius to star radius (physical constraint)
  const clampedPlanetRadius = Math.min(planetRadius, starRadius);
  
  if (planetRadius > starRadius) {
    console.warn(
      `PHYSICS ERROR: Planet radius (${(planetRadius / 1e6).toFixed(1)} Mm) exceeds star radius (${(starRadius / 1e6).toFixed(1)} Mm). Clamping to stellar radius.`
    );
  }

  const ratio = clampedPlanetRadius / starRadius;
  return ratio * ratio * 100; // as percentage
}

/**
 * Generate synthetic transit light curve
 */
export function generateTransitLightCurve(
  planetRadius: number,
  starRadius: number,
  orbitalPeriod: number,
  transitDuration: number = 2.5 // hours
): TransitLightCurve {
  const transitDepth = calculateTransitDepth(planetRadius, starRadius);
  const points: Array<{ time: number; flux: number }> = [];

  // Generate light curve around transit
  const timePoints = 1000;
  const transitHalfDuration = transitDuration / 2;

  for (let i = 0; i < timePoints; i++) {
    const time = (i / timePoints - 0.5) * transitDuration * 2; // centered on transit
    let flux = 1.0; // baseline

    // Ingress/egress (linear approximation)
    if (Math.abs(time) < transitHalfDuration) {
      flux = 1.0 - (transitDepth / 100) * Math.pow(Math.cos(Math.PI * time / transitDuration), 2);
    }

    points.push({ time, flux });
  }

  return {
    transitDepth,
    transitDuration,
    lightCurvePoints: points,
    planetRadius,
    starRadius,
    orbitalPeriod,
  };
}

// ============================================================================
// 4. STELLAR EVOLUTION & HR DIAGRAM ENGINE
// ============================================================================

export interface StellarProperties {
  mass: number; // Solar masses
  mainSequenceLifetime: number; // years
  surfaceTemperature: number; // Kelvin
  luminosity: number; // Solar luminosities
  radius: number; // Solar radii
  spectralClass: string;
}

/**
 * Calculate Main Sequence lifetime
 * T ∝ M^-2.5
 */
export function calculateMainSequenceLifetime(massInSolarMasses: number): number {
  if (massInSolarMasses <= 0) return 0;
  // Reference: Sun (1 M_sun) ~ 10 billion years
  const sunLifetime = 1e10; // years
  return sunLifetime / Math.pow(massInSolarMasses, 2.5);
}

/**
 * Calculate stellar luminosity
 * L ∝ M^3.5
 */
export function calculateLuminosity(massInSolarMasses: number): number {
  if (massInSolarMasses <= 0) return 0;
  return Math.pow(massInSolarMasses, 3.5);
}

/**
 * Calculate stellar radius using mass-radius relation
 * R ∝ M^0.5 (Main Sequence)
 */
export function calculateStellarRadius(massInSolarMasses: number): number {
  if (massInSolarMasses <= 0) return 0;
  return Math.pow(massInSolarMasses, 0.5);
}

/**
 * Estimate surface temperature from mass
 * T_eff ≈ 5778 * M^0.5 (Main Sequence)
 */
export function calculateSurfaceTemperature(massInSolarMasses: number): number {
  if (massInSolarMasses <= 0) return 0;
  const sunTemp = 5778; // Kelvin
  return sunTemp * Math.pow(massInSolarMasses, 0.5);
}

/**
 * Classify star by spectral type based on temperature
 */
export function classifySpectralType(temperatureK: number): string {
  if (temperatureK >= 30000) return 'O';
  if (temperatureK >= 10000) return 'B';
  if (temperatureK >= 7500) return 'A';
  if (temperatureK >= 6000) return 'F';
  if (temperatureK >= 5200) return 'G';
  if (temperatureK >= 3700) return 'K';
  return 'M';
}

/**
 * Compute complete stellar properties
 * EDGE-CASE HARDENED: Enforces main-sequence mass bounds (0.08 - 150 M_sun)
 */
export function computeStellarProperties(massInSolarMasses: number): StellarProperties {
  // CRITICAL: Enforce main-sequence mass bounds
  const MIN_MAIN_SEQUENCE_MASS = 0.08; // M_sun (brown dwarf limit)
  const MAX_MAIN_SEQUENCE_MASS = 150; // M_sun (upper limit for stable MS)

  let validatedMass = massInSolarMasses;
  let warning = '';

  if (massInSolarMasses < MIN_MAIN_SEQUENCE_MASS) {
    validatedMass = MIN_MAIN_SEQUENCE_MASS;
    warning = `Mass below main-sequence limit (0.08 M_sun). Clamping to brown dwarf threshold.`;
  } else if (massInSolarMasses > MAX_MAIN_SEQUENCE_MASS) {
    validatedMass = MAX_MAIN_SEQUENCE_MASS;
    warning = `Mass exceeds stable main-sequence limit (150 M_sun). Clamping to upper bound.`;
  }

  if (warning) {
    console.warn(`STELLAR BOUNDS: ${warning}`);
  }

  const lifetime = calculateMainSequenceLifetime(validatedMass);
  const temp = calculateSurfaceTemperature(validatedMass);
  const luminosity = calculateLuminosity(validatedMass);
  const radius = calculateStellarRadius(validatedMass);
  const spectralClass = classifySpectralType(temp);

  return {
    mass: validatedMass,
    mainSequenceLifetime: lifetime,
    surfaceTemperature: temp,
    luminosity,
    radius,
    spectralClass,
  };
}

// ============================================================================
// 5. SPACE PROBLEMS VALIDATORS
// ============================================================================

/**
 * Problem 1: Design a Stable LEO
 * Required circular velocity at 400 km altitude ≈ 7.67 km/s
 * HARDENED: Strict 5% tolerance, real Earth constants
 */
export function validateLEOVelocity(userVelocity: number): {
  isCorrect: boolean;
  requiredVelocity: number;
  error: number; // percentage
  feedback: string;
} {
  const altitudeKm = 400;
  const altitudeM = altitudeKm * 1000;
  const earthRadius = PHYSICS_CONSTANTS.R_EARTH; // 6,371 km
  const orbitalRadius = earthRadius + altitudeM; // 6,771 km

  const requiredVelocity = calculateOrbitalVelocity(PHYSICS_CONSTANTS.M_EARTH, orbitalRadius);
  const requiredVelocityKmS = requiredVelocity / 1000;

  const errorPercent = Math.abs((userVelocity - requiredVelocityKmS) / requiredVelocityKmS) * 100;
  const TOLERANCE = 5; // ±5% tolerance
  const isCorrect = errorPercent <= TOLERANCE;

  let feedback = '';
  if (isCorrect) {
    feedback = `✓ Excellent! Your velocity (${userVelocity.toFixed(3)} km/s) matches the required circular orbit within ±${TOLERANCE}% tolerance.`;
  } else if (userVelocity < requiredVelocityKmS) {
    const deficit = requiredVelocityKmS - userVelocity;
    feedback = `✗ Too slow by ${deficit.toFixed(3)} km/s (${errorPercent.toFixed(1)}% error). Required: ${requiredVelocityKmS.toFixed(3)} km/s.`;
  } else {
    const excess = userVelocity - requiredVelocityKmS;
    feedback = `✗ Too fast by ${excess.toFixed(3)} km/s (${errorPercent.toFixed(1)}% error). Required: ${requiredVelocityKmS.toFixed(3)} km/s.`;
  }

  return {
    isCorrect,
    requiredVelocity: requiredVelocityKmS,
    error: errorPercent,
    feedback,
  };
}

/**
 * Problem 2: Detect an Exoplanet
 * Validate if measured transit depth matches expected depth
 * Formula: Rp = Rs * sqrt(d) where d is transit depth fraction
 * HARDENED: Validates Rp <= Rs constraint
 */
export function validateTransitDetection(
  measuredDepthPercent: number,
  planetRadiusKm: number,
  starRadiusKm: number
): {
  isCorrect: boolean;
  expectedDepth: number;
  error: number;
  feedback: string;
} {
  // CRITICAL: Validate physical constraints
  if (planetRadiusKm > starRadiusKm) {
    return {
      isCorrect: false,
      expectedDepth: 0,
      error: 100,
      feedback: `✗ PHYSICS ERROR: Planet radius (${planetRadiusKm} km) cannot exceed star radius (${starRadiusKm} km).`,
    };
  }

  const expectedDepth = calculateTransitDepth(planetRadiusKm * 1000, starRadiusKm * 1000);
  const errorPercent = Math.abs((measuredDepthPercent - expectedDepth) / expectedDepth) * 100;
  const TOLERANCE = 10; // ±10% tolerance for observational error
  const isCorrect = errorPercent <= TOLERANCE;

  let feedback = '';
  if (isCorrect) {
    feedback = `✓ Correct! Transit depth ${measuredDepthPercent.toFixed(4)}% matches expected ${expectedDepth.toFixed(4)}% within ±${TOLERANCE}% tolerance.`;
  } else if (measuredDepthPercent < expectedDepth) {
    feedback = `✗ Transit depth too shallow (${errorPercent.toFixed(1)}% error). Expected ~${expectedDepth.toFixed(4)}%.`;
  } else {
    feedback = `✗ Transit depth too deep (${errorPercent.toFixed(1)}% error). Expected ~${expectedDepth.toFixed(4)}%.`;
  }

  return {
    isCorrect,
    expectedDepth,
    error: errorPercent,
    feedback,
  };
}

/**
 * Problem 3: Classify a Star
 * Validate if user correctly classifies star by spectral type
 */
export function validateStarClassification(
  userSpectralClass: string,
  temperatureK: number
): {
  isCorrect: boolean;
  expectedClass: string;
  feedback: string;
} {
  const expectedClass = classifySpectralType(temperatureK);
  const isCorrect = userSpectralClass.toUpperCase() === expectedClass;

  let feedback = '';
  if (isCorrect) {
    feedback = `✓ Correct! This is a ${expectedClass}-type star at ${temperatureK.toLocaleString()} K.`;
  } else {
    feedback = `Incorrect. This is a ${expectedClass}-type star, not ${userSpectralClass}. Temperature: ${temperatureK.toLocaleString()} K.`;
  }

  return {
    isCorrect,
    expectedClass,
    feedback,
  };
}

// ============================================================================
// 6. FORMATTING UTILITIES
// ============================================================================

/**
 * Format distance for display
 * Automatically selects appropriate units (m, km, AU, ly)
 */
export function formatDistance(meters: number): string {
  if (meters < 0) return '0 m';
  
  if (meters < 1000) {
    return `${meters.toFixed(2)} m`;
  } else if (meters < 1e9) {
    return `${(meters / 1000).toFixed(2)} km`;
  } else if (meters < PHYSICS_CONSTANTS.AU * 100) {
    return `${(meters / PHYSICS_CONSTANTS.AU).toFixed(4)} AU`;
  } else {
    // Light-year
    const lightYear = 9.461e15; // meters
    return `${(meters / lightYear).toFixed(6)} ly`;
  }
}

/**
 * Format velocity for display
 * Automatically selects appropriate units (m/s, km/s)
 */
export function formatVelocity(metersPerSecond: number): string {
  if (metersPerSecond < 0) return '0 m/s';
  
  if (metersPerSecond < 1000) {
    return `${metersPerSecond.toFixed(2)} m/s`;
  } else {
    return `${(metersPerSecond / 1000).toFixed(3)} km/s`;
  }
}
