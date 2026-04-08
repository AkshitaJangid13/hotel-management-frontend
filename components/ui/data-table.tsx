'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'

interface Column<T> {
    header: string
    accessor: keyof T | ((row: T) => React.ReactNode)
    cell?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    emptyMessage?: string
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    emptyMessage = 'No data found'
}: DataTableProps<T>) {
    if (data.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">{emptyMessage}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableHead key={index}>{column.header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.id}>
                            {columns.map((column, index) => {
                                const value = typeof column.accessor === 'function'
                                    ? column.accessor(row)
                                    : row[column.accessor]

                                return (
                                    <TableCell key={index}>
                                        {column.cell ? column.cell(value, row) : (value as React.ReactNode)}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

