/**
 * Comprehensive serialization utilities for converting between Motoko and JavaScript types
 * Handles BigInt, timestamps, and recursive data structure conversions
 */

/**
 * Convert Motoko timestamp (nanoseconds as BigInt) to JavaScript Date
 */
export function timestampToDate(timestamp: bigint | number): Date {
  const ts = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
  return new Date(ts / 1000000);
}

/**
 * Convert JavaScript Date to Motoko timestamp (nanoseconds as BigInt)
 */
export function dateToTimestamp(date: Date): bigint {
  return BigInt(date.getTime() * 1000000);
}

/**
 * Convert BigInt to number safely (with overflow check)
 */
export function bigIntToNumber(value: bigint | number): number {
  if (typeof value === 'number') return value;
  const num = Number(value);
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    console.warn('BigInt value exceeds safe integer range:', value);
  }
  return num;
}

/**
 * Convert number to BigInt safely
 */
export function numberToBigInt(value: number | bigint): bigint {
  if (typeof value === 'bigint') return value;
  return BigInt(Math.floor(value));
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: bigint | number, options?: Intl.DateTimeFormatOptions): string {
  const date = timestampToDate(timestamp);
  return date.toLocaleString('en-US', options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get current timestamp in Motoko format (nanoseconds)
 */
export function getCurrentTimestamp(): bigint {
  return BigInt(Date.now() * 1000000);
}

/**
 * Recursively convert all BigInt values to numbers in any data structure
 * This is the core function that prevents "Do not know how to serialize a BigInt" errors
 */
export function convertBigIntsToNumbers(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }

  // Convert BigInt to number
  if (typeof data === 'bigint') {
    return bigIntToNumber(data);
  }

  // Handle arrays recursively
  if (Array.isArray(data)) {
    return data.map(item => convertBigIntsToNumbers(item));
  }

  // Handle objects recursively
  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        result[key] = convertBigIntsToNumbers(data[key]);
      }
    }
    return result;
  }

  // Return primitive values as-is
  return data;
}

/**
 * Serialize transaction data for backend (converts numbers to BigInt where needed)
 */
export function serializeTransaction(transaction: any): any {
  return {
    ...transaction,
    date: typeof transaction.date === 'bigint' ? transaction.date : numberToBigInt(transaction.date || Date.now()),
    createdAt: typeof transaction.createdAt === 'bigint' ? transaction.createdAt : getCurrentTimestamp(),
  };
}

/**
 * Deserialize transaction data from backend (converts BigInt to numbers)
 */
export function deserializeTransaction(transaction: any): any {
  return convertBigIntsToNumbers(transaction);
}

/**
 * Serialize savings goal for backend
 */
export function serializeSavingsGoal(goal: any): any {
  return {
    ...goal,
    createdAt: typeof goal.createdAt === 'bigint' ? goal.createdAt : getCurrentTimestamp(),
  };
}

/**
 * Deserialize savings goal from backend
 */
export function deserializeSavingsGoal(goal: any): any {
  return convertBigIntsToNumbers(goal);
}

/**
 * Serialize user profile for backend
 */
export function serializeUserProfile(profile: any): any {
  return {
    ...profile,
    createdAt: typeof profile.createdAt === 'bigint' ? profile.createdAt : getCurrentTimestamp(),
  };
}

/**
 * Deserialize user profile from backend
 */
export function deserializeUserProfile(profile: any): any {
  return convertBigIntsToNumbers(profile);
}

/**
 * Serialize user preferences for backend
 */
export function serializeUserPreferences(prefs: any): any {
  return {
    ...prefs,
    updatedAt: typeof prefs.updatedAt === 'bigint' ? prefs.updatedAt : getCurrentTimestamp(),
  };
}

/**
 * Deserialize user preferences from backend
 */
export function deserializeUserPreferences(prefs: any): any {
  return convertBigIntsToNumbers(prefs);
}

/**
 * Serialize quiz progress for backend
 */
export function serializeQuizProgress(progress: any): any {
  return {
    ...progress,
    questionsCompleted: numberToBigInt(progress.questionsCompleted || 0),
    correctAnswers: numberToBigInt(progress.correctAnswers || 0),
    incorrectAnswers: numberToBigInt(progress.incorrectAnswers || 0),
    lastQuestionAt: typeof progress.lastQuestionAt === 'bigint' ? progress.lastQuestionAt : getCurrentTimestamp(),
  };
}

/**
 * Deserialize quiz progress from backend
 */
export function deserializeQuizProgress(progress: any): any {
  return convertBigIntsToNumbers(progress);
}

/**
 * Serialize chat message for backend
 */
export function serializeChatMessage(message: any): any {
  return {
    ...message,
    timestamp: typeof message.timestamp === 'bigint' ? message.timestamp : getCurrentTimestamp(),
  };
}

/**
 * Deserialize chat message from backend
 */
export function deserializeChatMessage(message: any): any {
  return convertBigIntsToNumbers(message);
}

/**
 * Serialize AI prediction for backend
 */
export function serializeAIPrediction(prediction: any): any {
  return {
    ...prediction,
    lastUpdated: typeof prediction.lastUpdated === 'bigint' ? prediction.lastUpdated : getCurrentTimestamp(),
  };
}

/**
 * Deserialize AI prediction from backend
 */
export function deserializeAIPrediction(prediction: any): any {
  return convertBigIntsToNumbers(prediction);
}

/**
 * Serialize contact submission for backend
 */
export function serializeContactSubmission(submission: any): any {
  return {
    ...submission,
    submittedAt: typeof submission.submittedAt === 'bigint' ? submission.submittedAt : getCurrentTimestamp(),
  };
}

/**
 * Deserialize contact submission from backend
 */
export function deserializeContactSubmission(submission: any): any {
  return convertBigIntsToNumbers(submission);
}

/**
 * Safe JSON stringify that handles BigInt by converting to numbers first
 */
export function safeStringify(obj: any): string {
  const converted = convertBigIntsToNumbers(obj);
  return JSON.stringify(converted);
}

/**
 * Safe JSON parse (standard parse, no special handling needed)
 */
export function safeParse(json: string): any {
  return JSON.parse(json);
}

/**
 * Serialize any data structure for backend (keeps BigInt as-is for backend compatibility)
 */
export function serializeForBackend(data: any): any {
  if (data === null || data === undefined) return data;
  
  if (typeof data === 'bigint') {
    return data;
  }
  
  if (typeof data === 'number') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => serializeForBackend(item));
  }
  
  if (typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        result[key] = serializeForBackend(data[key]);
      }
    }
    return result;
  }
  
  return data;
}

/**
 * Deserialize any data structure from backend (converts all BigInt to numbers)
 */
export function deserializeFromBackend(data: any): any {
  return convertBigIntsToNumbers(data);
}
