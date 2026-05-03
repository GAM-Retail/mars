import { createSignal, onMount, type JSX } from 'solid-js';
import { cn } from '~/lib/utils';
import { ReservationCalendarContext } from '~/components/kibo-ui/reservation-calendar/context/ReservationCalendarContext';
import type { ReservationCalendarContextValue } from '~/components/kibo-ui/reservation-calendar/types';

type ReservationCalendarProviderProps = {
  locale?: Intl.LocalesArgument;
  startDay?: number;
  class?: string;
  children?: JSX.Element;
};

export function ReservationCalendarProvider(
  props: Readonly<ReservationCalendarProviderProps>,
): JSX.Element {
  const [month, setMonth] = createSignal<number>(new Date().getMonth());
  const [year, setYear] = createSignal<number>(new Date().getFullYear());
  const [view, setView] = createSignal<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = createSignal<Date>(new Date());
  const [selectedReservationId, setSelectedReservationId] = createSignal<string | null>(null);

  const [isMobile, setIsMobile] = createSignal<boolean>(
    globalThis.window === undefined ? false : window.innerWidth < 768,
  );
  const [isDetailPanelOpen, setDetailPanelOpen] = createSignal<boolean>(false);

  onMount(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  const value: ReservationCalendarContextValue = {
    get locale() {
      return props.locale ?? 'en-US';
    },
    get startDay() {
      return props.startDay ?? 0;
    },
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
      <div class={cn('relative flex h-full w-full', props.class)}>{props.children}</div>
    </ReservationCalendarContext.Provider>
  );
}
