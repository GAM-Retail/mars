import { useMemo } from 'react';
import { useReservationCalendarContext } from '~/components/kibo-ui/reservation-calendar/hooks/useReservationCalendarContext';
import { cn } from '~/lib/utils';
import {
  getDay,
  getDaysInMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getHours,
  differenceInMinutes,
} from 'date-fns';
import type { Reservation } from '~/components/kibo-ui/reservation-calendar/types';

export type ReservationCalendarBodyProps = {
  reservations: Reservation[];
  class?: string;
};

const HOUR_HEIGHT = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function ReservationEvent(props: Readonly<{ reservation: Reservation; view: 'week' | 'day' }>) {
  const { setSelectedReservationId, setDetailPanelOpen, isMobile } =
    useReservationCalendarContext();

  const handleClick = () => {
    setSelectedReservationId(props.reservation.id);
    if (isMobile) {
      setDetailPanelOpen(true);
    }
  };

  const startHour = getHours(props.reservation.startTime);
  const duration = differenceInMinutes(props.reservation.endTime, props.reservation.startTime);

  return (
    <button
      type="button"
      className={cn(
        'absolute right-1 cursor-pointer rounded-md border-l-4 px-2 py-1 text-xs shadow-sm transition-all hover:opacity-80',
        props.view === 'week' ? 'left-1' : 'left-10',
      )}
      style={{
        top: `${startHour * HOUR_HEIGHT + 2}px`,
        height: `${duration}px`,
        borderLeftColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
      }}
      onClick={handleClick}
      onKeyDown={handleClick}
      tabIndex={0}
    >
      {props.view === 'week' && (
        <div className="flex flex-col gap-0.5 text-left h-full overflow-hidden">
          <span className="font-semibold truncate text-sm">{props.reservation.organizer.name}</span>
          <span className="text-xs text-muted-foreground">
            {format(props.reservation.startTime, 'HH:mm')} -{' '}
            {format(props.reservation.endTime, 'HH:mm')}
          </span>
          <span className="truncate text-xs text-muted-foreground/80">
            {props.reservation.room.name}
          </span>
          <span className="truncate text-xs text-muted-foreground/70">
            {props.reservation.agenda || 'Reservation'}
          </span>
        </div>
      )}
      {props.view === 'day' && (
        <div className="flex flex-col gap-0.5 text-left h-full overflow-hidden">
          <span className="font-semibold text-xs">
            {format(props.reservation.startTime, 'HH:mm')} -{' '}
            {format(props.reservation.endTime, 'HH:mm')}
          </span>
          <span className="text-sm truncate font-medium">
            {props.reservation.agenda || 'Reservation'}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {props.reservation.room.name} • {props.reservation.organizer.name}
          </span>
          {props.reservation.organizer.department && (
            <span className="text-xs text-muted-foreground/80 truncate">
              {props.reservation.organizer.department.name}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

function MonthView(props: Readonly<{ reservations: Reservation[] }>) {
  const { month, year, startDay, setSelectedReservationId, setDetailPanelOpen, isMobile } =
    useReservationCalendarContext();

  const currentMonthDate = useMemo(() => new Date(year, month, 1), [year, month]);
  const daysInMonth = useMemo(() => getDaysInMonth(currentMonthDate), [currentMonthDate]);
  const firstDay = useMemo(
    () => (getDay(currentMonthDate) - startDay + 7) % 7,
    [currentMonthDate, startDay],
  );

  const prevMonthData = useMemo(() => {
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
    const prevMonthDaysArray = Array.from({ length: prevMonthDays }, (_, i) => i + 1);
    return { prevMonthDays, prevMonthDaysArray };
  }, [month, year]);

  const nextMonthData = useMemo(() => {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
    const nextMonthDaysArray = Array.from({ length: nextMonthDays }, (_, i) => i + 1);
    return { nextMonthDaysArray };
  }, [month, year]);

  const reservationsByDay = useMemo(() => {
    const result: Record<string, Reservation[]> = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      result[date.toISOString()] = props.reservations.filter(
        (res) => isSameDay(res.startTime, date) || isSameDay(res.endTime, date),
      );
    }
    return result;
  }, [props.reservations, year, month, daysInMonth]);

  const prevDays = useMemo(() => {
    const fDay = firstDay;
    const result: React.ReactNode[] = [];
    for (let i = 0; i < fDay; i++) {
      const day = prevMonthData.prevMonthDaysArray[prevMonthData.prevMonthDays - fDay + i];
      if (day) {
        result.push(
          <div key={day} className="relative overflow-hidden border-t border-r bg-secondary/50">
            <div className="relative flex flex-col gap-1 p-1 text-muted-foreground text-xs">
              <span className="text-sm leading-none text-muted-foreground self-start px-1 py-0.5 rounded">
                {day}
              </span>
            </div>
          </div>,
        );
      }
    }
    return result;
  }, [firstDay, prevMonthData]);

  const currentDays = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayReservations = (reservationsByDay[date.toISOString()] || []).sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      );

      result.push(
        <div key={date.toISOString()} className="relative overflow-hidden border-t border-r">
          <div className="relative flex flex-col gap-1 p-1 text-xs">
            <span
              className={cn(
                'text-sm leading-none text-muted-foreground self-start px-1 py-0.5 rounded',
                isSameDay(date, new Date()) &&
                  'bg-primary text-primary-foreground font-semibold text-sm',
              )}
            >
              {day}
            </span>
            <div className="flex flex-col gap-0.5 overflow-hidden">
              {dayReservations.slice(0, 3).map((res) => (
                <button
                  key={res.id}
                  type="button"
                  className="truncate rounded border-l-3 px-1.5 py-0.5 text-sm cursor-pointer transition-all hover:opacity-80 flex flex-col gap-0.5 text-left overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReservationId(res.id);
                    if (isMobile) {
                      setDetailPanelOpen(true);
                    }
                  }}
                  style={{
                    borderLeft: '3px solid #3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  }}
                >
                  <div className="flex items-center gap-1 truncate">
                    <span className="font-medium truncate">{format(res.startTime, 'HH:mm')}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="truncate text-muted-foreground text-xs">{res.room.name}</span>
                  </div>
                </button>
              ))}
              {dayReservations.length > 3 && (
                <span className="text-muted-foreground text-xs font-medium">
                  +{dayReservations.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>,
      );
    }
    return result;
  }, [
    daysInMonth,
    year,
    month,
    reservationsByDay,
    setSelectedReservationId,
    isMobile,
    setDetailPanelOpen,
  ]);

  const nextDays = useMemo(() => {
    const fDay = firstDay;
    const result: React.ReactNode[] = [];
    const remainingDays = 7 - ((fDay + daysInMonth) % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        const day = nextMonthData.nextMonthDaysArray[i];
        if (day) {
          result.push(
            <div key={day} className="relative overflow-hidden border-t border-r bg-secondary/50">
              <div className="relative flex flex-col gap-1 p-1 text-muted-foreground text-xs">
                <span className="text-sm leading-none text-muted-foreground self-start px-1 py-0.5 rounded">
                  {day}
                </span>
              </div>
            </div>,
          );
        }
      }
    }
    return result;
  }, [firstDay, daysInMonth, nextMonthData]);

  return (
    <div className="grid min-h-full grid-cols-7 grid-rows-[repeat(6,1fr)]">
      {prevDays}
      {currentDays}
      {nextDays}
    </div>
  );
}

function WeekView(props: Readonly<{ reservations: Reservation[] }>) {
  const { selectedDate, startDay } = useReservationCalendarContext();

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, {
      weekStartsOn: startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    });
    const end = endOfWeek(selectedDate, {
      weekStartsOn: startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    });
    return eachDayOfInterval({ start, end });
  }, [selectedDate, startDay]);

  return (
    <div className="flex h-full grow flex-col overflow-auto">
      <div className="flex border-b">
        <div className="w-14 shrink-0 border-r p-2 text-center text-xs text-muted-foreground">
          Time
        </div>
        <div className="grid grid-cols-7 grow">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                'border-r p-2 text-center text-xs',
                isSameDay(day, new Date()) && 'bg-accent font-semibold',
              )}
            >
              <div className="text-[10px] text-muted-foreground">{format(day, 'EEE')}</div>
              <div className="text-sm font-medium">{format(day, 'd')}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex grow">
        <div className="w-14 shrink-0 border-r">
          {HOURS.map((hour) => (
            <div key={hour} className="h-15 border-b px-2 text-xs text-muted-foreground">
              {format(new Date(2000, 0, 1, hour), 'h a')}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grow">
          {weekDays.map((day) => {
            const dayReservations = props.reservations.filter(
              (res) => isSameDay(res.startTime, day) || isSameDay(res.endTime, day),
            );
            return (
              <div key={day.toISOString()} className="relative border-r">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-15 border-b" />
                ))}
                {dayReservations.map((res) => (
                  <ReservationEvent key={res.id} reservation={res} view="week" />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DayView(props: Readonly<{ reservations: Reservation[] }>) {
  const { selectedDate } = useReservationCalendarContext();

  const dayReservations = useMemo(
    () =>
      props.reservations.filter(
        (res) => isSameDay(res.startTime, selectedDate) || isSameDay(res.endTime, selectedDate),
      ),
    [props.reservations, selectedDate],
  );

  return (
    <div className="flex h-full grow flex-col overflow-auto">
      <div className="border-b p-2 text-center text-sm font-medium">
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </div>
      <div className="relative flex grow">
        <div className="grid grid-cols-1 border-r">
          {HOURS.map((hour) => (
            <div key={hour} className="h-15 border-b px-1 text-xs text-muted-foreground">
              {format(new Date(2000, 0, 1, hour), 'h a')}
            </div>
          ))}
        </div>
        <div className="grow">
          {HOURS.map((hour) => (
            <div key={hour} className="h-15 border-b" />
          ))}
          {dayReservations.map((res) => (
            <ReservationEvent key={res.id} reservation={res} view="day" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReservationCalendarBody(props: Readonly<ReservationCalendarBodyProps>) {
  const { view } = useReservationCalendarContext();

  if (view === 'week') {
    return <WeekView reservations={props.reservations} />;
  }
  if (view === 'day') {
    return <DayView reservations={props.reservations} />;
  }
  return <MonthView reservations={props.reservations} />;
}
