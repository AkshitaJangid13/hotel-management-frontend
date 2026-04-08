// components/common/CustomerSelect.tsx
"use client";

import { useEffect, useState } from "react";
import { getApi } from "@/lib/api";

type Customer = {
  id: string;
  name: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
};

export default function CustomerSelect({
  value,
  onChange,
  placeholder = "Select Customer",
  className,
  error,
}: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getApi("/customers/all");
        if (res.success) {
          setCustomers(res.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
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
        {customers.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}