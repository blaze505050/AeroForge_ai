/**
 * CENTRALIZED PHYSICS ENGINE
 * Single source of truth for all ASTROLAB simulations
 * Ensures scientific accuracy and consistency across all tools
 */

// ============================================================================
// CONSTANTS
// ============================================================================

export const PHYSICS_CONSTANTS = {
  // Gravitational
  G: 6.67430e-11, // m^3 kg^-1 s^-2
  AU: 1.496e11, // meters
  SOLAR_MASS: 1.989e30, // kg
  EARTH_MASS: 5.972e24, // kg
  EARTH_RADIUS: 6.371e6, // meters
  
  // Orbital
  EARTH_ORBITAL_PERIOD: 365.25, // days
  EARTH_ORBITAL_VELOCITY: 29.78, // km/s
  
  // Stellar
  SOLAR_RADIUS: 6.96e8, // meters
  SOLAR_LUMINOSITY: 3.828e26, // watts
  SOLAR_TEMP: 5778, // Kelvin
  
  // Time
  SECONDS_PER_DAY: 86400,
  SECONDS_PER_YEAR: 31557600,
  
  // Misc
  PI: Math.PI,
  TWO_PI: 2 * Math.PI,
};

// ============================================================================
// ORBITAL MECHANICS
// ============================================================================

export interface OrbitalElements {
  a: number; // semi-major axis (AU)
  e: number; // eccentricity (0-1)
  i: number; // inclination (degrees)
  Omega: number; // longitude of ascending node (degrees)
  omega: number; // argument of periapsis (degrees)
  M: number; // mean anomaly (degrees)
  period?: number; // orbital period (days)
}

export interface CartesianPosition {
  x: number; // AU
  y: number; // AU
  z: number; // AU
  vx?: number; // AU/day
  vy?: number; // AU/day
  vz?: number; // AU/day
}

/**
 * Calculate orbital period from semi-major axis (Kepler's 3rd Law)
 * P^2 = a^3 (when P in years, a in AU)
 */
export function calculateOrbitalPeriod(semiMajorAxis: number): number {
  return Math.sqrt(semiMajorAxis ** 3) * 365.25; // days
}

/**
 * Calculate semi-major axis from orbital period
 */
export function calculateSemiMajorAxis(period: number): number {
  const periodYears = period / 365.25;
  return Math.cbrt(periodYears ** 2);
}

/**
 * Convert mean anomaly to eccentric anomaly (Newton-Raphson)
 */
export function meanToEccentricAnomaly(M: number, e: number, tolerance = 1e-6): number {
  const M_rad = (M * PHYSICS_CONSTANTS.PI) / 180;
  let E = M_rad;
  
  for (let i = 0; i < 100; i++) {
    const f = E - e * Math.sin(E) - M_rad;
    const fp = 1 - e * Math.cos(E);
    const E_new = E - f / fp;
    
    if (Math.abs(E_new - E) < tolerance) {
      return (E_new * 180) / PHYSICS_CONSTANTS.PI;
    }
    E = E_new;
  }
  
  return (E * 180) / PHYSICS_CONSTANTS.PI;
}

/**
 * Convert eccentric anomaly to true anomaly
 */
export function eccentricToTrueAnomaly(E: number, e: number): number {
  const E_rad = (E * PHYSICS_CONSTANTS.PI) / 180;
  const numerator = Math.sqrt(1 + e) * Math.sin(E_rad / 2);
  const denominator = Math.sqrt(1 - e) * Math.cos(E_rad / 2);
  const nu = 2 * Math.atan2(numerator, denominator);
  return (nu * 180) / PHYSICS_CONSTANTS.PI;
}

/**
 * Calculate distance from focus (Sun) at true anomaly
 */
export function calculateDistance(a: number, e: number, nu: number): number {
  const nu_rad = (nu * PHYSICS_CONSTANTS.PI) / 180;
  return (a * (1 - e ** 2)) / (1 + e * Math.cos(nu_rad));
}

/**
 * Convert orbital elements to Cartesian coordinates
 */
