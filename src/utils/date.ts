/**
 * Local date helpers to avoid timezone shift bugs (e.g. UTC vs Local Timezone)
 */

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getFranceDayOfWeek(d: Date = new Date()): number {
  const day = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  return day === 0 ? 7 : day; // Return 1 for Mon, 7 for Sun
}

export function getCurrentWeekDates(refDate: Date = new Date()): string[] {
  const dayOfWeek = getFranceDayOfWeek(refDate); // 1 = Monday
  const monday = new Date(refDate);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(refDate.getDate() - (dayOfWeek - 1));

  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(getLocalDateString(d));
  }
  return weekDates;
}

export function formatDisplayDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export const formatFrenchDate = formatDisplayDate;
