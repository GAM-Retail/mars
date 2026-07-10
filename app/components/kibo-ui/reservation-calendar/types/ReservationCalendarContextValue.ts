export type ReservationViewMode = 'month' | 'week' | 'day';

export type ReservationCalendarState = {
  month: number;
  year: number;
};

export type ReservationCalendarContextValue = {
  locale: Intl.LocalesArgument;
  startDay: number;

  month: number;
  setMonth: (value: number) => void;

  year: number;
  setYear: (value: number) => void;

  view: ReservationViewMode;
  setView: (value: ReservationViewMode) => void;

  selectedDate: Date;
  setSelectedDate: (value: Date) => void;

  selectedReservationId: string | null;
  setSelectedReservationId: (value: string | null) => void;

  isMobile: boolean;
  setIsMobile: (value: boolean) => void;

  isDetailPanelOpen: boolean;
  setDetailPanelOpen: (value: boolean) => void;
};
