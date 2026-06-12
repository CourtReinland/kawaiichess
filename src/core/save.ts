import { Run } from './run';

/**
 * Run persistence in localStorage. Saved at map/shop/victory checkpoints;
 * quitting mid-battle resumes at the node choice before that battle.
 */

const KEY = 'kawaii-chess-save-v1';

export function saveRun(run: Run): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(run.serialize()));
  } catch {
    // storage full or unavailable — play on without persistence
  }
}

export function loadRun(): Run | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const run = Run.deserialize(JSON.parse(raw));
    return run.done ? null : run;
  } catch {
    return null;
  }
}

export function hasSave(): boolean {
  return loadRun() !== null;
}

export function clearSave(): void {
  localStorage.removeItem(KEY);
}
