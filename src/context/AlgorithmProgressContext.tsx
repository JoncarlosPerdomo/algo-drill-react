import React, { createContext, useState, useEffect, useContext } from 'react';

export type ProgressStatus = 'needs-work' | 'comfortable' | null;

const STORAGE_KEY = 'algoDrillProgress';

type ProgressMap = Record<string, ProgressStatus>;

interface AlgorithmProgressContextType {
  progress: ProgressMap;
  setStatus: (id: string, status: ProgressStatus) => void;
  getStatus: (id: string) => ProgressStatus;
  resetProgress: () => void;
}

const AlgorithmProgressContext = createContext<AlgorithmProgressContextType | undefined>(undefined);

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

export const AlgorithmProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const setStatus = (id: string, status: ProgressStatus) => {
    setProgress((prev) => ({ ...prev, [id]: status }));
  };

  const getStatus = (id: string): ProgressStatus => progress[id] ?? null;

  const resetProgress = () => {
    setProgress({});
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AlgorithmProgressContext.Provider value={{ progress, setStatus, getStatus, resetProgress }}>
      {children}
    </AlgorithmProgressContext.Provider>
  );
};

export function useAlgorithmProgressContext() {
  const context = useContext(AlgorithmProgressContext);
  if (context === undefined) {
    throw new Error('useAlgorithmProgressContext must be used within an AlgorithmProgressProvider');
  }
  return context;
}
