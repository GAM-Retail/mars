import { Contact } from 'lucide-react';

type OrganizerItem = {
  id: string;
  nik: string;
  name: string;
  email: string;
  phone: string;
};

type Props = {
  organizers: OrganizerItem[];
};

export default function DivisionDetailOrganizers({ organizers }: Readonly<Props>) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Organizers</p>
      {organizers.length === 0 ? (
        <p className="text-sm text-muted-foreground">No organizers are assigned to this division</p>
      ) : (
        <div className="relative">
          <div className="flex flex-col gap-2 h-60 overflow-y-auto pr-2">
            {organizers.map((organizer) => (
              <div key={organizer.id} className="flex items-center gap-2 p-2 rounded-md border">
                <Contact className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{organizer.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{organizer.email}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
