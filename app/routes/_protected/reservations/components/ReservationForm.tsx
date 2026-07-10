import { useState, useEffect } from 'react';
import { useFetcher } from 'react-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { LoaderCircle, CalendarIcon } from 'lucide-react';
import OrganizationCombobox from '~/components/OrganizationCombobox';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '~/components/ui/combobox';
import { Room } from '~/generated/prisma/client';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { format, isFuture, isToday } from 'date-fns';
import { Calendar } from '~/components/ui/calendar';
import { toast } from 'sonner';
import InputTime from '~/components/ui/input-time';

type ReservationFormProps = {
  rooms: Room[];
  divisions: { id: string; name: string }[];
  departmentsByDivision: Record<string, { id: string; name: string }[]>;
  initialValues?: {
    room?: Room;
    date?: string;
    startTime?: string;
    endTime?: string;
    organizerNik?: string;
    organizerName?: string;
    organizerEmail?: string;
    organizerPhone?: string;
    organizerDivision?: string;
    organizerDepartment?: string;
    agenda?: string;
  };
  onNikChange: (nik: string) => void;
  nikLoading?: boolean;
};

export default function ReservationForm({
  rooms,
  divisions,
  departmentsByDivision,
  initialValues,
  onNikChange,
  nikLoading,
}: Readonly<ReservationFormProps>) {
  const [selectedDivisionId, setSelectedDivisionId] = useState(
    initialValues?.organizerDivision ?? '',
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    initialValues?.organizerDepartment ?? '',
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialValues?.date ? new Date(initialValues.date) : new Date(),
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(initialValues?.room ?? null);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== 'idle';

  useEffect(() => {
    setSelectedDivisionId(initialValues?.organizerDivision ?? '');
    setSelectedDepartmentId(initialValues?.organizerDepartment ?? '');
  }, [initialValues?.organizerDivision, initialValues?.organizerDepartment]);

  useEffect(() => {
    if (fetcher.data?.success === false) {
      toast.error(fetcher.data?.message || 'Failed to submit reservation');
    }
    if (fetcher.data?.success === true) {
      toast.success('Successfully submitted reservation');
    }
  }, [fetcher.data]);

  return (
    <fetcher.Form method="post" className="flex flex-col gap-4">
      <div className="border-b pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">Organizer Details</h3>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="organizerNik">NIK</Label>
        <div className="relative">
          <Input
            id="organizerNik"
            name="organizerNik"
            required
            maxLength={6}
            placeholder="6 digit NIK"
            defaultValue={initialValues?.organizerNik}
            onChange={(e) => onNikChange(e.target.value)}
          />
          {nikLoading && (
            <LoaderCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="organizerName">Name</Label>
        <Input
          id="organizerName"
          name="organizerName"
          required
          defaultValue={initialValues?.organizerName}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="organizerEmail">Email</Label>
        <Input
          id="organizerEmail"
          name="organizerEmail"
          type="email"
          required
          defaultValue={initialValues?.organizerEmail}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="organizerPhone">Phone</Label>
        <Input
          id="organizerPhone"
          name="organizerPhone"
          required
          defaultValue={initialValues?.organizerPhone}
          placeholder="e.g. 081234567890"
        />
        <p className="text-xs text-muted-foreground">
          This phone number will be used for notifications and contact purposes.
        </p>
      </div>

      <OrganizationCombobox
        divisions={divisions}
        departmentsByDivision={departmentsByDivision}
        divisionName="organizerDivision"
        departmentName="organizerDepartment"
        divisionValue={selectedDivisionId}
        departmentValue={selectedDepartmentId}
        onDivisionChange={setSelectedDivisionId}
        onDepartmentChange={setSelectedDepartmentId}
      />

      <div className="border-b pb-2 mb-2 mt-4">
        <h3 className="text-sm font-medium text-muted-foreground">Room & Time</h3>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="roomId">Room</Label>
        <Combobox
          items={rooms}
          value={selectedRoom}
          onValueChange={(item) => setSelectedRoom(item as Room | null)}
          itemToStringLabel={(item: Room) => item.name}
        >
          <ComboboxInput placeholder="Select a room" />
          <ComboboxContent>
            <ComboboxEmpty>No rooms found.</ComboboxEmpty>
            <ComboboxList>
              {(item: Room) => (
                <ComboboxItem key={item.id} value={item}>
                  {item.name} ({item.location})
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <input type="hidden" name="roomId" value={selectedRoom?.id ?? ''} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <div className="relative flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!selectedDate}
                className="w-70 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              >
                <CalendarIcon />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => !isFuture(date) && !isToday(date)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="startTime">Start Time</Label>
          <InputTime name="startTime" id="startTime" defaultValue={initialValues?.startTime} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="endTime">End Time</Label>
          <InputTime name="endTime" id="endTime" defaultValue={initialValues?.endTime} />
        </div>
      </div>

      <div className="border-b pb-2 mb-2 mt-4">
        <h3 className="text-sm font-medium text-muted-foreground">Additional Info</h3>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="agenda">Agenda</Label>
        <Input
          id="agenda"
          name="agenda"
          defaultValue={initialValues?.agenda}
          placeholder="Meeting agenda or purpose (optional)"
        />
      </div>

      <Button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          if (selectedDate) {
            const formValues = new FormData(e?.currentTarget?.form as HTMLFormElement);
            formValues.set('date', format(selectedDate, 'yyyy-MM-dd'));
            fetcher.submit(formValues, { method: 'post' });
            return;
          }
          toast.error('Please fill in all required fields.');
        }}
        className="mt-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
      </Button>
    </fetcher.Form>
  );
}
