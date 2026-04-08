'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/status-badge'

type RecentBooking = Booking & {
    customer: Customer
    room: Room & {
        roomType: RoomType
    }
}

type Stats = {
    rooms: {
        total: number
        available: number
        booked: number
        maintenance: number
        occupancyRate: number
    }
    bookings: {
        total: number
        active: number
    }
    customers: {
        total: number
    }
    revenue: {
        total: number
        paid: number
        pending: number
    }
    staff: {
        total: number
    }
    housekeeping: {
        pending: number
    }
}

type BookingTrend = {
    date: string
    count: number
}

export default function ReportsPage() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
    const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/dashboard/reports/stats')
            if (response.ok) {
                const data = await response.json()
                setStats(data.stats)
                setRecentBookings(data.recentBookings)
                setBookingTrends(data.bookingTrends)
            }
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-muted-foreground">Loading statistics...</div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-muted-foreground">Failed to load statistics</div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-semibold">Reports & Analytics</h1>
                <p className="mt-2 text-muted-foreground">View comprehensive hotel performance metrics</p>
            </div>

            {/* Room Statistics */}
            <div className="mb-6">
                <h2 className="mb-4 text-xl font-semibold">Room Overview</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rooms.total}</div>
                            <p className="text-xs text-muted-foreground">All rooms in system</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.rooms.available}</div>
                            <p className="text-xs text-muted-foreground">Ready for booking</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.rooms.booked}</div>
                            <p className="text-xs text-muted-foreground">Currently booked</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.rooms.occupancyRate}%</div>
                            <p className="text-xs text-muted-foreground">Current occupancy</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Revenue & Booking Statistics */}
            <div className="mb-6">
                <h2 className="mb-4 text-xl font-semibold">Revenue & Bookings</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.revenue.total.toString())}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Paid Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.revenue.paid.toString())}</div>
                            <p className="text-xs text-muted-foreground">Received</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.bookings.total}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.bookings.active}</div>
                            <p className="text-xs text-muted-foreground">Current</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Operational Statistics */}
            <div className="mb-6">
                <h2 className="mb-4 text-xl font-semibold">Operations</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.customers.total}</div>
                            <p className="text-xs text-muted-foreground">Registered</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.staff.total}</div>
                            <p className="text-xs text-muted-foreground">Active</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Housekeeping Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.housekeeping.pending}</div>
                            <p className="text-xs text-muted-foreground">Pending</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.revenue.pending}</div>
                            <p className="text-xs text-muted-foreground">Invoices</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Booking Trends */}
            <div className="mb-6">
                <h2 className="mb-4 text-xl font-semibold">Booking Trends (Last 7 Days)</h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-end space-x-2">
                            {bookingTrends.map((trend, index) => {
                                const maxCount = Math.max(...bookingTrends.map(t => t.count), 1)
                                const height = (trend.count / maxCount) * 200
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="text-sm font-bold mb-2">{trend.count}</div>
                                        <div
                                            className="w-full bg-primary rounded-t"
                                            style={{ height: `${height}px`, minHeight: '20px' }}
                                        />
                                        <div className="text-xs text-muted-foreground mt-2">
                                            {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bookings */}
            <div className="mb-6">
                <h2 className="mb-4 text-xl font-semibold">Recent Bookings</h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {recentBookings.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">{booking.customer.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Room {booking.room.roomNumber} ({booking.room.roomType.name})
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="font-medium">{formatCurrency(booking.finalAmount.toString())}</div>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                </div>
                            ))}
                            {recentBookings.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No recent bookings</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

