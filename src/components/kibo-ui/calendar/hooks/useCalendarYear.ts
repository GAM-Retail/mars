import { useCalendarContext } from '~/components/kibo-ui/calendar/hooks/useCalendarContext';

export const useCalendarYear = () => {
  const ctx = useCalendarContext();
  return [ctx.year, ctx.setYear] as const;
};
