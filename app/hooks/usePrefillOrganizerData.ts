import { useFetcher } from 'react-router';
import { useRef, useState, useCallback } from 'react';

type OrganizerData = {
  organizerNik: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  organizerDivision: string;
  organizerDepartment: string;
};

export function usePrefillOrganizerData() {
  const fetcher = useFetcher();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [validNik, setValidNik] = useState(false);

  const handleNikChange = useCallback((nik: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (nik.length !== 6) {
      setValidNik(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setValidNik(true);
      fetcher.load(`/api/organizer-by-nik/${nik}`);
    }, 300);
  }, []);

  const data: OrganizerData | null = (() => {
    if (!validNik) return null;
    const organizer = fetcher.data as any;
    if (!organizer) return null;
    return {
      organizerNik: organizer.nik,
      organizerName: organizer.name,
      organizerEmail: organizer.email,
      organizerPhone: organizer.phone,
      organizerDivision: organizer.division?.id ?? '',
      organizerDepartment: organizer.department?.id ?? '',
    };
  })();

  return {
    data,
    onChange: handleNikChange,
    loading: validNik && fetcher.state === 'loading',
  };
}
