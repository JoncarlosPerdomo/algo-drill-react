import { useAlgorithmProgressContext, type ProgressStatus } from '../context/AlgorithmProgressContext';

export type { ProgressStatus };

export function useAlgorithmProgress() {
  return useAlgorithmProgressContext();
}
