"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { brandSchema } from "@/validation/brand";
import { Brand, BrandFormData } from "@/types/brand";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import GoogleAddressInput from "../common/GoogleAddressInput";
import { postApi, putApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import BranchSelect from "../common/BranchSelect";

declare const google: any;

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedBrand: Brand | null;
  onSuccess: () => void;
};

export default function BrandFormModal({
  open,
  setOpen,
  selectedBrand,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormData>({
    mode: "onBlur",
    resolver: yupResolver(brandSchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedBrand changes
  useEffect(() => {
    if (open) {
      if (selectedBrand) {
        console.log({ selectedBrand });
        reset({
          name: selectedBrand.name,
          email: selectedBrand.email,
          phone: selectedBrand.phone,
          branchId: selectedBrand.branchId,
          address: selectedBrand.address?.address || "",
          lat: Number(selectedBrand.address?.lat || 0),
          long: Number(selectedBrand.address?.long || 0),
        });
      } else {
        reset({
          name: "",
          address: "",
          email: "",
          phone: "",
          branchId: "",
          lat: 0,
          long: 0,
        });
      }
    }
  }, [selectedBrand, open]);

  // Google autocomplete
  useEffect(() => {
    const input = document.getElementById("address") as HTMLInputElement;

    if (typeof window === "undefined" || !window.google || !input) return;

    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setValue("address", place.formatted_address);
      setValue("lat", place.geometry.location.lat());
      setValue("long", place.geometry.location.lng());
    });
  }, [open]);

  const onSubmit = async (data: BrandFormData) => {
    try {
      const url = selectedBrand ? `/brands/${selectedBrand.id}` : "/brands";

      const apiCall = selectedBrand ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Brand saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save Brand");
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
            {selectedBrand ? "Edit Brand" : "Add Brand"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!submitRef.current) return; // ✅ only submit from Save button
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
            <Label className="mb-2">Name</Label>
            <Input
              key={selectedBrand?.id ?? "new"} // ✅ force remount on Brand change
              {...register("name")}
            />
            <p className="text-red-500">{errors.name?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              key={selectedBrand?.id ?? "new"} // ✅ force remount on Brand change
              {...register("email")}
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Phone</Label>
            <Input
              key={selectedBrand?.id ?? "new"} // ✅ force remount on Brand change
              {...register("phone")}
            />
            <p className="text-red-500">{errors.phone?.message}</p>
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
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              align="right"
              onClick={() => {
                submitRef.current = true; // ✅ only set true when Save is clicked
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
