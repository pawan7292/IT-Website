export function getNPTTime() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + (5 * 60 + 45) * 60000);
}

export function formatNPT(date) {
  const npt = date instanceof Date ? date : new Date(date?.seconds ? date.seconds * 1000 : date);
  const utc = npt.getTime() + npt.getTimezoneOffset() * 60000;
  const nptDate = new Date(utc + (5 * 60 + 45) * 60000);
  return nptDate.toLocaleString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
    month: 'short', day: 'numeric', year: 'numeric'
  }) + ' NPT';
}

export function formatNPTTimeOnly(date) {
  const d = date instanceof Date ? date : new Date(date?.seconds ? date.seconds * 1000 : date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const nptDate = new Date(utc + (5 * 60 + 45) * 60000);
  return nptDate.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatNPTDate(date) {
  const d = date instanceof Date ? date : new Date(date?.seconds ? date.seconds * 1000 : date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const nptDate = new Date(utc + (5 * 60 + 45) * 60000);
  return nptDate.toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

export function getNPTDateString() {
  const now = getNPTTime();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
