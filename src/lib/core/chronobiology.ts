import { addMinutes, format, subMinutes } from "date-fns";

export const SLEEP_CYCLE_MINUTES = 90;
export const FALL_ASLEEP_MINUTES = 14; // Average time to fall asleep

export type SleepWindow = {
    cycleCount: number;
    time: Date;
    label: string;
    quality: "Optimal" | "Good" | "Emergency" | "Power Nap";
};

/**
 * Calculates wakeup times if you go to sleep NOW.
 */
export function calculateWakeUpTimes(startTime: Date = new Date()): SleepWindow[] {
    const sleepStart = addMinutes(startTime, FALL_ASLEEP_MINUTES);

    const cycles = [6, 5, 4, 3, 1]; // 9h, 7.5h, 6h, 4.5h, 1.5h

    return cycles.map(cycle => {
        const duration = cycle * SLEEP_CYCLE_MINUTES;
        const time = addMinutes(sleepStart, duration);

        let quality: SleepWindow['quality'] = "Good";
        if (cycle === 5) quality = "Optimal"; // 7.5h
        if (cycle === 6) quality = "Good"; // 9h
        if (cycle === 4) quality = "Good"; // 6h
        if (cycle === 3) quality = "Emergency"; // 4.5h
        if (cycle === 1) quality = "Power Nap"; // 1.5h

        return {
            cycleCount: cycle,
            time,
            label: format(time, "hh:mm a"),
            quality
        };
    }).sort((a, b) => a.time.getTime() - b.time.getTime());
}

/**
 * Calculates when to sleep if you want to wake up at a Specific Time.
 */
export function calculateSleepTimes(wakeTime: Date): SleepWindow[] {
    const cycles = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h

    return cycles.map(cycle => {
        const duration = cycle * SLEEP_CYCLE_MINUTES;
        // We subtract the duration AND the time it takes to fall asleep
        const bedtime = subMinutes(wakeTime, duration + FALL_ASLEEP_MINUTES);

        let quality: SleepWindow['quality'] = "Good";
        if (cycle === 5) quality = "Optimal";
        if (cycle === 6) quality = "Good";
        if (cycle === 4) quality = "Good";
        if (cycle === 3) quality = "Emergency";

        return {
            cycleCount: cycle,
            time: bedtime,
            label: format(bedtime, "hh:mm a"),
            quality
        };
    }).sort((a, b) => a.time.getTime() - b.time.getTime());
}
