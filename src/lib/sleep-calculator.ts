export type SleepCycle = {
    cycles: number;
    hours: number;
    minutes: number;
    time: string; // Formatted 24h or 12h time
    label: string; // e.g. "Strict", "Optimal", "Lazy"
};

const CYCLE_MINUTES = 90;
const FALL_ASLEEP_MINUTES = 14;

/**
 * Calculate bedtimes based on a target wake-up time.
 * "If I want to wake up at [wakeTime], when should I go to bed?"
 * We count BACKWARDS from wakeTime.
 */
export function calculateBedtimes(wakeTime: Date): SleepCycle[] {
    const results: SleepCycle[] = [];
    const cyclesToCalc = [6, 5, 4]; // 9h, 7.5h, 6h

    cyclesToCalc.forEach((cycleCount) => {
        const sleepDurationMinutes = cycleCount * CYCLE_MINUTES;
        const totalMinutesBack = sleepDurationMinutes + FALL_ASLEEP_MINUTES;

        const bedtime = new Date(wakeTime.getTime() - totalMinutesBack * 60000);

        results.push({
            cycles: cycleCount,
            hours: Math.floor(sleepDurationMinutes / 60),
            minutes: sleepDurationMinutes % 60,
            time: formatTime(bedtime),
            label: getLabelForCycles(cycleCount)
        });
    });

    return results.reverse(); // Show earliest bedtime first? Or closest? Usually 6 cycles is best.
}

/**
 * Calculate wake windows based on a target bedtime (now or future).
 * "If I go to bed at [bedTime], when should I wake up?"
 * We count FORWARDS from bedTime + 15m.
 */
export function calculateWakeTimes(bedTime: Date): SleepCycle[] {
    const results: SleepCycle[] = [];
    const cyclesToCalc = [4, 5, 6];

    // Add falling asleep buffer first
    const sleepStartTime = new Date(bedTime.getTime() + FALL_ASLEEP_MINUTES * 60000);

    cyclesToCalc.forEach((cycleCount) => {
        const sleepDurationMinutes = cycleCount * CYCLE_MINUTES;
        const wakeTime = new Date(sleepStartTime.getTime() + sleepDurationMinutes * 60000);

        results.push({
            cycles: cycleCount,
            hours: Math.floor(sleepDurationMinutes / 60),
            minutes: sleepDurationMinutes % 60,
            time: formatTime(wakeTime),
            label: getLabelForCycles(cycleCount)
        });
    });

    return results;
}

function getLabelForCycles(cycles: number): string {
    if (cycles === 6) return "Optimal (9h)";
    if (cycles === 5) return "Standard (7.5h)";
    if (cycles === 4) return "Minimum (6h)";
    return `${cycles} Cycles`;
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
