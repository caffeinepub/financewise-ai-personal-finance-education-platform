/**
 * Build information module - single source of truth for frontend version
 * and optional build metadata available at build time.
 */

export const buildInfo = {
  // Frontend build version from environment variable
  version: import.meta.env.VITE_APP_VERSION || 'unknown',
  
  // Optional build metadata
  timestamp: import.meta.env.VITE_BUILD_TIMESTAMP || null,
  gitSha: import.meta.env.VITE_GIT_SHA || null,
  
  // Environment flags
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
} as const;

// Target version for this rebuild
export const TARGET_VERSION = '242';

// Helper to check if current version matches target
export function isTargetVersion(): boolean {
  return buildInfo.version === TARGET_VERSION;
}
