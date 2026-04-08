"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Booking, BookingFormData } from "@/types/booking";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { postApi, putApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { bookingSchema } from "@/validation/booking";
import CustomerSelect from "../common/Customer";
import RoomSelect from "../common/RoomSelect";
import BranchSelect from "../common/BranchSelect";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedBooking: Booking | null;
  onSuccess: () => void;
};

export default function BookingFormModal({
  open,
  setOpen,
  selectedBooking,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    mode: "onBlur",
    resolver: yupResolver(bookingSchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedBooking changes
  useEffect(() => {
    if (open) {
      if (selectedBooking) {
        reset({
          customerId: selectedBooking.customerId,
          roomId: selectedBooking.roomId,
          branchId: selectedBooking.branchId,
          checkInDate: selectedBooking.checkInDate?.split("T")[0] ?? "", // ✅ format date for input
          checkOutDate: selectedBooking.checkOutDate?.split("T")[0] ?? "",
          adults: selectedBooking.adults,
          children: selectedBooking.children,
          totalAmount: selectedBooking.totalAmount,
          discount: selectedBooking.discount ?? 0,
          tax: selectedBooking.tax ?? 0,
          status: selectedBooking.status,
          specialRequests: selectedBooking.specialRequests ?? "",
        });
      } else {
        reset({
          customerId: "",
          roomId: "",
          branchId: "",
          checkInDate: "",
          checkOutDate: "",
          adults: 1,
          children: 0,
          totalAmount: 0,
          discount: 0,
          tax: 0,
          status: "pending",
          specialRequests: "",
        });
      }
    }
  }, [selectedBooking, open]);

  const onSubmit = async (data: BookingFormData) => {
    try {
      const url = selectedBooking
        ? `/bookings/${selectedBooking.id}`
        : "/bookings";

      const apiCall = selectedBooking ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Booking saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save booking");
        onSuccess();
      }
    } catch {
      toast.error("Error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedBooking ? "Edit Booking" : "Add Booking"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!submitRef.current) return;
            submitRef.current = false;
            handleSubmit(onSubmit)(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="space-y-4"
        >
         
          <div>
            <Label className="mb-2">Customer</Label>
            <CustomerSelect
              value={watch("customerId") ?? ""}
              onChange={(val) =>
                setValue("customerId", val, { shouldValidate: true })
              }
              error={errors.customerId?.message}
            />
            <p className="text-red-500">{errors.customerId?.message}</p>
          </div>

          <div>
            <Label className="mb-2">Room</Label>
            <RoomSelect
              value={watch("roomId") ?? ""}
              onChange={(val) =>
                setValue("roomId", val, { shouldValidate: true })
              }
              error={errors.roomId?.message}
            />
            <p className="text-red-500">{errors.roomId?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Branch</Label>
            <BranchSelect
              value={watch("branchId") ?? ""}
              onChange={(val) =>
                setValue("branchId", val, { shouldValidate: true })
              }
              error={errors.branchId?.message}
            />
            <p className="text-red-500">{errors.branchId?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Check In Date</Label>
            <Input
              {...register("checkInDate")}
              type="date"
              className="w-full"
            />
          </div>
          <div>
            <Label className="mb-2">Check Out Date</Label>
            <Input
              {...register("checkOutDate")}
              type="date"
              className="w-full"
            />
          </div>
          <div>
            <Label className="mb-2">Adults</Label>
            <Input {...register("adults")} />
          </div>
          <div>
            <Label className="mb-2">Children</Label>
            <Input {...register("children")} />
          </div>
          <div>
            <Label className="mb-2">Total Amount</Label>
            <Input {...register("totalAmount")} />
          </div>
          <div>
            <Label className="mb-2">Discount</Label>
            <Input {...register("discount")} />
          </div>
          <div>
            <Label className="mb-2">Tax</Label>
            <Input {...register("tax")} />
          </div>
          <div>
            <Label className="mb-2">Status</Label>
            <select
              {...register("status")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <div>
            <Label className="mb-2">Special Requests</Label>
            <Input {...register("specialRequests")} />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                submitRef.current = true;
              }}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
