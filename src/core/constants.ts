// Centralized physical constants (master prompt section 17). Every
// calculator must import from here rather than hard-coding its own copy.
// Values per CODATA 2018 / NIST reference constants.

export const PI = Math.PI;

/** Speed of light in vacuum, m/s (exact by SI definition). */
export const SPEED_OF_LIGHT = 299792458;

/** Vacuum permittivity, F/m. */
export const EPSILON_0 = 8.8541878128e-12;

/** Vacuum permeability, H/m. */
export const MU_0 = 1.25663706212e-6;

/** Boltzmann constant, J/K. */
export const BOLTZMANN = 1.380649e-23;

/** Elementary charge, C. */
export const ELEMENTARY_CHARGE = 1.602176634e-19;

/** Thermal voltage at ~300 K (room temperature), V. Common approximation used in diode equations. */
export const THERMAL_VOLTAGE_300K = 0.02585;
