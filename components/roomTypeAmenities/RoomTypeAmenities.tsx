"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { roomTypeAmenitiesSchema } from "@/validation/roomTypeAmenities";
import { RoomTypeAmenitiesFormData, RoomTypeAmenities } from "@/types/roomTypeAmenities";
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
import AmenitiesSelect from "../common/AmenitiesSelect";
import RoomTypeSelect from "../common/RoomTypeSelect";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  selectedRoomTypeAmenities: RoomTypeAmenities | null;
  onSuccess: () => void;
};

export default function roomTypeAmenitiesFormModal({
  open,
  setOpen,
  selectedRoomTypeAmenities,
  onSuccess,
}: Props) {
  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoomTypeAmenitiesFormData>({
    mode: "onBlur",
    resolver: yupResolver(roomTypeAmenitiesSchema),
  });
  const submitRef = useRef(false);
  // ✅ Reset form when modal opens or selectedRoomTypeAmenities changes
  useEffect(() => {
    if (open) {
      if (selectedRoomTypeAmenities) {
        console.log({ selectedRoomTypeAmenities });
        reset({
          amenityId: selectedRoomTypeAmenities.amenityId,
          roomTypeId: selectedRoomTypeAmenities.roomTypeId,
        });
      } else {
        reset({
          amenityId: "",
          roomTypeId: "",
        });
      }
    }
  }, [selectedRoomTypeAmenities, open]);

 
  const onSubmit = async (data: RoomTypeAmenitiesFormData) => {
    try {
      const url = selectedRoomTypeAmenities ? `/room-type-amenities/${selectedRoomTypeAmenities.id}` : "/room-type-amenities";

      const apiCall = selectedRoomTypeAmenities ? putApi : postApi;
      console.log({ data });
      const res = await apiCall(url, data);

      if (res.success) {
        setOpen(false);
        toast.success(res.message || "Room Type Amenities saved successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to save Room Type Amenities");
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
            {selectedRoomTypeAmenities ? "Edit Room Type Amenitie" : "Add Room Type Amenitie"}
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
            <Label className="mb-2">Amenities</Label>
            <AmenitiesSelect
              value={watch("amenityId") ?? ""}
              onChange={(val) =>
                setValue("amenityId", val, { shouldValidate: true })
              }
              error={errors.amenityId?.message}
            />
            <p className="text-red-500">{errors.amenityId?.message}</p>
          </div>
           <div>
            <Label className="mb-2">Room Type</Label>
            <RoomTypeSelect
              value={watch("roomTypeId") ?? ""}
              onChange={(val) =>
                setValue("roomTypeId", val, { shouldValidate: true })
              }
              error={errors.roomTypeId?.message}
            />
            <p className="text-red-500">{errors.roomTypeId?.message}</p>
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
