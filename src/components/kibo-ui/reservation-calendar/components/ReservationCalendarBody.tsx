import { createMemo, type JSX, For, Show, Switch, Match } from 'solid-js';
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

function ReservationEvent(
  props: Readonly<{ reservation: Reservation; view: 'week' | 'day'; style?: string }>,
): JSX.Element {
  const { setSelectedReservationId, setDetailPanelOpen, isMobile } =
    useReservationCalendarContext();

  const handleClick = () => {
    setSelectedReservationId(props.reservation.id);
    if (isMobile()) {
      setDetailPanelOpen(true);
    }
  };

  const startHour = createMemo(() => getHours(props.reservation.startTime));
  const duration = createMemo(() =>
    differenceInMinutes(props.reservation.endTime, props.reservation.startTime),
  );

  return (
    <button
      class={cn(
        'absolute right-1 cursor-pointer rounded-md border-l-4 px-2 py-1 text-xs shadow-sm transition-all hover:opacity-80',
        props.view === 'week' ? 'left-1' : 'left-10',
        props.style,
      )}
      style={{
        top: `${startHour() * HOUR_HEIGHT + 2}px`,
        height: `${duration()}px`,
        'border-left-color': '#3B82F6',
        'background-color': 'rgba(59, 130, 246, 0.15)',
      }}
      onClick={handleClick}
      onKeyDown={handleClick}
      tabIndex={0}
    >
      <Show when={props.view === 'week'}>
        <div class="flex flex-col gap-0.5 text-left h-full overflow-hidden">
          <span class="font-semibold truncate text-sm">{props.reservation.organizer.name}</span>
          <span class="text-xs text-muted-foreground">
            {format(props.reservation.startTime, 'HH:mm')} -{' '}
            {format(props.reservation.endTime, 'HH:mm')}
          </span>
          <span class="truncate text-xs text-muted-foreground/80">
            {props.reservation.room.name}
          </span>
          <span class="truncate text-xs text-muted-foreground/70">
            {props.reservation.agenda || 'Reservation'}
          </span>
        </div>
      </Show>
      <Show when={props.view === 'day'}>
        <div class="flex flex-col gap-0.5 text-left h-full overflow-hidden">
          <span class="font-semibold text-xs">
            {format(props.reservation.startTime, 'HH:mm')} -{' '}
            {format(props.reservation.endTime, 'HH:mm')}
          </span>
          <span class="text-sm truncate font-medium">
            {props.reservation.agenda || 'Reservation'}
          </span>
          <span class="text-xs text-muted-foreground truncate">
            {props.reservation.room.name} • {props.reservation.organizer.name}
          </span>
          <Show when={props.reservation.organizer.department}>
            <span class="text-xs text-muted-foreground/80 truncate">
              {props.reservation.organizer.department}
            </span>
          </Show>
        </div>
      </Show>
    </button>
  );
}

