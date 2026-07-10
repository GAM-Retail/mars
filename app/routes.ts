import { index, layout, prefix, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  layout('layouts/auth.tsx', [route('login', 'routes/login.tsx')]),
  route('calendar', 'routes/calendar.tsx'),
  layout('layouts/protected.tsx', [
    index('routes/_protected/index.tsx'),
    route('dashboard', 'routes/_protected/dashboard.tsx'),
    ...prefix('reservations', [
      index('routes/_protected/reservations/home.tsx'),
      route(':id', 'routes/_protected/reservations/id.tsx'),
      route(':id/edit', 'routes/_protected/reservations/edit.tsx'),
      route('new', 'routes/_protected/reservations/new.tsx'),
    ]),
    ...prefix('my-rooms', [
      index('routes/_protected/my-rooms/home.tsx'),
      route(':id', 'routes/_protected/my-rooms/id.tsx'),
    ]),
    ...prefix('users', [
      index('routes/_protected/users/home.tsx'),
      route(':id', 'routes/_protected/users/id.tsx'),
      route(':id/edit', 'routes/_protected/users/edit.tsx'),
      route('new', 'routes/_protected/users/new.tsx'),
    ]),
    ...prefix('departments', [
      index('routes/_protected/departments/home.tsx'),
      route(':id', 'routes/_protected/departments/id.tsx'),
      route(':id/edit', 'routes/_protected/departments/edit.tsx'),
      route('new', 'routes/_protected/departments/new.tsx'),
    ]),
    ...prefix('divisions', [
      index('routes/_protected/divisions/home.tsx'),
      route(':id', 'routes/_protected/divisions/id.tsx'),
      route(':id/edit', 'routes/_protected/divisions/edit.tsx'),
      route('new', 'routes/_protected/divisions/new.tsx'),
    ]),
    ...prefix('facilities', [
      index('routes/_protected/facilities/home.tsx'),
      route(':id', 'routes/_protected/facilities/id.tsx'),
      route(':id/edit', 'routes/_protected/facilities/edit.tsx'),
      route('new', 'routes/_protected/facilities/new.tsx'),
    ]),
    ...prefix('rooms', [
      index('routes/_protected/rooms/home.tsx'),
      route(':id', 'routes/_protected/rooms/id.tsx'),
      route(':id/edit', 'routes/_protected/rooms/edit.tsx'),
      route('new', 'routes/_protected/rooms/new.tsx'),
    ]),
    ...prefix('profile', [
      index('routes/_protected/profile/home.tsx'),
      route('edit', 'routes/_protected/profile/edit.tsx'),
    ]),
  ]),
  route('api/organizer-by-nik/:nik', 'routes/api.organizer-by-nik.tsx'),
  route('*', 'routes/404.tsx'),
  route('logout', 'routes/logout.tsx'),
] satisfies RouteConfig;
