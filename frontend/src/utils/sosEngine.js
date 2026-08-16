/**
 * Smart SOS Priority Engine
 * Evaluates emergency signals to classify priority: Critical, High, or Medium
 */
export function calculateSOSPriority(payload) {
  const { medicalEmergency, trappedCount, ageGroup, batteryLevel, weatherRisk } = payload;
  
  let score = 0;

  if (medicalEmergency) score += 40;
  if (trappedCount > 2) score += 30;
  else if (trappedCount > 0) score += 15;
  if (ageGroup === "child_elderly") score += 20;
  if (batteryLevel < 15) score += 10;
  if (weatherRisk === "high") score += 15;

  let priority = "Medium";
  let color = "emerald";

  if (score >= 60) {
    priority = "Critical";
    color = "red";
  } else if (score >= 35) {
    priority = "High";
    color = "orange";
  }

  return { priority, score, color };
}