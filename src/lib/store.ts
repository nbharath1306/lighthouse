import { create } from 'zustand';
import { calculateReceptorBlockage } from './science/chemistry';

export type SystemLog = {
    id: string;
    timestamp: string;
    message: string;
    type: "info" | "warning" | "alert" | "success";
};

interface BioState {
    wakeTime: number; // Hour 0-24
    caffeineIntake: number; // Hour 0-24, -1 if none
    stressLevel: number; // 0-1

    // New Live Metrics
    logs: SystemLog[];
    hrv: number; // Simulated Heart Rate Variability (ms)
    cognitiveLoad: number; // 0-100%

    // Molecular State (New)
    caffeineLevel: number; // mg
    maxCaffeine: number; // For visualization scaling
    receptorBlockage: number; // 0-1 (Percentage of receptors blocked)

    // Thermal State (New)
    cbt: number; // Core Body Temp (Celsius)
    vasodilation: boolean;

    setWakeTime: (time: number) => void;
    setCaffeineIntake: (time: number) => void;
    setStressLevel: (level: number) => void;
    addLog: (message: string, type?: SystemLog['type']) => void;
    setHrv: (val: number) => void;

    // Chemistry Actions
    ingestCaffeine: (mg: number) => void;
    updateChemistry: (elapsedHours: number) => void;

    // Thermal Actions
    triggerVasodilation: () => void;
}

export const useBioStore = create<BioState>((set, get) => ({
    wakeTime: 7, // Default 7 AM
    caffeineIntake: -1,
    stressLevel: 0,
    logs: [
        { id: 'init', timestamp: '00:00:01', message: 'SYSTEM_BOOT::SEQUENCE_INIT', type: 'info' }
    ],
    hrv: 65, // Baseline
    cognitiveLoad: 45,

    // Molecular Init
    caffeineLevel: 0,
    maxCaffeine: 1,
    receptorBlockage: 0,

    // Thermal Init
    cbt: 37.0,
    vasodilation: false,

    setWakeTime: (time) => set((state) => {
        // Only log if changed
        if (state.wakeTime !== time) {
            // We can't easily dispatch log here without infinite loop if we aren't careful, 
            // but for now simplistic approach is fine.
        }
        return { wakeTime: time };
    }),
    setCaffeineIntake: (time) => set({ caffeineIntake: time }),
    setStressLevel: (level) => set({ stressLevel: level }),

    addLog: (message, type = 'info') => set((state) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newLog = { id: Math.random().toString(36), timestamp, message, type };
        return { logs: [newLog, ...state.logs].slice(0, 50) }; // Keep last 50
    }),

    setHrv: (val) => set({ hrv: val }),

    ingestCaffeine: (mg) => set((state) => {
        const newLevel = state.caffeineLevel + mg;
        state.addLog(`INGESTION_DETECTED::${mg}mg_CAFFEINE`, 'alert');
        state.addLog('RECEPTOR_ANTAGONISM_INITIATED', 'warning');
        return {
            caffeineLevel: newLevel,
            maxCaffeine: Math.max(state.maxCaffeine, newLevel),
            receptorBlockage: calculateReceptorBlockage(newLevel)
        };
    }),

    // Simple decay tick
    updateChemistry: (elapsedHours) => set((state) => {
        if (state.caffeineLevel <= 0.1) return { caffeineLevel: 0, receptorBlockage: 0 };

        // Half-life of Caffeine is approx 5.7 hours
        // Decay Constant (lambda) = ln(2) / half_life
        const halfLife = 5.7;
        const decayConstant = Math.log(2) / halfLife;

        // C(t) = C0 * e^(-lambda * t)
        const newLevel = state.caffeineLevel * Math.exp(-decayConstant * elapsedHours);

        return {
            caffeineLevel: newLevel,
            receptorBlockage: calculateReceptorBlockage(newLevel)
        };
    }),

    triggerVasodilation: () => set((state) => {
        state.addLog('THERMAL_REGULATION::VASODILATION_TRIGGERED', 'success');
        state.addLog('HEAT_DUMP_ACTIVE::CBT_DROPPING', 'info');
        return {
            cbt: 36.2, // Drop to sleep optimal
            vasodilation: true
        };
    })
}));
