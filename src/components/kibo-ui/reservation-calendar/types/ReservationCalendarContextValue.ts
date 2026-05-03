import { Accessor, Setter } from 'solid-js';

export type ReservationViewMode = 'month' | 'week' | 'day';

export type ReservationCalendarState = {
  month: number;
  year: number;
};

export type ReservationCalendarContextValue = {
  locale: Intl.LocalesArgument;
  startDay: number;

  month: Accessor<number>;
  setMonth: Setter<number>;

  year: Accessor<number>;
  setYear: Setter<number>;

  view: Accessor<ReservationViewMode>;
  setView: Setter<ReservationViewMode>;

  selectedDate: Accessor<Date>;
  setSelectedDate: Setter<Date>;

  selectedReservationId: Accessor<string | null>;
  setSelectedReservationId: Setter<string | null>;

  isMobile: Accessor<boolean>;
  setIsMobile: Setter<boolean>;

  isDetailPanelOpen: Accessor<boolean>;
  setDetailPanelOpen: Setter<boolean>;
};
