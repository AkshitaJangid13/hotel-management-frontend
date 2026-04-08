'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { toast } from "react-hot-toast"
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { StatusBadge } from '@/components/ui/status-badge'
import { CustomSelect } from '@/components/ui/custom-select'
import { formatCurrency } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm, Controller } from 'react-hook-form'

type InvoiceWithRelations = Invoice & {
    booking: Booking & {
        customer: Customer
        room: Room & {
            roomType: RoomType
        }
    }
}

interface PaymentFormData {
    paymentStatus: PaymentStatus
    paymentMethod: PaymentMethod
    paidAmount: number
}

export default function BillingPage() {
    const { data: session } = useSession()
    const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithRelations | null>(null)

    const canManage = session?.user.role && ['SUPER_ADMIN', 'COMPANY_ADMIN', 'BRAND_MANAGER', 'BRANCH_MANAGER'].includes(session.user.role)

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
        watch,
        control,
    } = useForm<PaymentFormData>()

    const paymentStatus = watch('paymentStatus')
    const paymentMethod = watch('paymentMethod')

    useEffect(() => {
        fetchInvoices()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, page])

    useEffect(() => {
        if (selectedInvoice) {
            reset({
                paymentStatus: selectedInvoice.paymentStatus,
                paymentMethod: selectedInvoice.paymentMethod || PaymentMethod.CASH,
                paidAmount: Number(selectedInvoice.paidAmount),
            })
        }
    }, [selectedInvoice, reset])

    const fetchInvoices = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter) params.append('status', statusFilter)
            params.append('page', page.toString())

            const response = await fetch(`/api/dashboard/billing?${params}`)
            if (response.ok) {
                const data = await response.json()
                setInvoices(data.invoices)
                setTotal(data.pagination.total)
            }
        } catch (error) {
            console.error('Error fetching invoices:', error)
            toast.error('Failed to fetch invoices')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePaymentUpdate = async (data: PaymentFormData) => {
        if (!selectedInvoice) return

        try {
            const response = await fetch(`/api/dashboard/billing/${selectedInvoice.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast.success('Payment updated successfully')
                setIsPaymentModalOpen(false)
                setSelectedInvoice(null)
                fetchInvoices()
            } else {
                toast.error('Failed to update payment')
            }
        } catch {
            toast.error('An error occurred')
        }
    }

    const handleUpdatePayment = (invoice: InvoiceWithRelations) => {
        setSelectedInvoice(invoice)
        setIsPaymentModalOpen(true)
    }

    const columns = [
        {
            header: 'Invoice #',
            accessor: 'invoiceNumber' as keyof Invoice,
            cell: (value: unknown) => <span className="font-medium">{String(value)}</span>,
        },
        {
            header: 'Booking #',
            accessor: (row: InvoiceWithRelations) => row.booking.bookingNumber,
        },
        {
            header: 'Customer',
            accessor: (row: InvoiceWithRelations) => row.booking.customer.name,
        },
        {
            header: 'Room',
            accessor: (row: InvoiceWithRelations) => `${row.booking.room.roomNumber} (${row.booking.room.roomType.name})`,
        },
        {
            header: 'Amount',
            accessor: (row: InvoiceWithRelations) => formatCurrency(row.finalAmount.toString()),
        },
        {
            header: 'Paid',
            accessor: (row: InvoiceWithRelations) => formatCurrency(row.paidAmount.toString()),
        },
        {
            header: 'Payment Status',
            accessor: (row: InvoiceWithRelations) => (
                <StatusBadge status={row.paymentStatus} />
            ),
        },
        {
            header: 'Method',
            accessor: (row: InvoiceWithRelations) => row.paymentMethod || 'N/A',
        },
        {
            header: 'Actions',
            accessor: (row: InvoiceWithRelations) => (
                canManage && row.paymentStatus !== PaymentStatus.PAID ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdatePayment(row)}
                    >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Update Payment
                    </Button>
                ) : null
            ),
        },
    ]

    // Calculate statistics
    const stats = {
        totalRevenue: invoices.reduce((sum, inv) => sum + Number(inv.finalAmount), 0),
        totalPaid: invoices.reduce((sum, inv) => sum + Number(inv.paidAmount), 0),
        pending: invoices.filter(inv => inv.paymentStatus === PaymentStatus.PENDING).length,
        paid: invoices.filter(inv => inv.paymentStatus === PaymentStatus.PAID).length,
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-semibold">Billing & Payments</h1>
                <p className="mt-2 text-muted-foreground">Manage invoices and payment processing</p>
            </div>

            {/* Statistics Cards */}
            <div className="mb-6 grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue.toString())}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalPaid.toString())}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.paid}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-64">
                        <CustomSelect
                            value={statusFilter ? { label: statusFilter.replace(/_/g, ' '), value: statusFilter } : null}
                            onChange={(option) => {
                                setStatusFilter(option?.value === '_' ? '' : option?.value || '')
                                setPage(1)
                            }}
                            options={[
                                { label: 'All Statuses', value: '_' },
                                { label: 'Pending', value: PaymentStatus.PENDING },
                                { label: 'Paid', value: PaymentStatus.PAID },
                                { label: 'Partially Paid', value: PaymentStatus.PARTIALLY_PAID },
                                { label: 'Refunded', value: PaymentStatus.REFUNDED },
                            ]}
                            placeholder="Filter by Status"
                            isClearable={false}
                        />
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground">Loading...</div>
                    </CardContent>
                </Card>
            ) : (
                <DataTable
                    data={invoices}
                    columns={columns}
                    emptyMessage="No invoices found. Invoices are automatically created with bookings."
                />
            )}

            {total > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} results
                    </p>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setPage(page + 1)}
                            disabled={page * 10 >= total}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Update Payment</DialogTitle>
                    </DialogHeader>

                    {selectedInvoice && (
                        <div className="mb-4">
                            <p className="text-sm text-muted-foreground">
                                Invoice: <span className="font-medium">{selectedInvoice.invoiceNumber}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Total Amount: <span className="font-medium">{formatCurrency(selectedInvoice.finalAmount.toString())}</span>
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(handlePaymentUpdate)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="paymentStatus">Payment Status *</Label>
                            <Controller
                                name="paymentStatus"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        value={paymentStatus ? { label: paymentStatus.replace(/_/g, ' '), value: paymentStatus } : null}
                                        onChange={(option) => field.onChange(option?.value)}
                                        options={[
                                            { label: 'Pending', value: PaymentStatus.PENDING },
                                            { label: 'Paid', value: PaymentStatus.PAID },
                                            { label: 'Partially Paid', value: PaymentStatus.PARTIALLY_PAID },
                                            { label: 'Refunded', value: PaymentStatus.REFUNDED },
                                        ]}
                                        placeholder="Select Status"
                                        isClearable={false}
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method *</Label>
                            <Controller
                                name="paymentMethod"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        value={paymentMethod ? { label: paymentMethod.replace(/_/g, ' '), value: paymentMethod } : null}
                                        onChange={(option) => field.onChange(option?.value)}
                                        options={[
                                            { label: 'Cash', value: PaymentMethod.CASH },
                                            { label: 'Credit Card', value: PaymentMethod.CREDIT_CARD },
                                            { label: 'Debit Card', value: PaymentMethod.DEBIT_CARD },
                                            { label: 'UPI', value: PaymentMethod.UPI },
                                            { label: 'Net Banking', value: PaymentMethod.NET_BANKING },
                                        ]}
                                        placeholder="Select Method"
                                        isClearable={false}
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paidAmount">Paid Amount *</Label>
                            <Input
                                id="paidAmount"
                                type="number"
                                step="0.01"
                                {...register('paidAmount', { valueAsNumber: true })}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Payment'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

