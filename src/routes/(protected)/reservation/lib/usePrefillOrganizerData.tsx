import { createSignal } from 'solid-js';
import { getOrganizerByNikController } from '~/server/controller/organizer.server';

export default function usePrefillOrganizerData() {
  const [organizerData, setOrganizerData] = createSignal<{
    organizerNik: string;
    organizerName: string;
    organizerEmail: string;
    organizerPhone: string;
    organizerDivision: string;
    organizerDepartment: string;
  } | null>(null);
  const [nikLoading, setNikLoading] = createSignal(false);
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  const handleNikChange = async (nik: string) => {
    clearTimeout(debounceTimer);
    if (nik.length !== 6) {
      setOrganizerData(null);
      setNikLoading(false);
      return;
    }
    setNikLoading(true);
    debounceTimer = setTimeout(async () => {
      const organizer = await getOrganizerByNikController(nik);
      if (organizer) {
        setOrganizerData({
          organizerNik: nik,
          organizerName: organizer.name,
          organizerEmail: organizer.email,
          organizerPhone: organizer.phone,
          organizerDivision: organizer.division ?? '',
          organizerDepartment: organizer.department ?? '',
        });
      } else {
        setOrganizerData(null);
      }
      setNikLoading(false);
    }, 300);
  };

  return {
    data: organizerData,
    onChange: handleNikChange,
    loading: nikLoading,
  };
}
