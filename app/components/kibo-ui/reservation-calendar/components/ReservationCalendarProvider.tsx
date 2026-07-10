import { useState, useEffect, type ReactNode } from 'react';
import { cn } from '~/lib/utils';
import { ReservationCalendarContext } from '~/components/kibo-ui/reservation-calendar/context/ReservationCalendarContext';
import type { ReservationCalendarContextValue } from '~/components/kibo-ui/reservation-calendar/types';

type ReservationCalendarProviderProps = {
  locale?: Intl.LocalesArgument;
  startDay?: number;
  class?: string;
  children?: ReactNode;
};

export function ReservationCalendarProvider(props: Readonly<ReservationCalendarProviderProps>) {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDetailPanelOpen, setDetailPanelOpen] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const value: ReservationCalendarContextValue = {
    locale: props.locale ?? 'en-US',
    startDay: props.startDay ?? 0,
    month,
    setMonth,
    year,
    setYear,
    view,
    setView,
    selectedDate,
    setSelectedDate,
    selectedReservationId,
    setSelectedReservationId,
    isMobile,
    setIsMobile,
    isDetailPanelOpen,
    setDetailPanelOpen,
  };

  return (
    <ReservationCalendarContext.Provider value={value}>
      <div className={cn('relative flex h-full w-full', props.class)}>{props.children}</div>
    </ReservationCalendarContext.Provider>
  );
}
