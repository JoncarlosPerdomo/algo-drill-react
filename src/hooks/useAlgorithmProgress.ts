import { useEffect, useState } from 'react';

export type ProgressStatus = 'needs-work' | 'comfortable' | null;

const STORAGE_KEY = 'algoDrillProgress';

type ProgressMap = Record<string, ProgressStatus>;

function loadProgress(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: ProgressMap) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useAlgorithmProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const setStatus = (id: string, status: ProgressStatus) => {
    setProgress((prev) => ({ ...prev, [id]: status }));
  };

  const getStatus = (id: string): ProgressStatus => progress[id] ?? null;

  return { progress, setStatus, getStatus };
}
