"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Amenity, AmenityFormData } from "@/types/amenities";
import ImageUpload from "../common/ImageUpload";
const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL;
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
import { amenitySchema } from "@/validation/amenity";

declare const google: any;
type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedAmenity: Amenity | null;
  onSuccess: () => void;
};

export default function AmenityFormModal({
  open,
  setOpen,
  selectedAmenity,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AmenityFormData>({
    mode: "onBlur",
    resolver: yupResolver(amenitySchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedAmenity changes
  useEffect(() => {
    if (open) {
      if (selectedAmenity) {
        console.log({ selectedAmenity });
        reset({
          name: selectedAmenity.name,
          description: selectedAmenity.description || "",
          icon: uploadUrl+selectedAmenity.icon || "",
        });
      } else {
        reset({
          name: "",
          description: "",
          icon: "",
        });
      }
    }
  }, [selectedAmenity, open]);

  const onSubmit = async (data: AmenityFormData) => {
    try {
      const url = selectedAmenity
        ? `/amenities/${selectedAmenity.id}`
        : "/amenities";

      const apiCall = selectedAmenity ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Amenity saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save amenity");
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
            {selectedAmenity ? "Edit Amenity" : "Add Amenity"}
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
            <Label className="mb-2">Name</Label>
            <Input key={selectedAmenity?.id ?? "new"} {...register("name")} />
            <p className="text-red-500 text-xs mt-1">{errors.name?.message}</p>
          </div>

          <div>
            <Label className="mb-2">Description</Label>
            <Input
              key={selectedAmenity?.id ?? "new"}
              {...register("description")}
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.description?.message}
            </p>
          </div>

          <div>
            <ImageUpload
              label="Icon"
              value={watch("icon") ?? ""}
              onChange={(imageName) =>
                setValue("icon", imageName, { shouldValidate: true })
              }
              error={errors.icon?.message}
            />
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
