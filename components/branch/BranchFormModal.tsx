"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { branchSchema } from "@/validation/branch";
import { Branch, BranchFormData } from "@/types/branch";

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

declare const google: any;

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedBranch: Branch | null;
  onSuccess: () => void;
};

export default function BranchFormModal({
  open,
  setOpen,
  selectedBranch,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormData>({
    mode: "onBlur",
    resolver: yupResolver(branchSchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedBranch changes
  useEffect(() => {
    if (open) {
      if (selectedBranch) {
        console.log({ selectedBranch });
        reset({
          name: selectedBranch.name,
          address: selectedBranch.address?.address || "",
          lat: Number(selectedBranch.address?.lat || 0),
          long: Number(selectedBranch.address?.long || 0),
        });
      } else {
        reset({
          name: "",
          address: "",
          lat: 0,
          long: 0,
        });
      }
    }
  }, [selectedBranch, open]);

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

  const onSubmit = async (data: BranchFormData) => {
    try {
      const url = selectedBranch
        ? `/branches/${selectedBranch.id}`
        : "/branches";

      const apiCall = selectedBranch ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Branch saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save branch");
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
            {selectedBranch ? "Edit Branch" : "Add Branch"}
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
              key={selectedBranch?.id ?? "new"} // ✅ force remount on branch change
              {...register("name")}
            />
            <p className="text-red-500">{errors.name?.message}</p>
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
