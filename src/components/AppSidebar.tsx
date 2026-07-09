import { For, Show } from 'solid-js';
import { A, useAction, useNavigate } from '@solidjs/router';

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
  LucideIcon,
  Network,
  Presentation,
  User,
  Users,
} from 'lucide-solid';
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
import { logout } from '~/server/controller/session.server';
import { ModeToggle } from '~/components/ModeToggle';

type SidebarItem = {
  groupName: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
  role: UserRole[];
};
const items: SidebarItem[] = [
  {
    groupName: 'Reservation',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'My Schedule',
        url: '/reservation',
        icon: Calendar,
      },
      {
        title: 'Room Info',
        url: '/my-rooms',
        icon: Presentation,
      },
    ],
    role: ['ADMIN', 'SUPERADMIN'],
  },
  {
    groupName: 'Management',
    items: [
      {
        title: 'User Management',
        url: '/user',
        icon: User,
      },
      {
        title: 'Division',
        url: '/division',
        icon: Network,
      },
      {
        title: 'Department',
        url: '/department',
        icon: Users,
      },
    ],
    role: ['SUPERADMIN'],
  },
  {
    groupName: 'Settings',
    items: [
      {
        title: 'Facility',
        url: '/facility',
        icon: LampDesk,
      },
      {
        title: 'Room',
        url: '/room',
        icon: BookKey,
      },
    ],
    role: ['SUPERADMIN'],
  },
];

export function AppSidebar() {
  const userContext = useCurrentUser();
  const logOut = useAction(logout);
  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarHeader>
        <div class="flex items-center gap-2 justify-between">
          <span class="flex items-center gap-2">
            <img src="/gramedia.webp" alt="Gramedia Logo" class="h-10 w-10" />
            <span>
              <p class="text-lg font-semibold">MARS</p>
              <p class="text-xs">V1.1</p>
            </span>
          </span>
          <ModeToggle />
        </div>
        <p class=" text-center">Meeting Area Reservation System</p>
      </SidebarHeader>
      <SidebarContent>
        <For each={items}>
          {(item) => (
            <Show when={item.role.includes(userContext.currentUser?.role as UserRole)}>
              <SidebarGroup>
                <SidebarGroupLabel>{item.groupName}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <For each={item.items}>
                      {(menuItem) => (
                        <SidebarMenuItem>
                          <SidebarMenuButton as={A} href={menuItem.url}>
                            <menuItem.icon />
                            <span>{menuItem.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </For>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </Show>
          )}
        </For>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu placement="right">
          <DropdownMenuTrigger aria-label="User menu">
            <div class="flex justify-between items-center bg-accent p-2 rounded-lg cursor-pointer">
              <div class="flex items-center gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${userContext.currentUser?.name}`}
                  alt="Avatar"
                  class="size-8 rounded-full"
                />
                <span class="flex flex-col text-left text-sm">
                  <p>{userContext.currentUser?.name}</p>
                  <p class="text-xs">
                    {userContext.currentUser?.role === 'SUPERADMIN' ? 'Superadmin' : 'Admin'}
                  </p>
                </span>
              </div>
              <ChevronsUpDown class="size-4 " />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{userContext.currentUser?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as={A} href="/profile" onSelect={() => navigate('/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem as="button" class="w-full" onSelect={logOut}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
