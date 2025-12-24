/**
 * BIO-CHEMICAL ENGINE
 * 
 * Handles the enzymatic decay and molecular interactions.
 */

// CYP1A2 Enzyme variations (Genetic Metabolism Speed)
export const METABOLISM_RATES = {
    FAST: 4, // Hours half-life (Genotype AA)
    NORMAL: 5.7, // Hours half-life (Population Average)
    SLOW: 8 // Hours half-life (Genotype AC/CC)
};

/**
 * Calculates current concentration of a substance based on exponential decay.
 * N(t) = N0 * (1/2)^(t / half_life)
 * 
 * @param initialDose - mg
 * @param timeElapsed - hours
 * @param halfLife - hours
 */
export function calculateConcentration(initialDose: number, timeElapsed: number, halfLife: number): number {
    return initialDose * Math.pow(0.5, timeElapsed / halfLife);
}

/**
 * Calculates the percentage of Adenosine Receptors (A1/A2a) blocked by Caffeine.
 * This is a non-linear saturation curve (Michaelis-Menten dynamics approximation).
 * 
 * @param caffeineConcentration - mg (approximate blood level)
 */
export function calculateReceptorBlockage(caffeineConcentration: number): number {
    // 50mg saturates ~20%, 200mg saturates ~50%, 500mg saturates ~80%
    // K_m (constant) approx 200
    const K_m = 200;
    const blockage = caffeineConcentration / (caffeineConcentration + K_m);
    return Math.min(0.95, blockage); // Cap at 95% blockage (never 100%)
}
