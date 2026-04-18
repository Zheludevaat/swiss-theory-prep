export function fmtMinutes(ms: number): string {
  const mins = Math.round(ms / 60_000);
  return mins < 1 ? "<1 min" : `${mins} min`;
}

export function fmtDate(ms: number): string {
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysUntil(dateStr: string | undefined, now = Date.now()): number | undefined {
  if (!dateStr) return undefined;
  const target = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return undefined;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.round(diff / (24 * 60 * 60 * 1000));
}