export function orbitalToCartesian(elements: OrbitalElements): CartesianPosition {
  const { a, e, i, Omega, omega, M } = elements;
  
  // Convert angles to radians
  const i_rad = (i * PHYSICS_CONSTANTS.PI) / 180;
  const Omega_rad = (Omega * PHYSICS_CONSTANTS.PI) / 180;
  const omega_rad = (omega * PHYSICS_CONSTANTS.PI) / 180;
  
  // Get anomalies
  const E = meanToEccentricAnomaly(M, e);
  const nu = eccentricToTrueAnomaly(E, e);
  const r = calculateDistance(a, e, nu);
  
  // Position in orbital plane
  const nu_rad = (nu * PHYSICS_CONSTANTS.PI) / 180;
  const x_orb = r * Math.cos(nu_rad);
  const y_orb = r * Math.sin(nu_rad);
  const z_orb = 0;
  
  // Rotation matrices
  const cos_omega = Math.cos(omega_rad);
  const sin_omega = Math.sin(omega_rad);
  const cos_Omega = Math.cos(Omega_rad);
  const sin_Omega = Math.sin(Omega_rad);
  const cos_i = Math.cos(i_rad);
  const sin_i = Math.sin(i_rad);
  
  // Apply rotations
  const x1 = x_orb * cos_omega - y_orb * sin_omega;
  const y1 = x_orb * sin_omega + y_orb * cos_omega;
  const z1 = z_orb;
  
  const x = x1 * cos_Omega - y1 * sin_Omega * cos_i;
  const y = x1 * sin_Omega + y1 * cos_Omega * cos_i;
  const z = y1 * sin_i;
  
  return { x, y, z };
}

/**
 * Convert Cartesian to orbital elements
 */
export function cartesianToOrbital(pos: CartesianPosition): OrbitalElements {
  const { x, y, z, vx = 0, vy = 0, vz = 0 } = pos;
  
  // Calculate orbital elements from position/velocity
  const r = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  const v = Math.sqrt((vx ?? 0) ** 2 + (vy ?? 0) ** 2 + (vz ?? 0) ** 2);
  
  // Semi-major axis (vis-viva equation)
  const a = 1 / (2 / r - v ** 2 / (PHYSICS_CONSTANTS.G * PHYSICS_CONSTANTS.SOLAR_MASS));
  
  // Eccentricity
  const h = x * (vy ?? 0) - y * (vx ?? 0);
  const e = Math.sqrt(1 - (h ** 2) / (PHYSICS_CONSTANTS.G * PHYSICS_CONSTANTS.SOLAR_MASS * a));
  
  // Inclination
  const i = Math.acos(z / r) * (180 / PHYSICS_CONSTANTS.PI);
  
  // Longitude of ascending node
  const Omega = Math.atan2(x, -y) * (180 / PHYSICS_CONSTANTS.PI);
  
  // Argument of periapsis
  const omega = Math.atan2(z / Math.sin((i * PHYSICS_CONSTANTS.PI) / 180), x * Math.cos((Omega * PHYSICS_CONSTANTS.PI) / 180) + y * Math.sin((Omega * PHYSICS_CONSTANTS.PI) / 180)) * (180 / PHYSICS_CONSTANTS.PI);
  
  // Mean anomaly (simplified)
  const M = 0;
  
  return { a, e, i, Omega, omega, M };
}

// ============================================================================
// N-BODY GRAVITY SIMULATION
// ============================================================================

export interface CelestialBody {
  id: string;
  name: string;
  mass: number; // kg
  x: number; // meters
  y: number; // meters
  z: number; // meters
  vx: number; // m/s
  vy: number; // m/s
  vz: number; // m/s
  radius?: number; // meters
}

/**
 * Calculate gravitational force between two bodies
 */
export function calculateGravitationalForce(
  body1: CelestialBody,
  body2: CelestialBody
): { fx: number; fy: number; fz: number } {
  const dx = body2.x - body1.x;
  const dy = body2.y - body1.y;
  const dz = body2.z - body1.z;
  
  const r = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);
  
  if (r < 1) return { fx: 0, fy: 0, fz: 0 }; // Prevent singularity
  
  const F = (PHYSICS_CONSTANTS.G * body1.mass * body2.mass) / (r ** 2);
  
  return {
    fx: (F * dx) / r,
    fy: (F * dy) / r,
    fz: (F * dz) / r,
  };
}

/**
 * Update body positions using Verlet integration
 */
export function updateBodies(bodies: CelestialBody[], dt: number): CelestialBody[] {
  const updated = bodies.map(b => ({ ...b }));
  
  // Calculate accelerations
  const accelerations = updated.map(() => ({ ax: 0, ay: 0, az: 0 }));
  
  for (let i = 0; i < updated.length; i++) {
    for (let j = 0; j < updated.length; j++) {
      if (i !== j) {
        const force = calculateGravitationalForce(updated[i], updated[j]);
        accelerations[i].ax += force.fx / updated[i].mass;
        accelerations[i].ay += force.fy / updated[i].mass;
        accelerations[i].az += force.fz / updated[i].mass;
      }
    }
  }
  
  // Update velocities and positions
  for (let i = 0; i < updated.length; i++) {
    updated[i].vx += accelerations[i].ax * dt;
    updated[i].vy += accelerations[i].ay * dt;
    updated[i].vz += accelerations[i].az * dt;
    
    updated[i].x += updated[i].vx * dt;
    updated[i].y += updated[i].vy * dt;
    updated[i].z += updated[i].vz * dt;
  }
  
  return updated;
}

// ============================================================================
// EXOPLANET TRANSIT DETECTION
// ============================================================================

