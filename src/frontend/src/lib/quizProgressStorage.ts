// Local storage utility for quiz progress persistence per authenticated user

export interface QuizProgressData {
  askedQuestions: string[];
  currentQuestionId: string | null;
  questionsCompleted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  isCompleted: boolean;
  lastUpdated: number;
}

const STORAGE_KEY_PREFIX = 'quiz_progress_';

// Get storage key for a specific user principal
function getStorageKey(principal: string): string {
  return `${STORAGE_KEY_PREFIX}${principal}`;
}

// Load quiz progress for a user
export function loadQuizProgress(principal: string): QuizProgressData | null {
  try {
    const key = getStorageKey(principal);
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    const data = JSON.parse(stored) as QuizProgressData;
    return data;
  } catch (error) {
    console.error('Failed to load quiz progress:', error);
    return null;
  }
}

// Save quiz progress for a user
export function saveQuizProgress(principal: string, progress: QuizProgressData): void {
  try {
    const key = getStorageKey(principal);
    progress.lastUpdated = Date.now();
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save quiz progress:', error);
  }
}

// Clear quiz progress for a user
export function clearQuizProgress(principal: string): void {
  try {
    const key = getStorageKey(principal);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear quiz progress:', error);
  }
}

// Initialize empty progress
export function initializeQuizProgress(): QuizProgressData {
  return {
    askedQuestions: [],
    currentQuestionId: null,
    questionsCompleted: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    isCompleted: false,
    lastUpdated: Date.now(),
  };
}

// Check if quiz is completed
export function isQuizCompleted(progress: QuizProgressData, totalQuestions: number): boolean {
  return progress.isCompleted || progress.askedQuestions.length >= totalQuestions;
}

// Mark question as asked
export function markQuestionAsked(
  progress: QuizProgressData,
  questionId: string
): QuizProgressData {
  if (!progress.askedQuestions.includes(questionId)) {
    return {
      ...progress,
      askedQuestions: [...progress.askedQuestions, questionId],
      currentQuestionId: questionId,
    };
  }
  return progress;
}

// Update progress after answer submission
export function updateProgressAfterAnswer(
  progress: QuizProgressData,
  isCorrect: boolean,
  totalQuestions: number
): QuizProgressData {
  const updated = {
    ...progress,
    questionsCompleted: progress.questionsCompleted + 1,
    correctAnswers: isCorrect ? progress.correctAnswers + 1 : progress.correctAnswers,
    incorrectAnswers: !isCorrect ? progress.incorrectAnswers + 1 : progress.incorrectAnswers,
  };
  
  // Check if completed
  updated.isCompleted = updated.askedQuestions.length >= totalQuestions;
  
  return updated;
}
