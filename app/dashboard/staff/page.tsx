'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from "react-hot-toast"
import { useSession } from 'next-auth/react'
import { StaffFormData } from '@/lib/validations/staff'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { formatCurrency } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CustomSelect } from '@/components/ui/custom-select'
import { useForm, Controller } from 'react-hook-form'

type StaffWithUser = Staff & {
    user: User | null
    _count: {
        housekeepingLogs: number
    }
}

type Branch = {
    id: string
    name: string
}

type AvailableUser = {
    id: string
    name: string
    email: string
    branchId: string | null
}

export default function StaffPage() {
    const { data: session } = useSession()
    const [staff, setStaff] = useState<StaffWithUser[]>([])
    const [branches, setBranches] = useState<Branch[]>([])
    const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<StaffWithUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const canManage = session?.user.role && ['SUPER_ADMIN', 'COMPANY_ADMIN', 'BRAND_MANAGER', 'BRANCH_MANAGER'].includes(session.user.role)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
        control,
    } = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
    })

    const userId = watch('userId')
    const branchId = watch('branchId')

    useEffect(() => {
        fetchStaff()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    useEffect(() => {
        if (isModalOpen) {
            fetchBranches()
            fetchAvailableUsers()
        }
    }, [isModalOpen])

    useEffect(() => {
        if (selectedStaff) {
            reset({
                userId: selectedStaff.userId,
                branchId: selectedStaff.branchId,
                position: selectedStaff.position,
                salary: selectedStaff.salary ? Number(selectedStaff.salary) : undefined,
                joinDate: new Date(selectedStaff.joinDate).toISOString().split('T')[0],
                shiftTiming: selectedStaff.shiftTiming || '',
            })
        } else {
            reset({
                userId: '',
                branchId: '',
                position: '',
                salary: undefined,
                joinDate: new Date().toISOString().split('T')[0],
                shiftTiming: '',
            })
        }
    }, [selectedStaff, reset])

    const fetchStaff = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('page', page.toString())

            const response = await fetch(`/api/dashboard/staff?${params}`)
            if (response.ok) {
                const data = await response.json()
                setStaff(data.staff)
                setTotal(data.pagination.total)
            }
        } catch (error) {
            console.error('Error fetching staff:', error)
            toast.error('Failed to fetch staff')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchBranches = async () => {
        try {
            const response = await fetch('/api/dashboard/branches')
            if (response.ok) {
                const data = await response.json()
                setBranches(data)
            }
        } catch (error) {
            console.error('Error fetching branches:', error)
        }
    }

    const fetchAvailableUsers = async () => {
        try {
            const response = await fetch('/api/dashboard/users/available')
            if (response.ok) {
                const data = await response.json()
                setAvailableUsers(data)
            }
        } catch (error) {
            console.error('Error fetching available users:', error)
        }
    }

    const onSubmit = async (data: StaffFormData) => {
        try {
            const url = selectedStaff
                ? `/api/dashboard/staff/${selectedStaff.id}`
                : '/api/dashboard/staff'
            const method = selectedStaff ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast.success(
                    selectedStaff ? 'Staff updated successfully' : 'Staff created successfully'
                )
                setIsModalOpen(false)
                setSelectedStaff(null)
                fetchStaff()
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to save staff')
            }
        } catch {
            toast.error('An error occurred')
        }
    }

    const handleDelete = async (staffId: string) => {
        if (!confirm('Are you sure you want to delete this staff member?')) return

        try {
            const response = await fetch(`/api/dashboard/staff/${staffId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast.success('Staff deleted successfully')
                fetchStaff()
            } else {
                toast.error('Failed to delete staff')
            }
        } catch {
            toast.error('An error occurred')
        }
    }

    const handleEdit = (staff: StaffWithUser) => {
        setSelectedStaff(staff)
        setIsModalOpen(true)
    }

    const handleAddNew = () => {
        setSelectedStaff(null)
        setIsModalOpen(true)
    }

    const columns = [
        {
            header: 'Name',
            accessor: (row: StaffWithUser) => row.user?.name || 'N/A',
            cell: (value: unknown) => <span className="font-medium">{String(value)}</span>,
        },
        {
            header: 'Email',
            accessor: (row: StaffWithUser) => row.user?.email || 'N/A',
        },
        {
            header: 'Position',
            accessor: 'position' as keyof Staff,
        },
        {
            header: 'Shift',
            accessor: 'shiftTiming' as keyof Staff,
            cell: (value: unknown) => value ? String(value) : 'N/A',
        },
        {
            header: 'Salary',
            accessor: (row: StaffWithUser) => row.salary ? formatCurrency(row.salary.toString()) : 'N/A',
        },
        {
            header: 'Tasks',
            accessor: (row: StaffWithUser) => row._count.housekeepingLogs,
        },
        {
            header: 'Join Date',
            accessor: (row: StaffWithUser) => new Date(row.joinDate).toLocaleDateString(),
        },
        {
            header: 'Actions',
            accessor: (row: StaffWithUser) => (
                canManage ? (
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(row)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(row.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ) : null
            ),
        },
    ]

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold">Staff Management</h1>
                    <p className="mt-2 text-muted-foreground">Manage hotel staff and their assignments</p>
                </div>
                {canManage && (
                    <Button onClick={handleAddNew}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Staff
                    </Button>
                )}
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-muted-foreground">Loading...</div>
                    </CardContent>
                </Card>
            ) : (
                <DataTable
                    data={staff}
                    columns={columns}
                    emptyMessage="No staff members found. Add your first staff member to get started."
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedStaff ? 'Edit Staff' : 'Add New Staff'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {!selectedStaff && (
                            <div className="space-y-2">
                                <Label htmlFor="userId">User *</Label>
                                <Controller
                                    name="userId"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomSelect
                                            value={userId ? availableUsers.find(u => u.id === userId) ? { label: availableUsers.find(u => u.id === userId)!.name, value: userId } : null : null}
                                            onChange={(option) => field.onChange(option?.value || '')}
                                            options={availableUsers.map(user => ({
                                                label: `${user.name} (${user.email})`,
                                                value: user.id,
                                            }))}
                                            placeholder="Select User"
                                            isClearable={false}
                                        />
                                    )}
                                />
                                {errors.userId && (
                                    <p className="text-sm text-red-600">{errors.userId.message}</p>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="position">Position *</Label>
                                <Input
                                    id="position"
                                    {...register('position')}
                                    placeholder="e.g. Receptionist"
                                />
                                {errors.position && (
                                    <p className="text-sm text-red-600">{errors.position.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="branchId">Branch *</Label>
                                <Controller
                                    name="branchId"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomSelect
                                            value={branchId ? branches.find(b => b.id === branchId) ? { label: branches.find(b => b.id === branchId)!.name, value: branchId } : null : null}
                                            onChange={(option) => field.onChange(option?.value || '')}
                                            options={branches.map(branch => ({
                                                label: branch.name,
                                                value: branch.id,
                                            }))}
                                            placeholder="Select Branch"
                                            isClearable={false}
                                        />
                                    )}
                                />
                                {errors.branchId && (
                                    <p className="text-sm text-red-600">{errors.branchId.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                    id="salary"
                                    type="number"
                                    step="0.01"
                                    {...register('salary', { valueAsNumber: true })}
                                    placeholder="e.g. 30000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shiftTiming">Shift Timing</Label>
                                <Input
                                    id="shiftTiming"
                                    {...register('shiftTiming')}
                                    placeholder="e.g. Morning"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="joinDate">Join Date *</Label>
                            <Input
                                id="joinDate"
                                type="date"
                                {...register('joinDate')}
                            />
                            {errors.joinDate && (
                                <p className="text-sm text-red-600">{errors.joinDate.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : selectedStaff ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