export interface TransitEvent {
  depth: number; // fractional depth (0-1)
  duration: number; // hours
  time: number; // days from start
  snr: number; // signal-to-noise ratio
}

/**
 * Calculate transit depth (Rp/Rs)^2
 */
export function calculateTransitDepth(planetRadius: number, starRadius: number): number {
  return (planetRadius / starRadius) ** 2;
}

/**
 * Calculate transit duration
 */
export function calculateTransitDuration(
  orbitalPeriod: number,
  starRadius: number,
  planetOrbit: number,
  inclination: number
): number {
  const inc_rad = (inclination * PHYSICS_CONSTANTS.PI) / 180;
  const transitTime = (orbitalPeriod / PHYSICS_CONSTANTS.PI) * Math.asin((starRadius + 0.1 * starRadius) / planetOrbit / Math.sin(inc_rad));
  return transitTime * 24; // convert to hours
}

/**
 * Simulate transit light curve
 */
export function simulateTransitLightCurve(
  depth: number,
  duration: number,
  timePoints: number[] = Array.from({ length: 100 }, (_, i) => (i - 50) / 50 * duration * 1.5)
): number[] {
  return timePoints.map(t => {
    const normalized = Math.abs(t) / (duration / 2);
    if (normalized > 1) return 1;
    return 1 - depth * Math.max(0, 1 - normalized ** 2);
  });
}

// ============================================================================
// STELLAR EVOLUTION
// ============================================================================

export interface StellarProperties {
  mass: number; // solar masses
  radius: number; // solar radii
  temperature: number; // Kelvin
  luminosity: number; // solar luminosities
  age: number; // Gyr
}

/**
 * Calculate stellar radius from mass (mass-radius relation)
 */
export function calculateStellarRadius(mass: number): number {
  if (mass < 0.5) return mass ** 0.5;
  if (mass < 1.5) return mass ** 0.57;
  return mass ** 0.5;
}

/**
 * Calculate stellar temperature from mass and radius
 */
export function calculateStellarTemperature(mass: number, radius: number): number {
  const luminosity = calculateStellarLuminosity(mass);
  const temp = PHYSICS_CONSTANTS.SOLAR_TEMP * Math.sqrt(Math.sqrt(luminosity / (radius ** 2)));
  return Math.max(2500, Math.min(50000, temp));
}

/**
 * Calculate stellar luminosity from mass (mass-luminosity relation)
 */
export function calculateStellarLuminosity(mass: number): number {
  if (mass < 0.43) return mass ** 2.3;
  if (mass < 2) return mass ** 4.83;
  return mass ** 3.5;
}

/**
 * Get HR diagram position
 */
export function getHRDiagramPosition(mass: number): StellarProperties {
  const radius = calculateStellarRadius(mass);
  const luminosity = calculateStellarLuminosity(mass);
  const temperature = calculateStellarTemperature(mass, radius);
  
  return {
    mass,
    radius,
    temperature,
    luminosity,
    age: 0,
  };
}

// ============================================================================
// VALIDATION & ERROR HANDLING
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateOrbitalElements(elements: OrbitalElements): ValidationResult {
  const errors: string[] = [];
  
  if (elements.a <= 0) errors.push('Semi-major axis must be positive');
  if (elements.e < 0 || elements.e >= 1) errors.push('Eccentricity must be between 0 and 1');
  if (elements.i < 0 || elements.i > 180) errors.push('Inclination must be between 0 and 180 degrees');
  if (elements.M < 0 || elements.M > 360) errors.push('Mean anomaly must be between 0 and 360 degrees');
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateCelestialBody(body: CelestialBody): ValidationResult {
  const errors: string[] = [];
  
  if (body.mass <= 0) errors.push('Mass must be positive');
  if (!isFinite(body.x) || !isFinite(body.y) || !isFinite(body.z)) errors.push('Position must be finite');
  if (!isFinite(body.vx) || !isFinite(body.vy) || !isFinite(body.vz)) errors.push('Velocity must be finite');
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function degreesToRadians(degrees: number): number {
  return (degrees * PHYSICS_CONSTANTS.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / PHYSICS_CONSTANTS.PI;
}

export function formatScientific(value: number, decimals = 2): string {
  return value.toExponential(decimals);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters.toFixed(0)} m`;
  if (meters < 1e6) return `${(meters / 1000).toFixed(1)} km`;
  if (meters < 1e9) return `${(meters / 1e6).toFixed(1)} Mm`;
  if (meters < 1.496e11) return `${(meters / 1e9).toFixed(1)} Gm`;
  return `${(meters / 1.496e11).toFixed(3)} AU`;
}

export function formatVelocity(mps: number): string {
  if (mps < 1000) return `${mps.toFixed(1)} m/s`;
  return `${(mps / 1000).toFixed(2)} km/s`;
}
