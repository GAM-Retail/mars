import { Feature } from '~/components/kibo-ui/calendar/types';

import {
  CalendarDate,
  CalendarHeader,
} from '~/components/kibo-ui/calendar/components/CalendarDate';
import { CalendarDatePicker } from '~/components/kibo-ui/calendar/components/CalendarDatePicker';
import { CalendarMonthPicker } from '~/components/kibo-ui/calendar/components/CalendarMonthPicker';
import { CalendarYearPicker } from '~/components/kibo-ui/calendar/components/CalendarYearPicker';
import { CalendarDatePagination } from '~/components/kibo-ui/calendar/components/CalendarDatePagination';
import { CalendarBody } from '~/components/kibo-ui/calendar/components/CalendarBody';
import { CalendarItem } from '~/components/kibo-ui/calendar/components/CalendarItem';
import { CalendarProvider } from '~/components/kibo-ui/calendar/components/CalendarProvider';
const statuses = [
  { id: '123', name: 'Planned', color: '#6B7280' },
  { id: '456', name: 'In Progress', color: '#F59E0B' },
  { id: '789', name: 'Done', color: '#10B981' },
];
const exampleFeatures: Feature[] = [
  {
    id: 'feat-001',
    name: 'Weekly Team Sync',
    startAt: new Date('2026-04-03T09:00:00'),
    endAt: new Date('2026-04-03T10:00:00'),
    status: statuses[0],
  },
  {
    id: 'feat-002',
    name: 'Product Planning Meeting',
    startAt: new Date('2026-04-03T13:00:00'),
    endAt: new Date('2026-04-03T14:30:00'),
    status: statuses[0],
  },
  {
    id: 'feat-003',
    name: 'Design Review',
    startAt: new Date('2026-04-04T10:00:00'),
    endAt: new Date('2026-04-04T11:30:00'),
    status: statuses[2],
  },
  {
    id: 'feat-004',
    name: 'Client Presentation',
    startAt: new Date('2026-04-04T15:00:00'),
    endAt: new Date('2026-04-04T16:00:00'),
    status: statuses[0],
  },
  {
    id: 'feat-005',
    name: 'Engineering Standup',
    startAt: new Date('2026-04-05T09:30:00'),
    endAt: new Date('2026-04-05T10:00:00'),
    status: statuses[2],
  },
  {
    id: 'feat-006',
    name: 'Sprint Retrospective',
    startAt: new Date('2026-04-05T16:00:00'),
    endAt: new Date('2026-04-05T17:00:00'),
    status: statuses[1],
  },
  {
    id: 'feat-007',
    name: 'Marketing Strategy Meeting',
    startAt: new Date('2026-04-06T11:00:00'),
    endAt: new Date('2026-04-06T12:30:00'),
    status: statuses[2],
  },
  {
    id: 'feat-008',
    name: 'Sales Pipeline Review',
    startAt: new Date('2026-04-06T14:00:00'),
    endAt: new Date('2026-04-06T15:00:00'),
    status: statuses[1],
  },
  {
    id: 'feat-009',
    name: 'HR Policy Discussion',
    startAt: new Date('2026-04-07T10:00:00'),
    endAt: new Date('2026-04-07T11:00:00'),
    status: statuses[2],
  },
  {
    id: 'feat-010',
    name: 'Tech Talk Session',
    startAt: new Date('2026-04-07T15:00:00'),
    endAt: new Date('2026-04-07T16:30:00'),
    status: statuses[2],
  },
];

export default function CalendarEventPrototype() {
  const earliestYear =
    exampleFeatures
      .map((feature) => feature.startAt.getFullYear())
      .sort((a, b) => (a < b ? -1 : 1))
      .at(0) ?? new Date().getFullYear();
  const latestYear =
    exampleFeatures
      .map((feature) => feature.endAt.getFullYear())
      .sort((a, b) => (a > b ? 1 : -1))
      .at(-1) ?? new Date().getFullYear();

  return (
    <CalendarProvider>
      <CalendarDate>
        <CalendarDatePicker>
          <CalendarMonthPicker />
          <CalendarYearPicker end={latestYear} start={earliestYear} />
        </CalendarDatePicker>
        <CalendarDatePagination />
      </CalendarDate>
      <CalendarHeader />
      <CalendarBody features={exampleFeatures}>
        {({ feature }) => <CalendarItem feature={feature} />}
      </CalendarBody>
    </CalendarProvider>
  );
}
