export function generateICSFile(step: string, stepNumber: number): string {
  const now = new Date();
  const reminderDate = new Date(now);
  reminderDate.setDate(reminderDate.getDate() + 7); // Reminder in 7 days
  
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FinanceWise AI//Budget Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}-${stepNumber}@financewise.ai
DTSTAMP:${formatDate(now)}
DTSTART:${formatDate(reminderDate)}
DTEND:${formatDate(new Date(reminderDate.getTime() + 3600000))}
SUMMARY:Budget Action Step ${stepNumber + 1}
DESCRIPTION:${step.replace(/\n/g, '\\n')}
LOCATION:FinanceWise AI
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder: ${step.substring(0, 50)}...
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;
  
  return icsContent;
}
