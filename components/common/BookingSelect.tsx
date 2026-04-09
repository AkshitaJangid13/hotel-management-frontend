// components/common/BookingSelect.tsx
"use client";

import { useEffect, useState } from "react";
import { getApi } from "@/lib/api";

type Booking = {
  id: string;
  bookingNumber: string;
  amount: string;
  tax: number;
  discount: number;
  finalAmount: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
};

export default function BookingSelect({
  value,
  onChange,
  placeholder = "Select Booking",
  className,
  error,
}: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getApi("/bookings/all");
        if (res.success) {
          setBookings(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, []);

  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-500" : ""
        } ${className ?? ""}`}
      >
        <option value="" disabled>
          {loading ? "Loading..." : placeholder}
        </option>
        {bookings.map((b) => (
          <option
            key={b.id}
            value={b.id}
            data-booking={JSON.stringify(b)}
          >
            {b.bookingNumber}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
