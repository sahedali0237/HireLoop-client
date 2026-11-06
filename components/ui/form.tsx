"use client"

import * as React from "react"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form"
import { cn } from "cn"

const Form = React.forwardRef<
  HTMLFormElement,
  React.ComponentPropsWithoutRef<"form">
>(({ className, ...props }, ref) => {
  return <form ref={ref} className={cn(className)} {...props} />
})
Form.displayName = "Form"

type FormFieldRenderProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
> = {
  field: {
    name: TFieldName
    value: FieldPathValue<TFieldValues, TFieldName>
    onChange: (value: unknown) => void
    onBlur: () => void
    ref: (node: HTMLElement | null) => void
  }
  formState: {
    errors: Partial<Record<string, string>>
  }
}

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>
  name: TFieldName
  render?: (
    props: FormFieldRenderProps<TFieldValues, TFieldName>
  ) => React.ReactNode
  children?: (
    props: FormFieldRenderProps<TFieldValues, TFieldName>
  ) => React.ReactNode
}

function FormField<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  render,
  children,
}: FormFieldProps<TFieldValues, TFieldName>) {
  const methods = useFormContext() as UseFormReturn<TFieldValues>
  const fieldControl = control ?? methods.control

  return (
    <Controller<TFieldValues, TFieldName, unknown>
      control={fieldControl}
      name={name}
      render={({ field, fieldState }) => {
        const errors: Record<string, string> = {}
        if (fieldState.error?.message) {
          errors[String(name)] = fieldState.error.message
        }

        const props: FormFieldRenderProps<TFieldValues, TFieldName> = {
          field: {
            name: field.name,
            value: field.value,
            onChange: field.onChange,
            onBlur: field.onBlur,
            ref: field.ref,
          },
          formState: { errors },
        }
        return <>{render?.(props) ?? children?.(props)}</>
      }}
    />
  )
}

function FormItem({
  className,
  ...props
}: React.ComponentProps<"div"> & { className?: string }) {
  return (
    <div
      className={cn("flex flex-col gap-2 sm:flex-row sm:items-end", className)}
      {...props}
    />
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<"label"> & { className?: string }) {
  return (
    <label
      className={cn("text-base font-medium text-foreground", className)}
      {...props}
    />
  )
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("w-full", className)} {...props} />
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn("text-xs font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }
