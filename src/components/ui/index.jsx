import { forwardRef } from 'react';
import clsx from 'clsx';

export const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', className, loading, disabled, ...props },
  ref
) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };
  const variants = {
    primary: 'gradient-primary text-white hover:opacity-90 active:scale-[0.98] glow-primary',
    secondary: 'bg-elevated border-subtle text-on-bg hover:bg-elevated/70',
    ghost: 'text-muted hover:text-on-bg hover:bg-elevated',
    danger: 'bg-error/10 text-error hover:bg-error/20',
  };
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(base, sizes[size], variants[variant], (disabled || loading) && 'opacity-50 cursor-not-allowed', className)}
      {...props}
    >
      {loading ? <Spinner size={14} /> : children}
    </button>
  );
});

export function IconButton({ icon: Icon, label, size = 18, className, ...props }) {
  return (
    <button
      aria-label={label}
      className={clsx('p-2 rounded-lg text-muted hover:text-on-bg hover:bg-elevated transition-colors', className)}
      {...props}
    >
      <Icon size={size} />
    </button>
  );
}

export const TextField = forwardRef(function TextField(
  { label, icon: Icon, error, className, containerClass, ...props },
  ref
) {
  return (
    <div className={clsx('flex flex-col gap-1.5', containerClass)}>
      {label && <label className="text-sm font-medium text-on-bg">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />}
        <input
          ref={ref}
          className={clsx(
            'w-full bg-elevated border text-sm text-on-bg rounded-xl py-3 outline-none transition-colors placeholder:text-muted',
            Icon ? 'pl-10 pr-4' : 'px-4',
            error ? 'border-error focus:border-error' : 'border-[var(--color-border)] focus:border-primary',
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="text-error text-xs">{error}</p>}
    </div>
  );
});

export function Card({ children, className, ...props }) {
  return (
    <div className={clsx('bg-surface border-subtle rounded-2xl', className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-elevated text-muted',
    primary: 'bg-primary/15 text-primary',
    success: 'bg-green-500/15 text-green-400',
    warning: 'bg-amber-500/15 text-amber-400',
    error: 'bg-red-500/15 text-error',
    info: 'bg-blue-500/15 text-blue-400',
  };
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function Skeleton({ className }) {
  return <div className={clsx('skeleton rounded-lg', className)} />;
}

export function Spinner({ size = 20, className }) {
  return (
    <svg
      className={clsx('animate-spin text-primary', className)}
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon size={28} className="text-primary" />
        </div>
      )}
      <div>
        <p className="font-semibold text-on-bg">{title}</p>
        {description && <p className="text-muted text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Avatar({ name, size = 40, className }) {
  const initials = (name ?? '?').charAt(0).toUpperCase();
  return (
    <div
      className={clsx('rounded-full gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0', className)}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}

export function Divider({ label, className }) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
      {label && <span className="text-muted text-xs">{label}</span>}
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}
