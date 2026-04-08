"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerSchema } from "@/validation/customer";
import { CustomerFormData, Customer } from "@/types/customer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { postApi, putApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import GoogleAddressInput from "../common/GoogleAddressInput";
import CompanySelect from "../common/CompanySelect";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedCustomer: Customer | null;
  onSuccess: () => void;
};

export default function CustomerFormModal({
  open,
  setOpen,
  selectedCustomer,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    mode: "onBlur",
    resolver: yupResolver(customerSchema) as any,
  });

  const submitRef = useRef(false);

  useEffect(() => {
    if (open) {
      if (selectedCustomer) {
        reset({
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          address: selectedCustomer.address?.address || "",
          lat: Number(selectedCustomer.address?.lat || 0),
          long: Number(selectedCustomer.address?.long || 0),
          phone: selectedCustomer.phone,
          companyId: selectedCustomer.companyId,
          idType: selectedCustomer.idType,
          idNumber: selectedCustomer.idNumber,
        });
      } else {
        reset({
          name: "",
          email: "",
          address: "",
          lat: 0,
          long: 0,
          phone: "",
          companyId: "",
          idType: "",
          idNumber: "",
        });
      }
    }
  }, [selectedCustomer, open]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      const url = selectedCustomer
        ? `/customers/${selectedCustomer.id}`
        : "/customers";
      const apiCall = selectedCustomer ? putApi : postApi;

      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Customer saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save Customer");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedCustomer ? "Edit Customer" : "Add Customer"}
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
          {/* Name */}
          <div>
            <Label className="mb-2">Name</Label>
            <Input
              key={selectedCustomer?.id ?? "new"}
              {...register("name")}
              placeholder="Enter name"
            />
            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              key={selectedCustomer?.id ?? "new"}
              {...register("email")}
              placeholder="Enter email"
            />
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Phone</Label>
            <Input
              key={selectedCustomer?.id ?? "new"}
              {...register("phone")}
              placeholder="Enter phone"
            />
            <p className="text-red-500 text-xs mt-1">{errors.phone?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Address</Label>
            <GoogleAddressInput
              open={open} // ✅ pass open so autocomplete reinitializes
              value={watch("address", "")}
              onChange={(val) => setValue("address", val)}
              onSelect={({ address, lat, lng }) => {
                setValue("address", address);
                setValue("lat", lat);
                setValue("long", lng);
              }}
            />
            <p className="text-red-500">{errors.address?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Company</Label>
            <CompanySelect
              value={watch("companyId") ?? ""}
              onChange={(val) =>
                setValue("companyId", val, { shouldValidate: true })
              }
              error={errors.companyId?.message}
            />
            <p className="text-red-500">{errors.companyId?.message}</p>
          </div>
          <div>
            <Label className="mb-2">ID Type</Label>
            <Input
              key={selectedCustomer?.id ?? "new"}
              {...register("idType")}
              placeholder="Enter ID Type"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.idType?.message}
            </p>
          </div>
          <div>
            <Label className="mb-2">ID Number</Label>
            <Input
              key={selectedCustomer?.id ?? "new"}
              {...register("idNumber")}
              placeholder="Enter ID Number"
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.idNumber?.message}
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit" // ✅ removed invalid align="right"
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
