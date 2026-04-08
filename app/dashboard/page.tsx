"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });



  // ✅ Fetch stats (you can replace with real API)
  useEffect(() => {
    const loadStats = async () => {
      try {
        // replace with real API later
        const data = {
          totalRooms: 0,
          availableRooms: 0,
          bookedRooms: 0,
          totalBookings: 0,
          activeBookings: 0,
          totalRevenue: 0,
          totalCustomers: 0,
        };

        setStats(data);
      } catch (error) {
        console.error("Error loading stats");
      }
    };

    loadStats();
  }, []);

  const occupancyRate =
    stats.totalRooms > 0
      ? ((stats.bookedRooms / stats.totalRooms) * 100).toFixed(1)
      : "0";

  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <p className="mt-2 text-muted-foreground">
        Welcome back, {user?.name || "User"}!
      </p>

      {/* Room Statistics */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>{stats.totalRooms}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available</CardTitle>
          </CardHeader>
          <CardContent className="text-green-600">
            {stats.availableRooms}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupied</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-600">
            {stats.bookedRooms}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>{occupancyRate}%</CardContent>
        </Card>
      </div>

      {/* Business Metrics */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>{stats.totalBookings}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-600">
            {stats.activeBookings}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-green-600">
            {formatCurrency(stats.totalRevenue ?? 0)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>{stats.totalCustomers}</CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/bookings" className="border p-4 rounded">
            New Booking
          </Link>

          <Link href="/dashboard/customers" className="border p-4 rounded">
            Add Customer
          </Link>

          <Link href="/dashboard/rooms" className="border p-4 rounded">
            Manage Rooms
          </Link>

          <Link href="/dashboard/housekeeping" className="border p-4 rounded">
            Housekeeping
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
