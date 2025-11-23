import React, { createContext, useState, useEffect, useContext } from 'react';

export type ProgressStatus = 'needs-work' | 'comfortable' | 'complete' | null;

const STORAGE_KEY = 'algoDrillProgress';
const STORAGE_VERSION = 'v2';
const VERSIONED_STORAGE_KEY = `${STORAGE_KEY}_${STORAGE_VERSION}`;

interface AlgorithmData {
  status: ProgressStatus;
  code?: string;
}

type ProgressMap = Record<string, AlgorithmData>;

interface AlgorithmProgressContextType {
  progress: ProgressMap;
  setStatus: (id: string, status: ProgressStatus) => void;
  getStatus: (id: string) => ProgressStatus;
  saveCode: (id: string, code: string) => void;
  getCode: (id: string) => string | undefined;
  resetProgress: () => void;
}

const AlgorithmProgressContext = createContext<AlgorithmProgressContextType | undefined>(undefined);

function loadProgress(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    // Try loading v2 data first
    const rawV2 = window.localStorage.getItem(VERSIONED_STORAGE_KEY);
    if (rawV2) {
      return JSON.parse(rawV2) as ProgressMap;
    }

    // Migrate v1 data if it exists
    const rawV1 = window.localStorage.getItem(STORAGE_KEY);
    if (rawV1) {
      const oldProgress = JSON.parse(rawV1) as Record<string, ProgressStatus>;
      const migratedProgress: ProgressMap = {};
      
      for (const [id, status] of Object.entries(oldProgress)) {
        migratedProgress[id] = { status };
      }
      
      // Save migrated data and remove old key
      window.localStorage.setItem(VERSIONED_STORAGE_KEY, JSON.stringify(migratedProgress));
      window.localStorage.removeItem(STORAGE_KEY);
      
      return migratedProgress;
    }

    return {};
  } catch {
    return {};
  }
}

function saveProgress(progress: ProgressMap) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(VERSIONED_STORAGE_KEY, JSON.stringify(progress));
}

export const AlgorithmProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const setStatus = React.useCallback((id: string, status: ProgressStatus) => {
    setProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], status },
    }));
  }, []);

  const getStatus = React.useCallback((id: string): ProgressStatus => progress[id]?.status ?? null, [progress]);

  const saveCode = React.useCallback((id: string, code: string) => {
    setProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], status: prev[id]?.status ?? null, code },
    }));
  }, []);

  const getCode = React.useCallback((id: string): string | undefined => progress[id]?.code, [progress]);

  const resetProgress = React.useCallback(() => {
    setProgress({});
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(VERSIONED_STORAGE_KEY);
      window.localStorage.removeItem(STORAGE_KEY); // Clean up old key too
    }
  }, []);

  return (
    <AlgorithmProgressContext.Provider value={{ progress, setStatus, getStatus, saveCode, getCode, resetProgress }}>
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
