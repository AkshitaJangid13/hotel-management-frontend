"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { companySchema } from "@/validation/company";
import { CompanyFormData, Company } from "@/types/company";
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

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedCompany: Company | null;
  onSuccess: () => void;
};

export default function CompanyFormModal({
  open,
  setOpen,
  selectedCompany,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    mode: "onBlur",
    resolver: yupResolver(companySchema) as any,
  });

  const submitRef = useRef(false);

  useEffect(() => {
    if (open) {
      if (selectedCompany) {
        reset({
          name: selectedCompany.name,
          email: selectedCompany.email,
          address: selectedCompany.address?.address || "",
          lat: Number(selectedCompany.address?.lat || 0),
          long: Number(selectedCompany.address?.long || 0),
          phone: selectedCompany.phone,
        });
      } else {
        reset({
          name: "",
          email: "",
          address: "",
          lat: 0,
          long: 0,
          phone: "",
        });
      }
    }
  }, [selectedCompany, open]);

  const onSubmit = async (data: CompanyFormData) => {
    try {
      const url = selectedCompany
        ? `/companies/${selectedCompany.id}`
        : "/companies";
      const apiCall = selectedCompany ? putApi : postApi;

      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "User saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save company");
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
            {selectedCompany ? "Edit Company" : "Add Company"}
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
              key={selectedCompany?.id ?? "new"}
              {...register("name")}
              placeholder="Enter name"
            />
            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
          </div>

          {/* Email */}
          <div>
            <Label className="mb-2">Email</Label>
            <Input
              key={selectedCompany?.id ?? "new"}
              {...register("email")}
              placeholder="Enter email"
            />
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>
          <div>
            <Label className="mb-2">Phone</Label>
            <Input
              key={selectedCompany?.id ?? "new"}
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
