import { Link, useNavigate, useFetcher, useLocation } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar';
import {
  BookKey,
  Calendar,
  ChevronsUpDown,
  LampDesk,
  LayoutDashboard,
  Network,
  Presentation,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '~/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { ModeToggle } from '~/components/ModeToggle';

type SidebarItem = {
  groupName: string;
  items: { title: string; url: string; icon: LucideIcon }[];
  role: UserRole[];
};

const items: SidebarItem[] = [
  {
    groupName: 'Reservation',
    items: [
      { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
      { title: 'My Schedule', url: '/reservations', icon: Calendar },
      { title: 'Room Info', url: '/my-rooms', icon: Presentation },
    ],
    role: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
  {
    groupName: 'Management',
    items: [
      { title: 'User Management', url: '/users', icon: User },
      { title: 'Divisi', url: '/divisions', icon: Network },
      { title: 'Department', url: '/departments', icon: Users },
    ],
    role: [UserRole.SUPERADMIN],
  },
  {
    groupName: 'Settings',
    items: [
      { title: 'Facility', url: '/facilities', icon: LampDesk },
      { title: 'Room', url: '/rooms', icon: BookKey },
    ],
    role: [UserRole.SUPERADMIN],
  },
];

export function AppSidebar() {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== 'idle';
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            <img src="/gramedia.webp" alt="Gramedia Logo" className="h-10 w-10" />
            <span>
              <p className="text-lg font-semibold">MARS</p>
              <p className="text-xs">V1.1</p>
            </span>
          </span>
          <ModeToggle />
        </div>
        <p className="text-center text-xs">Meeting Area Reservation System</p>
      </SidebarHeader>
      <SidebarContent>
        {items.map(
          (item) =>
            item.role.includes(currentUser?.role as UserRole) && (
              <SidebarGroup key={item.groupName}>
                <SidebarGroupLabel>{item.groupName}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((menuItem) => (
                      <SidebarMenuItem key={menuItem.title}>
                        <SidebarMenuButton
                          asChild
                          className="bg-sidebar! hover:bg-sidebar-accent! data-[active=true]:bg-sidebar-accent!"
                          isActive={location.pathname === menuItem.url}
                        >
                          <Link to={menuItem.url}>
                            <menuItem.icon />
                            <span>{menuItem.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ),
        )}
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-between items-center bg-accent p-2 rounded-lg cursor-pointer">
              <div className="flex items-center gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${currentUser?.name}`}
                  alt="Avatar"
                  className="size-8 rounded-full"
                />
                <span className="flex flex-col text-left text-sm">
                  <p>{currentUser?.name}</p>
                  <p className="text-xs">
                    {currentUser?.role === 'SUPERADMIN' ? 'Superadmin' : 'Admin'}
                  </p>
                </span>
              </div>
              <ChevronsUpDown className="size-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{currentUser?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <fetcher.Form method="post" action="/logout">
                <button type="submit" className="w-full text-left" disabled={isSubmitting}>
                  Logout
                </button>
              </fetcher.Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
