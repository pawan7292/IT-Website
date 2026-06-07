import { getNPTTime } from './nptTime';

export const ADMIN_EMAILS = [
  'mainaliaayush02@gmail.com',
  'techdigitalmarmat@gmail.com',
];

export function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
}

export function getGreeting() {
  const hour = getNPTTime().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function getTimerDisplay(checkInTimestamp) {
  const now = getNPTTime();
  const checkIn = new Date(checkInTimestamp?.seconds ? checkInTimestamp.seconds * 1000 : checkInTimestamp);
  const diffMs = now - checkIn;
  if (diffMs < 0) return '00:00:00';
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  const s = Math.floor((diffMs % 60000) / 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getOfficeProgressPercent() {
  const now = getNPTTime();
  const start = new Date(now); start.setHours(10, 0, 0, 0);
  const end = new Date(now); end.setHours(17, 0, 0, 0);
  return Math.max(0, Math.min(100, Math.round(((now - start) / (end - start)) * 100)));
}

export function getProgressBarColor(percent) {
  if (percent <= 50) return 'bg-blue-500';
  if (percent <= 85) return 'bg-green-500';
  if (percent <= 100) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getPriorityConfig(priority) {
  switch (priority) {
    case 'urgent': return { label: 'Urgent', color: 'bg-red-500/20 text-red-400 border border-red-500/40' };
    case 'high':   return { label: 'High',   color: 'bg-orange-500/20 text-orange-400 border border-orange-500/40' };
    case 'medium': return { label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' };
    case 'low':    return { label: 'Low',    color: 'bg-green-500/20 text-green-400 border border-green-500/40' };
    default:       return { label: 'None',   color: 'bg-gray-500/20 text-gray-400 border border-gray-500/40' };
  }
}

export function getStatusConfig(status) {
  switch (status) {
    case 'todo':         return { label: 'To Do',          color: 'bg-gray-500/20 text-gray-400' };
    case 'in_progress':  return { label: 'In Progress',    color: 'bg-blue-500/20 text-blue-400' };
    case 'under_review': return { label: 'Under Review',   color: 'bg-yellow-500/20 text-yellow-400' };
    case 'completed':    return { label: 'Completed',      color: 'bg-green-500/20 text-green-400' };
    default:             return { label: status,           color: 'bg-gray-500/20 text-gray-400' };
  }
}

export const TASK_COLUMNS = [
  { id: 'todo',         label: 'To Do',        accent: 'border-gray-500',   bg: 'bg-gray-500/10' },
  { id: 'in_progress',  label: 'In Progress',  accent: 'border-blue-500',   bg: 'bg-blue-500/10' },
  { id: 'under_review', label: 'Under Review', accent: 'border-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'completed',    label: 'Completed',    accent: 'border-green-500',  bg: 'bg-green-500/10' },
];

export const LEAVE_TYPES = [
  { id: 'full',           label: 'Full Day' },
  { id: 'half_morning',   label: 'Half Day Morning (10AM–1PM)' },
  { id: 'half_afternoon', label: 'Half Day Afternoon (1PM–5PM)' },
];

export const SOP_CATEGORIES = ['SEO', 'Content', 'Social Media', 'Client Management', 'HR', 'General'];

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export function getAttendanceBadge(status) {
  switch (status) {
    case 'present':     return { label: '🟢 On Time',       cls: 'bg-green-500/20 text-green-400' };
    case 'late':        return { label: '🟡 Late',           cls: 'bg-yellow-500/20 text-yellow-400' };
    case 'left_early':  return { label: '🟠 Left Early',     cls: 'bg-orange-500/20 text-orange-400' };
    case 'absent':      return { label: '🔴 Absent',         cls: 'bg-red-500/20 text-red-400' };
    case 'half_day':    return { label: '🌓 Half Day',       cls: 'bg-purple-500/20 text-purple-400' };
    case 'on_leave':    return { label: '🏖️ On Leave',       cls: 'bg-blue-500/20 text-blue-400' };
    case 'checked_out': return { label: '✅ Checked Out',   cls: 'bg-teal-500/20 text-teal-400' };
    default:            return { label: '⚪ Not Checked In', cls: 'bg-gray-500/20 text-gray-400' };
  }
}

export function getSmartStatusMessage(checkInTs, checkOutTs) {
  const now = getNPTTime();
  const hour = now.getHours();
  const min = now.getMinutes();

  if (checkOutTs) {
    const checkIn = new Date(checkInTs?.seconds ? checkInTs.seconds * 1000 : checkInTs);
    const checkOut = new Date(checkOutTs?.seconds ? checkOutTs.seconds * 1000 : checkOutTs);
    const diffMs = checkOut - checkIn;
    const totalMins = Math.floor(diffMs / 60000);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return { emoji: '🎉', msg: `Done for today! Total: ${hrs}h ${mins}m` };
  }

  const nowMins = hour * 60 + min;
  const officeMins = 10 * 60;
  const lunchStart = 12 * 60;
  const lunchEnd = 13 * 60;
  const officeEnd = 17 * 60;
  const lateThreshold = officeMins + 15;
  const veryLateThreshold = officeMins + 60;

  if (!checkInTs) return { emoji: '⏳', msg: 'Not checked in yet' };

  const checkIn = new Date(checkInTs?.seconds ? checkInTs.seconds * 1000 : checkInTs);
  const checkInMins = checkIn.getHours() * 60 + checkIn.getMinutes();
  const lateBy = Math.max(0, checkInMins - officeMins);

  if (nowMins > officeEnd) {
    return { emoji: '⚠️', msg: 'Past office hours! Please check out.' };
  }
  if (nowMins >= lunchStart && nowMins < lunchEnd) {
    return { emoji: '🍱', msg: 'Lunch hour — timer keeps running.' };
  }
  if (nowMins >= 15 * 60) {
    const remaining = officeEnd - nowMins;
    const remHrs = Math.floor(remaining / 60);
    const remMins = remaining % 60;
    return { emoji: '📉', msg: `${remHrs}h ${remMins}m remaining in office.` };
  }
  if (lateBy === 0 && nowMins < lateThreshold) {
    return { emoji: '✅', msg: 'Right on time! Good morning.' };
  }
  if (lateBy > 0 && lateBy <= 60) {
    return { emoji: '🟡', msg: `Arrived ${lateBy} minutes after 10:00 AM.` };
  }
  if (lateBy > 60) {
    return { emoji: '🔴', msg: `Late arrival — ${lateBy} mins late from 10:00 AM.` };
  }
  return { emoji: '✅', msg: 'Good morning!' };
}

export function getFileIcon(fileName) {
  const ext = fileName?.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':  return '📄';
    case 'doc':
    case 'docx': return '📝';
    case 'xls':
    case 'xlsx': return '📊';
    case 'ppt':
    case 'pptx': return '📊';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp': return '🖼️';
    case 'mp4':
    case 'mov':
    case 'avi':  return '🎬';
    case 'zip':
    case 'rar':  return '🗜️';
    case 'psd':  return '🎨';
    default:     return '📁';
  }
}

export function avatarInitials(name) {
  if (!name) return 'DM';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function colorFromName(name) {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
    'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
  ];
  let sum = 0;
  for (const c of (name || 'DM')) sum += c.charCodeAt(0);
  return colors[sum % colors.length];
}
