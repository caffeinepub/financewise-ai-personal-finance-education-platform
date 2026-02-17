import type { SavingsGoal } from '../../types/backend-types';
import { computeMonthsRemaining } from './goalPlanning';

export interface TrackingStatus {
  label: 'On track' | 'Behind schedule';
  expectedProgress: number;
  actualProgress: number;
  performanceScore: number;
}

/**
 * Computes tracking status and performance score
 * Performance score formula:
 * - Base score from progress vs expected progress (0-70 points)
 * - Bonus for being ahead of schedule (up to 30 points)
 * - Capped at 100
 */
export function computeTrackingStatus(goal: SavingsGoal): TrackingStatus {
  const now = Date.now();
  const elapsed = now - goal.createdAt;
  
  let totalDuration: number;
  if (goal.targetDate) {
    totalDuration = goal.targetDate - goal.createdAt;
  } else if (goal.targetMonths) {
    totalDuration = goal.targetMonths * 30 * 24 * 60 * 60 * 1000;
  } else {
    totalDuration = 6 * 30 * 24 * 60 * 60 * 1000; // Default 6 months
  }

  const timeProgress = Math.min(1, elapsed / totalDuration);
  const expectedProgress = timeProgress * 100;
  const actualProgress = goal.targetAmount > 0 
    ? (goal.currentAmount / goal.targetAmount) * 100 
    : 0;

  const isOnTrack = actualProgress >= expectedProgress;
  const label: 'On track' | 'Behind schedule' = isOnTrack ? 'On track' : 'Behind schedule';

  // Performance score calculation
  // Base score: how close actual is to expected (0-70 points)
  const progressRatio = expectedProgress > 0 ? actualProgress / expectedProgress : 1;
  const baseScore = Math.min(70, progressRatio * 70);
  
  // Bonus for being ahead (up to 30 points)
  const bonus = isOnTrack ? Math.min(30, (actualProgress - expectedProgress) * 0.5) : 0;
  
  const performanceScore = Math.min(100, Math.max(0, baseScore + bonus));

  return {
    label,
    expectedProgress,
    actualProgress,
    performanceScore: Math.round(performanceScore),
  };
}
