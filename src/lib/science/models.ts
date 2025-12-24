/**
 * THE TWO-PROCESS MODEL OF SLEEP REGULATION (Borbély, 1982)
 * 
 * This module calculates the interaction between:
 * 1. Process S (Homeostatic Sleep Drive): Increases exponentially during wakefulness.
 * 2. Process C (Circadian Rhythm): A sinusoidal wave controlled by the SCN.
 */

// Constants derived from quantitative sleep modeling
const PROCESS_S_TIME_CONSTANT_RISE = 18.2; // Hours
const PROCESS_S_TIME_CONSTANT_DECAY = 4.2; // Hours
const PROCESS_S_UPPER_ASYMPTOTE = 1; // Normalized max sleep pressure
const PROCESS_S_LOWER_ASYMPTOTE = 0; // Normalized min sleep pressure

/**
 * Calculates Process S (Homeostatic Sleep Pressure)
 * Uses an exponential saturation curve.
 * 
 * @param hoursAwake - Number of hours since last sleep
 * @param initialLevel - Starting pressure (usually 0 after full rest)
 */
export function calculateProcessS(hoursAwake: number, initialLevel = 0.1): number {
    // S(t) = 1 - (1 - S0) * e^(-t / tau_rise)
    return 1 - (1 - initialLevel) * Math.exp(-hoursAwake / PROCESS_S_TIME_CONSTANT_RISE);
}

/**
 * Calculates Process S Decay (Recovery during sleep)
 * 
 * @param hoursAsleep - Number of hours asleep
 * @param initialLevel - Pressure at sleep onset
 */
export function calculateProcessSDecay(hoursAsleep: number, initialLevel: number): number {
    // S(t) = S0 * e^(-t / tau_decay)
    return initialLevel * Math.exp(-hoursAsleep / PROCESS_S_TIME_CONSTANT_DECAY);
}

/**
 * Calculates Process C (Circadian Drive for Wakefulness)
 * A composite sine wave representing body temperature/alertness.
 * Peak typically around 6-8 PM, Trough around 4-5 AM.
 * 
 * @param timeOfDay - Hour of the day (0-24)
 */
export function calculateProcessC(timeOfDay: number): number {
    // Basic circadian algorithm:
    // C(t) = sin(2π * (t - phase) / 24) + harmonics
    // We adjust phase so trough is at ~4AM (hour 4) and peak at ~5PM (hour 17)

    const omega = (2 * Math.PI) / 24;
    const phaseShift = 4; // Shift to align trough with 4AM approx

    // Fundamental wave + 2nd harmonic for "Post-Lunch Dip" simulation
    const fundamental = Math.sin(omega * (timeOfDay - 8));
    const harmonic = 0.3 * Math.sin(2 * omega * (timeOfDay - 14)); // Creates the afternoon dip

    // Normalize to 0-1 range roughly, inverted because High C = High Alertness (Low Sleep Pressure)
    // But for the interaction graph, we usually plot "Sleep Threshold".
    // Let's return "Alertness Level" (-1 to 1)
    return fundamental + harmonic;
}

/**
 * Generates a full 24h simulation for the graph
 */
export function generateProcessData(wakeTime: number = 7, sleepTimeEstimate: number = 23) {
    const data = [];
    let currentS = 0.1; // Waking up refreshed-ish

    for (let i = 0; i <= 24; i += 0.5) { // 30 min increments
        const time = (wakeTime + i) % 24;
        const totalHoursAwake = i;

        // Calculate S
        if (totalHoursAwake < (sleepTimeEstimate - wakeTime + 24) % 24) {
            currentS = calculateProcessS(totalHoursAwake, 0.1);
        } else {
            // We are past "bedtime" in the sim, usually we just show the rise until crash
            currentS = calculateProcessS(totalHoursAwake, 0.1);
        }

        // Calculate C (Alertness)
        // We invert C for the "Threshold" visualization (High Alertness = Hard to Sleep)
        // Or we plot Alertness directly. Let's plot "Sleep Threshold" (Process C)
        // When S > C, sleep is possible.
        const rawC = calculateProcessC(time);

        // Map C to the same 0-1 scale as S for visual comparison
        // Process C modulates the threshold. High C (Alert) = High Threshold.
        const processC_Threshold = 0.5 + (rawC * 0.25);

        data.push({
            hour: time,
            timeLabel: `${Math.floor(time)}:${time % 1 === 0.5 ? '30' : '00'}`,
            processS: parseFloat(currentS.toFixed(3)),
            processC: parseFloat(processC_Threshold.toFixed(3)),
            delta: parseFloat((processC_Threshold - currentS).toFixed(3)) // The "Sleep Gate" distance
        });
    }
    return data;
}
