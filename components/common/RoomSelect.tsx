// components/common/RoomSelect.tsx
"use client";

import { useEffect, useState } from "react";
import { getApi } from "@/lib/api";

type Room = {
  id: string;
  roomNumber: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
};

export default function RoomSelect({
  value,
  onChange,
  placeholder = "Select Room",
  className,
  error,
}: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getApi("/rooms/all");
        if (res.success) {
          setRooms(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
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
        {rooms.map((b) => (
          <option key={b.id} value={b.id}>
            {b.roomNumber}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}