export function calculateProgress(
  requiredFields: Record<string, boolean>,
  optionalFields: Record<string, boolean>
): number {
  const requiredCount = Object.values(requiredFields).filter(Boolean).length;
  const requiredTotal = Object.keys(requiredFields).length;
  const requiredWeight = 70;
  
  const optionalCount = Object.values(optionalFields).filter(Boolean).length;
  const optionalTotal = Object.keys(optionalFields).length;
  const optionalWeight = 30;
  
  const requiredProgress = (requiredCount / requiredTotal) * requiredWeight;
  const optionalProgress = (optionalCount / optionalTotal) * optionalWeight;
  
  return Math.round(requiredProgress + optionalProgress);
}
