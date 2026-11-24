import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react'

const buttonVariants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
  secondary:
    'bg-white text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
}

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  )
}

interface CardProps {
  title: string
  children: ReactNode
}

export function Card({ title, children }: CardProps) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
    >
      <h2 id={titleId} className="text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function StatusMessage({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="text-sm text-slate-600">
      {children}
    </p>
  )
}

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800"
    >
      <p>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
