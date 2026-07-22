'use client';

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { buttonVariants } from '~/components/ui/button';
import { SectionShell } from '~/components/ui/layout-contract';
import { motionStagger, motionViewport } from '~/lib/motion-tokens';
import { cn } from '~/lib/utils';
import { Link } from 'react-router';

const spring = { type: 'spring' as const, duration: 0.3, bounce: 0 };

export function useNotFoundItemVariants() {
  const reduceMotion = useReducedMotion();

  return reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, filter: 'blur(4px)', y: 8 },
        visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: spring },
      };
}

export function ErrorStagger({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, motionViewport);

  return (
    <motion.div
      animate={inView ? 'visible' : 'hidden'}
      className={className}
      initial="hidden"
      ref={ref}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: motionStagger.item, delayChildren: 0.04 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ErrorStaggerItem({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  const itemVariants = useNotFoundItemVariants();

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export function ErrorCode({
  code,
  className,
  size = 'lg',
}: Readonly<{
  code: number;
  className?: string;
  size?: 'lg' | 'xl';
}>) {
  return (
    <p
      className={cn(
        'font-mono font-medium tracking-tighter tabular-nums',
        size === 'xl' ? 'text-7xl md:text-8xl' : 'text-6xl md:text-7xl',
        className,
      )}
    >
      {code}
    </p>
  );
}

export function DefaultLink({
  href = '/login',
  label = 'Login',
  className,
}: Readonly<{ className?: string; href?: string; label?: string }>) {
  return (
    <Link
      className={cn(buttonVariants(), 'active:scale-[0.96] transition-transform', className)}
      to={href}
    >
      <ArrowLeftIcon data-icon="inline-start" />
      {label}
    </Link>
  );
}

export function OutlineLink({
  href,
  children,
  className,
}: Readonly<{
  href: string;
  children: ReactNode;
  className?: string;
}>) {
  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'active:scale-[0.96] transition-transform',
        className,
      )}
      to={href}
    >
      {children}
    </Link>
  );
}

type Link = {
  href: string;
  label: string;
  description?: string;
};
export function NotFoundLinkCard({ link }: Readonly<{ link: Link }>) {
  return (
    <Link
      className="group flex flex-col gap-1 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/30 active:scale-[0.98]"
      to={link.href}
    >
      <span className="flex items-center justify-between gap-2 font-medium text-sm">
        {link.label}
        <ArrowRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </span>
      {link.description ? (
        <span className="text-pretty text-muted-foreground text-xs leading-relaxed">
          {link.description}
        </span>
      ) : null}
    </Link>
  );
}

export function NotFoundLinkRow({ link }: Readonly<{ link: Link }>) {
  return (
    <Link
      className="group flex min-h-11 items-center justify-between gap-4 border-border border-b py-3.5 last:border-b-0 transition-colors hover:bg-muted/25"
      to={link.href}
    >
      <div className="min-w-0">
        <p className="font-medium text-sm">{link.label}</p>
        {link.description ? (
          <p className="mt-0.5 truncate text-muted-foreground text-xs">{link.description}</p>
        ) : null}
      </div>
      <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function ErrorSectionShell({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <SectionShell spacingMode="section" className={cn('flex min-h-[90vh] items-center', className)}>
      {children}
    </SectionShell>
  );
}