function MonthView(props: Readonly<{ reservations: Reservation[] }>): JSX.Element {
  const { month, year, startDay, setSelectedReservationId, setDetailPanelOpen, isMobile } =
    useReservationCalendarContext();

  const currentMonthDate = createMemo(() => new Date(year(), month(), 1));
  const daysInMonth = createMemo(() => getDaysInMonth(currentMonthDate()));
  const firstDay = createMemo(() => (getDay(currentMonthDate()) - startDay + 7) % 7);

  const prevMonthData = createMemo(() => {
    const m = month();
    const y = year();
    const prevMonth = m === 0 ? 11 : m - 1;
    const prevMonthYear = m === 0 ? y - 1 : y;
    const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
    const prevMonthDaysArray = Array.from({ length: prevMonthDays }, (_, i) => i + 1);
    return { prevMonthDays, prevMonthDaysArray };
  });

  const nextMonthData = createMemo(() => {
    const m = month();
    const y = year();
    const nextMonth = m === 11 ? 0 : m + 1;
    const nextMonthYear = m === 11 ? y + 1 : y;
    const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
    const nextMonthDaysArray = Array.from({ length: nextMonthDays }, (_, i) => i + 1);
    return { nextMonthDaysArray };
  });

  const reservationsByDay = createMemo(() => {
    const reservations = props.reservations;
    const m = month();
    const y = year();
    const d = daysInMonth();
    const result: Record<string, Reservation[]> = {};
    for (let day = 1; day <= d; day++) {
      const date = new Date(y, m, day);
      result[date.toISOString()] = reservations.filter(
        (res) => isSameDay(res.startTime, date) || isSameDay(res.endTime, date),
      );
    }
    return result;
  });

  const prevDays = createMemo(() => {
    const fDay = firstDay();
    const pd = prevMonthData();
    const result: JSX.Element[] = [];

    for (let i = 0; i < fDay; i++) {
      const day = pd.prevMonthDaysArray[pd.prevMonthDays - fDay + i];
      if (day) {
        result.push(
          <div class="relative flex flex-col gap-1 p-1 text-muted-foreground text-xs">
            <span class="text-sm leading-none text-muted-foreground self-start px-1 py-0.5 rounded">
              {day}
            </span>
          </div>,
        );
      }
    }

    return result;
  });

  const currentDays = createMemo(() => {
    const dm = daysInMonth();
    const m = month();
    const y = year();
    const result: JSX.Element[] = [];

    for (let day = 1; day <= dm; day++) {
      const date = new Date(y, m, day);
      const dayReservations = (reservationsByDay()[date.toISOString()] || []).sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime(),
      );

      result.push(
        <div class="relative flex flex-col gap-1 border-t border-r p-1 text-xs">
          <span
            class={cn(
              'text-sm leading-none text-muted-foreground self-start px-1 py-0.5 rounded',
              isSameDay(date, new Date()) &&
                'bg-primary text-primary-foreground font-semibold text-sm',
            )}
          >
            {day}
          </span>
          <div class="flex flex-col gap-0.5 overflow-hidden">
            <For each={dayReservations.slice(0, 3)}>
              {(res) => (
                <button
                  class="truncate rounded border-l-3 px-1.5 py-0.5 text-sm cursor-pointer transition-all hover:opacity-80 flex flex-col gap-0.5 text-left overflow-hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReservationId(res.id);
                    if (isMobile()) {
                      setDetailPanelOpen(true);
                    }
                  }}
                  style={{
                    'border-left': '3px solid #3B82F6',
                    'background-color': 'rgba(59, 130, 246, 0.15)',
                  }}
                >
                  <div class="flex items-center gap-1 truncate">
                    <span class="font-medium truncate">{format(res.startTime, 'HH:mm')}</span>
                    <span class="text-muted-foreground">•</span>
                    <span class="truncate text-muted-foreground text-xs">{res.room.name}</span>
                  </div>
                </button>
              )}
            </For>
            <Show when={dayReservations.length > 3}>
              <span class="text-muted-foreground text-xs font-medium">
                +{dayReservations.length - 3} more
              </span>
            </Show>
          </div>
        </div>,
      );
    }
    return result;
  });

  const nextDays = createMemo(() => {
    const fDay = firstDay();
    const dm = daysInMonth();
    const nd = nextMonthData();
    const result: JSX.Element[] = [];

    const remainingDays = 7 - ((fDay + dm) % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        const day = nd.nextMonthDaysArray[i];
        if (day) {
          result.push(
            <div class="relative flex flex-col gap-1 p-1 text-muted-foreground text-xs">
              <span class="text-sm leading-none text-muted-foreground self-start px-1 py-[2px] rounded">
                {day}
              </span>
            </div>,
          );
        }
      }
    }
    return result;
  });

  return (
    <div class="grid min-h-full grid-cols-7 grid-rows-[repeat(6,1fr)]">
      <For each={prevDays()}>
        {(day) => (
          <div class="relative overflow-hidden border-t border-r bg-secondary/50">{day}</div>
        )}
      </For>
      <For each={currentDays()}>
        {(day) => <div class={cn('relative overflow-hidden border-t border-r')}>{day}</div>}
      </For>
      <For each={nextDays()}>
        {(day) => (
          <div class="relative overflow-hidden border-t border-r bg-secondary/50">{day}</div>
        )}
      </For>
    </div>
  );
}

