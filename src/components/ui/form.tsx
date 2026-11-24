import {
  useId,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ReactNode,
} from 'react'

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

interface FieldProps {
  label: string
  error?: string
}

interface ControlProps {
  id: string
  className: string
  'aria-invalid'?: true
  'aria-describedby'?: string
}

function Field({
  label,
  error,
  renderControl,
}: FieldProps & { renderControl: (control: ControlProps) => ReactNode }) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {renderControl({
        id,
        className:
          'w-full rounded-lg bg-white px-3 py-2 ring-1 ring-slate-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none aria-invalid:ring-red-500',
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}

export function TextField({
  label,
  error,
  ...props
}: FieldProps & ComponentProps<'input'>) {
  return (
    <Field
      label={label}
      error={error}
      renderControl={(control) => <input {...props} {...control} />}
    />
  )
}

export function TextAreaField({
  label,
  error,
  ...props
}: FieldProps & ComponentProps<'textarea'>) {
  return (
    <Field
      label={label}
      error={error}
      renderControl={(control) => <textarea rows={4} {...props} {...control} />}
    />
  )
}
