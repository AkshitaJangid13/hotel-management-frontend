'use client'

import React from 'react'
import Select, { Props as SelectProps, StylesConfig, GroupBase } from 'react-select'
import { cn } from '@/lib/utils'

interface CustomSelectProps<
    Option = { label: string; value: string },
    IsMulti extends boolean = false,
> extends Omit<SelectProps<Option, IsMulti>, 'styles'> {
    className?: string
}

export function CustomSelect<
    Option = { label: string; value: string },
    IsMulti extends boolean = false,
>({ className, ...props }: CustomSelectProps<Option, IsMulti>) {
    const customStyles: StylesConfig<Option, IsMulti, GroupBase<Option>> = {
        control: (base, state) => ({
            ...base,
            minHeight: '40px',
            borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--input))',
            boxShadow: state.isFocused
                ? '0 0 0 2px hsl(var(--ring) / 0.2)'
                : 'none',
            '&:hover': {
                borderColor: 'hsl(var(--ring))',
            },
            backgroundColor: 'hsl(var(--background))',
            fontSize: '14px',
        }),
        placeholder: (base) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
        }),
        singleValue: (base) => ({
            ...base,
            color: 'hsl(var(--foreground))',
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: 'hsl(var(--secondary))',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: 'hsl(var(--secondary-foreground))',
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: 'hsl(var(--secondary-foreground))',
            '&:hover': {
                backgroundColor: 'hsl(var(--destructive))',
                color: 'hsl(var(--destructive-foreground))',
            },
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? '#3b82f6'
                : state.isFocused
                    ? '#e5e7eb'
                    : '#ffffff',
            color: state.isSelected
                ? '#ffffff'
                : '#000000',
            cursor: 'pointer',
            fontSize: '14px',
            padding: '8px 12px',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            zIndex: 50,
            marginTop: '4px',
        }),
        menuList: (base) => ({
            ...base,
            padding: '4px',
        }),
        input: (base) => ({
            ...base,
            color: 'hsl(var(--foreground))',
        }),
    }

    return (
        <div className={cn('w-full', className)}>
            <Select
                styles={customStyles}
                classNamePrefix="react-select"
                {...props}
            />
        </div>
    )
}