function WeekView(props: Readonly<{ reservations: Reservation[] }>): JSX.Element {
  const { selectedDate, startDay } = useReservationCalendarContext();

  const weekDays = createMemo(() => {
    const start = startOfWeek(selectedDate(), {
      weekStartsOn: startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    });
    const end = endOfWeek(selectedDate(), {
      weekStartsOn: startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    });
    return eachDayOfInterval({ start, end });
  });

  return (
    <div class="flex h-full grow flex-col overflow-auto">
      <div class="flex border-b">
        <div class="w-14 shrink-0 border-r p-2 text-center text-xs text-muted-foreground">Time</div>
        <div class="grid grid-cols-7 grow">
          <For each={weekDays()}>
            {(day) => (
              <div
                class={cn(
                  'border-r p-2 text-center text-xs',
                  isSameDay(day, new Date()) && 'bg-accent font-semibold',
                )}
              >
                <div class="text-[10px] text-muted-foreground">{format(day, 'EEE')}</div>
                <div class="text-sm font-medium">{format(day, 'd')}</div>
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="relative flex grow">
        <div class="w-14 shrink-0 border-r">
          <For each={HOURS}>
            {(hour) => (
              <div class="h-[60px] border-b px-2 text-xs text-muted-foreground">
                {format(new Date(2000, 0, 1, hour), 'h a')}
              </div>
            )}
          </For>
        </div>
        <div class="grid grid-cols-7 grow">
          <For each={weekDays()}>
            {(day) => {
              const dayReservations = () =>
                props.reservations.filter(
                  (res) => isSameDay(res.startTime, day) || isSameDay(res.endTime, day),
                );
              return (
                <div class="relative border-r">
                  <For each={HOURS}>{() => <div class="h-[60px] border-b" />}</For>
                  <For each={dayReservations()}>
                    {(res) => <ReservationEvent reservation={res} view="week" />}
                  </For>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
}

function DayView(props: Readonly<{ reservations: Reservation[] }>): JSX.Element {
  const { selectedDate } = useReservationCalendarContext();

  const dayReservations = createMemo(() => {
    const reservations = props.reservations;
    return reservations.filter(
      (res) => isSameDay(res.startTime, selectedDate()) || isSameDay(res.endTime, selectedDate()),
    );
  });

  return (
    <div class="flex h-full grow flex-col overflow-auto">
      <div class="border-b p-2 text-center text-sm font-medium">
        {format(selectedDate(), 'EEEE, MMMM d, yyyy')}
      </div>
      <div class="relative flex grow">
        <div class="grid grid-cols-1 border-r">
          <For each={HOURS}>
            {(hour) => (
              <div class="h-[60px] border-b px-1 text-xs text-muted-foreground">
                {format(new Date(2000, 0, 1, hour), 'h a')}
              </div>
            )}
          </For>
        </div>
        <div class="grow">
          <For each={HOURS}>{() => <div class="h-[60px] border-b" />}</For>
          <For each={dayReservations()}>
            {(res) => <ReservationEvent reservation={res} view="day" />}
          </For>
        </div>
      </div>
    </div>
  );
}

export function ReservationCalendarBody(
  props: Readonly<ReservationCalendarBodyProps>,
): JSX.Element {
  const { view } = useReservationCalendarContext();

  return (
    <Switch fallback={<MonthView reservations={props.reservations} />}>
      <Match when={view() === 'month'}>
        <MonthView reservations={props.reservations} />
      </Match>
      <Match when={view() === 'week'}>
        <WeekView reservations={props.reservations} />
      </Match>
      <Match when={view() === 'day'}>
        <DayView reservations={props.reservations} />
      </Match>
    </Switch>
  );
}
