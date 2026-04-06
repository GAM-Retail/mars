import { Status } from '~/components/kibo-ui/calendar/types/Status';

export type Feature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: Status;
};
