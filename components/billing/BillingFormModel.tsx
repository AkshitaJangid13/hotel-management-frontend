"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Billing, BillingFormData } from "@/types/billing";
import BookingSelect from "../common/BookingSelect";

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
import { billingSchema } from "@/validation/billing";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedBilling: Billing | null;
  onSuccess: () => void;
};

export default function BillingFormModal({
  open,
  setOpen,
  selectedBilling,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BillingFormData>({
    mode: "onBlur",
    resolver: yupResolver(billingSchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedBilling changes
  useEffect(() => {
    if (open) {
      if (selectedBilling) {
        reset({
          bookingId: selectedBilling.bookingId,
          amount: selectedBilling.amount,
          tax: selectedBilling.tax,
          discount: selectedBilling.discount,
          finalAmount: selectedBilling.finalAmount,
          paymentStatus: selectedBilling.paymentStatus,
          paymentMethod: selectedBilling.paymentMethod,
          paidAmount: selectedBilling.paidAmount,
        });
      } else {
        reset({
          bookingId: "",
          amount: "",
          tax: 0,
          discount: 0,
          finalAmount: "",
          paymentStatus: "",
          paymentMethod: "",
          paidAmount: "",
        });
      }
    }
  }, [selectedBilling, open]);

  const onSubmit = async (data: BillingFormData) => {
    try {
      const url = selectedBilling
        ? `/invoices/${selectedBilling.id}`
        : "/invoices";

      const apiCall = selectedBilling ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Invoice saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save invoice");
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
            {selectedBilling ? "Edit Invoice" : "Add Invoice"}
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
            <Label className="mb-2">Booking</Label>
            {/* <BookingSelect
              value={watch("bookingId") ?? ""}
              onChange={(val: string) => {
                const booking = bookings.find((b) => b.id === val);
                if (!booking) return;

                setValue("bookingId", booking.id);
                setValue("amount", booking.totalAmount);
                setValue("tax", booking.tax);
                setValue("discount", booking.discount);
                setValue("finalAmount", booking.finalAmount);
              }}
              error={errors.bookingId?.message}
            /> */}
            <p className="text-red-500">{errors.bookingId?.message}</p>
          </div>

          <div>
            <Label className="mb-2">Amount</Label>
            <Input {...register("amount")} />
          </div>
          <div>
            <Label className="mb-2">Tax</Label>
            <Input {...register("tax")} />
          </div>
          <div>
            <Label className="mb-2">Discount</Label>
            <Input {...register("discount")} />
          </div>
          <div>
            <Label className="mb-2">Final Amount</Label>
            <Input {...register("finalAmount")} />
          </div>
          <div>
            <Label className="mb-2">Payment Status</Label>

            <select
              {...register("paymentStatus")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <p className="text-red-500">{errors.paymentStatus?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Payment Method</Label>

            <select
              {...register("paymentMethod")}
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Select Method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>

            <p className="text-red-500">{errors.paymentMethod?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Paid Amount</Label>
            <Input {...register("paidAmount")} />
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
