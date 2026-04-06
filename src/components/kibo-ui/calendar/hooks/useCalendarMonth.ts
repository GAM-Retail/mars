import { useCalendarContext } from '~/components/kibo-ui/calendar/hooks/useCalendarContext';

export const useCalendarMonth = () => {
  const ctx = useCalendarContext();
  return [ctx.month, ctx.setMonth] as const;
};
