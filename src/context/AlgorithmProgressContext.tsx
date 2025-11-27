import React, { createContext, useState, useEffect, useContext } from 'react';
import { get, set, del } from 'idb-keyval';

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
  isLoading: boolean;
}

const AlgorithmProgressContext = createContext<AlgorithmProgressContextType | undefined>(undefined);

export const AlgorithmProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load progress on mount
  useEffect(() => {
    const initProgress = async () => {
      try {
        // 1. Try loading from IndexedDB
        const dbData = await get<ProgressMap>(VERSIONED_STORAGE_KEY);
        
        if (dbData) {
          setProgress(dbData);
        } else {
          // 2. If no DB data, check for localStorage data (Migration)
          if (typeof window !== 'undefined') {
            const localV2 = window.localStorage.getItem(VERSIONED_STORAGE_KEY);
            const localV1 = window.localStorage.getItem(STORAGE_KEY);

            if (localV2) {
              // Migrate v2
              const parsed = JSON.parse(localV2) as ProgressMap;
              setProgress(parsed);
              await set(VERSIONED_STORAGE_KEY, parsed);
              window.localStorage.removeItem(VERSIONED_STORAGE_KEY);
            } else if (localV1) {
              // Migrate v1
              const oldProgress = JSON.parse(localV1) as Record<string, ProgressStatus>;
              const migratedProgress: ProgressMap = {};
              for (const [id, status] of Object.entries(oldProgress)) {
                migratedProgress[id] = { status };
              }
              setProgress(migratedProgress);
              await set(VERSIONED_STORAGE_KEY, migratedProgress);
              window.localStorage.removeItem(STORAGE_KEY);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initProgress();
  }, []);

  // Save progress on change
  useEffect(() => {
    if (!isLoading) {
      set(VERSIONED_STORAGE_KEY, progress).catch(err => 
        console.error('Failed to save progress:', err)
      );
    }
  }, [progress, isLoading]);

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

  const resetProgress = React.useCallback(async () => {
    setProgress({});
    try {
      await del(VERSIONED_STORAGE_KEY);
      // Double check cleanup of old keys just in case
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(VERSIONED_STORAGE_KEY);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to reset progress:', error);
    }
  }, []);

  return (
    <AlgorithmProgressContext.Provider value={{ progress, setStatus, getStatus, saveCode, getCode, resetProgress, isLoading }}>
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
