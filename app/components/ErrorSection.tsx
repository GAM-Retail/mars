'use client';

import {
  ErrorCode,
  DefaultLink,
  OutlineLink,
  ErrorSectionShell,
  ErrorStagger,
  ErrorStaggerItem,
} from '~/components/ui/not-found-primitives';
import { isRouteErrorResponse } from 'react-router';

export function ErrorSection({
  authorized = false,
  allowRewrite = true,
  initialState,
  error = undefined,
}: Readonly<{
  authorized?: boolean;
  allowRewrite?: boolean;
  initialState?: {
    title?: string;
    description?: string;
    code?: number;
    label?: string;
    href?: string;
  };
  error: unknown;
}>) {
  const init = {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again later',
    code: 500,
    label: 'Go home',
    href: '/dashboard',
    ...initialState,
  };
  let title = init.title;
  let description = init.description;
  let code = init.code;
  let label = init.label;
  let href = init.href;
  if (allowRewrite) {
    if (isRouteErrorResponse(error)) {
      title = error.statusText;
      description = error.data?.message ?? description;
      code = error.status;
      label = error.data?.label ?? label;
      href = error.data?.href ?? href;
    } else if (error instanceof Error) {
      title = 'Unexpected Error';
      description = error.message;
    }
  }
  return (
    <ErrorSectionShell>
      <div className="mx-auto grid w-full max-w-4xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <ErrorStagger className="text-center lg:text-left">
          <ErrorStaggerItem>
            <ErrorCode code={code} size="xl" />
          </ErrorStaggerItem>
        </ErrorStagger>

        <ErrorStagger className="text-center lg:text-left">
          <ErrorStaggerItem>
            <h1 className="text-balance font-medium text-2xl tracking-tight md:text-3xl">
              {title}
            </h1>
          </ErrorStaggerItem>
          <ErrorStaggerItem>
            <p className="mt-4 text-pretty text-muted-foreground text-sm leading-relaxed md:text-base">
              {description}
            </p>
          </ErrorStaggerItem>
          <ErrorStaggerItem>
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <DefaultLink
                {...(authorized ? { href: '/dashboard', label: 'Go to Dashboard' } : {})}
              />
              {label && href && <OutlineLink href={href}>{label}</OutlineLink>}
            </div>
          </ErrorStaggerItem>
        </ErrorStagger>
      </div>
    </ErrorSectionShell>
  );
}
