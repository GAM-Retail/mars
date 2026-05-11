import { format } from 'date-fns';

function formatDate(date: Date): string {
  return format(date, 'dd MMMM yyyy');
}

function formatTimeRange(startTime: Date, endTime: Date): string {
  return `${format(startTime, 'kk:mm')} - ${format(endTime, 'kk:mm')}`;
}

interface MessageData {
  userName: string;
  status: 'Created' | 'Rescheduled' | 'Cancelled';
  startTime: Date;
  endTime: Date;
  roomName: string;
  location: string;
  department: string;
  secretariatName: string;
  secretariatExt: string;
}

export function buildReservationMessage(data: MessageData): string {
  const {
    userName,
    status,
    startTime,
    endTime,
    roomName,
    location,
    department,
    secretariatName,
    secretariatExt,
  } = data;

  const statusText = status.toLowerCase();

  let message = '';

  message += `Hello ${userName},\n`;
  message += `Your meeting room booking has been ${statusText} by the Secretariat. Please find the details below:\n`;
  message += `• Date: ${formatDate(startTime)}\n`;
  message += `• Time: ${formatTimeRange(startTime, endTime)}\n`;
  message += `• Room: ${roomName}\n`;
  message += `• Location: ${location}\n`;
  message += `• Department: ${department}\n`;
  message += `• Status: ${status}\n`;
  message += `• Secretariat: ${secretariatName} (Ext: ${secretariatExt})\n`;

  if (status === 'Rescheduled') {
    message += `\nPlease take note of the updated schedule.\n`;
  }

  if (status === 'Cancelled') {
    message += `\nIf this cancellation was not intended, please contact the Secretariat to arrange a new booking.\n`;
  }

  message += `\nIf you would like to reschedule or cancel this booking, please contact the Secretariat directly.\n`;
  message += `You can view your booking here:\n`;
  message += `${process.env.APP_URL || 'http://localhost:3000'} (This website is only accessible from the internal network.)\n`;
  message += `\nRegards,\n`;
  message += `Meeting Area Reservation System`;

  return message;
}
