import { For } from 'solid-js';
import { A, useAction } from '@solidjs/router';

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
  Presentation,
  UserKey,
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
import { logout } from '~/lib';

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
        url: '/',
        icon: LayoutDashboard,
      },
      {
        title: 'My Schedule',
        url: '#',
        icon: Calendar,
      },
      {
        title: 'Room Info',
        url: '#',
        icon: Presentation,
      },
    ],
    role: ['superadmin'],
  },
  {
    groupName: 'Settings',
    items: [
      {
        title: 'User Login',
        url: '#',
        icon: UserKey,
      },
      {
        title: 'Facility',
        url: '/facility',
        icon: LampDesk,
      },
      {
        title: 'Room',
        url: '#',
        icon: BookKey,
      },
    ],
    role: ['superadmin', 'admin'],
  },
];

export function AppSidebar() {
  const userContext = useCurrentUser();
  const logOut = useAction(logout);
  return (
    <Sidebar>
      <SidebarHeader>
        <div class="flex items-center gap-2 justify-">
          <img src="/gramedia.webp" alt="Gramedia Logo" class="h-10 w-10" />
          <span>
            <p class="text-lg font-semibold">MARS</p>
            <p class="text-xs">V0.1</p>
          </span>
        </div>
        <p class=" text-center">Meeting Area Reservation System</p>
      </SidebarHeader>
      <SidebarContent>
        <For each={items}>
          {(item) => (
            <SidebarGroup>
              <SidebarGroupLabel>{item.groupName}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <For each={item.items}>
                    {(item) => (
                      <SidebarMenuItem>
                        <SidebarMenuButton as={A} href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </For>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </For>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu placement="right">
          <DropdownMenuTrigger>
            <div class="flex justify-between items-center bg-accent p-2 rounded-lg cursor-pointer">
              <div class="flex items-center gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${userContext.currentUser?.name}`}
                  alt="Avatar"
                  class="size-8 rounded-full"
                />
                <span class="flex flex-col text-left text-sm">
                  <p>{userContext.currentUser?.name}</p>
                  <p class="text-xs">Admin</p>
                </span>
              </div>
              <ChevronsUpDown class="size-4 " />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{userContext.currentUser?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as={A} href="#">
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
